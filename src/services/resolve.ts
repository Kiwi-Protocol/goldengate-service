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

const makerTraits = MakerTraits.default();

export const resolveOrderService = async () => {
  const response = await useExecutionDbClient.getOpenExecutions();
  if (response.status != 200) {
    return response;
  }
  const numExecToExecute = response.data.length;
  for (let idx = 0; idx < numExecToExecute; idx++) {
    const execution = response.data[idx];
    // @ts-ignore
    await placeOrderForExecution(execution);
  }
  return {
    status: 200,
    data: "Resolved orders.",
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
      maker: new Address(execution.address),
    },
    makerTraits,
  );

  const typedData = order.getTypedData(execution.chain_id);
  const signature = await maker.signTypedData(
    typedData.domain,
    { Order: typedData.types.Order },
    typedData.message,
  );

  await sdk.submitOrder(order, signature);
};
