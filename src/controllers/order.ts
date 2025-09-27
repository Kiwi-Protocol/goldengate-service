import { Request } from "express";
import {
  createNewOrderService,
  getAllOrdersService,
  getOrderService,
} from "../services";
import { Order } from "../models";

export const createNewOrderController = async (req: Request) => {
  const order: Order = req.body;
  return await createNewOrderService(order);
};

export const getAllOrdersController = async (req: Request) => {
  const { chain_id, address, is_open } = req.params;
  console.log(chain_id, address, is_open);
  let passed_is_open = is_open;
  try {
    if (!chain_id || !Number.isInteger(+chain_id)) {
      return {
        status: 400,
        data: "chain_id cannot be null",
      };
    }
    console.log("Chain");
    if (!address) {
      return {
        status: 400,
        data: "address cannot be null.",
      };
    }
  } catch (e: any) {
    return {
      status: 400,
      data: e.message,
    };
  }
  console.log("ADD");
  let finally_is_open = false;
  if (passed_is_open) {
    finally_is_open = passed_is_open === "true";
  }
  console.log("OPEN");
  return await getAllOrdersService(
    // @ts-ignore
    Number.parseInt(chain_id),
    address as string,
    finally_is_open,
  );
};

export const getOrderController = async (req: Request) => {
  const { id } = req.params;
  if (!id) {
    return {
      status: 400,
      data: "order id cannot be null / undefined.",
    };
  }
  return await getOrderService(id);
};
