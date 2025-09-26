import { Request } from "express";
import {
  createNewOrderService,
  getPendingOrdersService,
  getOrderService,
} from "../services";

export const createNewOrderController = (req: Request) => {
  const {
    fromChain,
    fromToken,
    fromAmount,
    fromAddress,
    toChain,
    toToken,
    toAmount,
    toAddress,
  } = req.body;

  if (
    !fromChain ||
    !fromToken ||
    !fromAmount ||
    !fromAddress ||
    !toChain ||
    !toToken ||
    !toAmount ||
    !toAddress
  ) {
    return {
      status: 400,
      data: "Missing information. Required fields: fromChain, fromToken, fromAmount,  fromAddress,  toChain, toToken, toAmount, toAddress",
    };
  }
  const order = {
    fromChain,
    fromToken,
    fromAmount,
    fromAddress,
    toChain,
    toToken,
    toAmount,
    toAddress,
  };
  return createNewOrderService(order);
};

export const getPendingOrdersController = () => {
  return getPendingOrdersService();
};

export const getOrderController = (id: string) => {
  return getOrderService(id);
};
