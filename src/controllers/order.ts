import { Request } from "express";
import {
  createNewOrderService,
  getPendingOrdersService,
  getOrderService,
} from "../services";
import { Order } from "../models";

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
  }: Order = req.body;

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
  const order: Order = {
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
