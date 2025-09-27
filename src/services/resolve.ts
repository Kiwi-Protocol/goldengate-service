import { useExecutionDbClient } from "../utils";

import {
  Sdk,
  MakerTraits,
  Address,
  randBigInt,
  FetchProviderConnector,
} from "@1inch/limit-order-sdk";

import { Wallet } from "ethers";
import { Execution } from "../models";

const privKey = process.env.PRIVATE_KEY ?? "";
const maker = new Wallet(privKey);
const expiresIn = 120n; // 2 minutes
const expiration = BigInt(Math.floor(Date.now() / 1000)) + expiresIn;
const UINT_40_MAX = (1n << 48n) - 1n;

const makerTraits = MakerTraits.default()
  .allowMultipleFills()
  .allowPartialFills()
  .withExpiration(expiration);

export const resolveOrderService = async () => {
  const response = await useExecutionDbClient.getOpenExecutions();
  if (response.status != 200) {
    return response;
  }
  const numExecToExecute = response.data.length;
  for (let idx = 0; idx < numExecToExecute; idx++) {
    const execution = response.data[idx];
    // @ts-ignore
    console.log(await placeOrderForExecution(execution));
    useExecutionDbClient.updateExecutionToOngoing(response.data[idx].id);
  }
  return {
    status: 200,
    data: "Placed orders for execution.",
  };
};

const placeOrderForExecution = async (execution: Execution) => {
  const sdk = new Sdk({
    authKey: process.env.ONE_INCH_API_KEY ?? "",
    networkId: execution.chain_id,
    httpConnector: new FetchProviderConnector(),
  });

  const order = await sdk.createOrder(
    {
      makerAsset: new Address(execution.currency_0),
      takerAsset: new Address(execution.currency_1),
      makingAmount: BigInt(execution.amount_0),
      takingAmount: BigInt(execution.amount_1),
      maker: new Address(maker.address),
    },
    makerTraits,
  );

  const typedData = order.getTypedData(execution.chain_id);
  const signature = await maker.signTypedData(
    typedData.domain,
    { Order: typedData.types.Order },
    typedData.message,
  );

  return await sdk.submitOrder(order, signature);
};
