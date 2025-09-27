import { Address } from "viem";

import { Result, Order } from "../models";
import { useOrderDbClient } from "utils";

export const createNewOrderService = async (
  order: Order,
): Promise<Result<Order[] | string>> => {
  try {
    const response = await useOrderDbClient.insertOrder(order);
    if (response.status !== 201) {
      return response;
    }
    return { status: 201, data: "Order booked." };
  } catch (e: any) {
    return {
      status: 400,
      data: e.message,
    };
  }
};

export const getPendingOrdersService = async (
  chain_id: number,
  address: Address | string,
  is_open: boolean,
): Promise<Result<Order[] | string>> => {
  const matchQuery = {};
  if (chain_id) {
    matchQuery["chain_id"] = chain_id;
  }

  matchQuery["address"] = address;

  if (is_open) {
    matchQuery["status"] = "NEW";
  }
  try {
    const response = await useOrderDbClient.getPending(matchQuery);
    return response;
  } catch (e: any) {
    return { status: 400, data: e.message as string };
  }
};

export const getOrderService = (id: string) => {
  // read order table select on id
  return {};
};
