import {
  EIP712Object,
  EIP712Types,
  EIP712DomainType,
} from "@1inch/limit-order-sdk";
import { Order } from "../models";
export const createNewOrderService = (order: Order, signature: String) => {
  console.log(order);
  const expectedSignerAddress = order.fromAddress; // The address expected to have signed

  const isValid = await verifyEIP712Signature(
    {
      domain: typedData.domain,
      types: { Order: typedData.types.Order },
      message: typedData.message,
    },
    signature,
    expectedSignerAddress
  );

  if (isValid) {
    console.log("EIP-712 signature is valid!");
  } else {
    console.log("EIP-712 signature is invalid.");
  }
};

export const getPendingOrdersService = () => {
  return {};
};

export const getOrderService = (id: string) => {
  return {};
};
