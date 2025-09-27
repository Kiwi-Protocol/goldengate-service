import { Request } from "express";
import {
  createNewOrderService,
  getAllOrdersService,
  getOrderService,
} from "../services";
import { Order } from "../models";

export const createNewOrderController = (req: Request) => {
  const order: Order = req.body;
  return createNewOrderService(order);
};

export const getAllOrdersController = (req: Request) => {
  const { passed_chain_id, address, passed_is_open } = req.query;
  let chain_id = -1;
  if (!passed_chain_id) {
    const parsedChainId = parseInt(passed_chain_id as string, 10);
    if (!Number.isInteger(parsedChainId)) {
      return {
        status: 400,
        data: "chain_id is not integer.",
      };
    }
    chain_id = parsedChainId;
  } else {
    return {
      status: 400,
      data: "chain_id cannot be null.",
    };
  }
  if (!address) {
    return {
      status: 400,
      data: "address cannot be null.",
    };
  }
  let is_open = false;
  if (passed_is_open) {
    is_open = passed_is_open === "true";
  }
  return getAllOrdersService(chain_id, address as string, is_open);
};

export const getOrderController = (id: string) => {
  if (!id) {
    return {
      status: 400,
      data: "order id cannot be null / undefined.",
    };
  }
  return getOrderService(id);
};
