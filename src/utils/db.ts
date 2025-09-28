import { createClient } from "@supabase/supabase-js";
import { Order, Execution, Result } from "../models";
import { BigNumber as BN } from "bignumber.js";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";
const TOTAL_TRADES = process.env.TOTAL_TRADES ?? "";

export const createDbClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });
};

const getSplits = (totalAmnt: number, splitCount: number) => {
  const mySet = new Set();
  if (splitCount == 1) {
    return [];
  }
  while (mySet.size <= splitCount) {
    let current = Math.ceil(Math.random() * totalAmnt);
    if (current > 0) {
      mySet.add(current);
    }
  }
  const myArray = Array.from(mySet);
  // @ts-ignore
  myArray.sort((a, b) => a - b);
  console.log(myArray);
  return myArray;
};

const useExecutionDb = (getDbClient: Function) => {
  async function insertExecution(
    order: Order,
  ): Promise<Result<Execution[] | string>> {
    try {
      const clientInstance = await getDbClient();
      let totalAmount0 = BN(0);
      let totalTime = 0;
      // if we have a defined batch size
      let total_trades = BN(0);
      if (order.total_trades) {
        total_trades = BN(order.total_trades);
      } else {
        total_trades = BN(Math.ceil(Math.random() * +TOTAL_TRADES));
      }
      const total_splits = getSplits(+order.amount_0, +total_trades);
      const splits = [];
      for (let i = 1; total_trades.isGreaterThan(i); i++) {
        // @ts-ignore
        splits.push(total_splits[i] - total_splits[i - 1]);
      }
      let idx = 0;
      while (
        totalAmount0.isLessThan(BN(order.amount_0)) &&
        total_trades.isGreaterThan(idx)
      ) {
        let time_diff = Math.random() * 10;
        if (order.max_interval && order.interval) {
          time_diff =
            Math.random() * (+order.max_interval - +order.interval + 1) +
            order.interval;
        }
        totalTime += time_diff;

        // these are the execution amounts
        let amount_0 = BN(0);
        let amount_1 = BN(0);

        amount_0 = BN(splits[idx]);
        idx += 1;
        amount_1 = BN(order.amount_1)
          .multipliedBy(amount_0)
          .dividedBy(BN(order.amount_0));

        totalAmount0 = totalAmount0.plus(amount_0);

        const start_time = new Date(order.created_at);
        start_time.setMinutes(start_time.getMinutes() + totalTime);
        console.log(amount_0, amount_1, start_time);
        // @ts-ignore
        const execution: Execution = {
          order_id: order.id,
          chain_id: order.chain_id,
          address: order.address,
          currency_0: order.currency_0,
          currency_1: order.currency_1,
          signature: order.signature,
          status: "PENDING",
          // @ts-ignore
          start_time: start_time.toISOString(),
          amount_0: amount_0.toString(),
          amount_1: amount_1.toString(),
        };

        const response = await clientInstance
          .from("Execution")
          .insert(execution)
          .select();
        console.log(response);
      }
      return {
        status: 201,
        data: "Execution plan created.",
      };
    } catch (e: any) {
      console.log(e.message);
      return { status: 400, data: e.message };
    }
  }
  async function getOpenExecutions(): Promise<Result<Order[]>> {
    try {
      const clientInstance = await getDbClient();
      const currentTime = new Date().toISOString();

      const query = clientInstance
        .from("Execution")
        .select()
        .match({
          status: "PENDING",
        })
        .lt("start_time", currentTime);
      const response = await query;
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      console.log(e.message);
      return { status: 400, data: e.message };
    }
  }

  async function findByOrderId(order_id: string): Promise<Result<Order[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("Execution")
        .select()
        .match({ order_id: order_id });
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      console.log(e.message);
      return { status: 400, data: e.message };
    }
  }
  async function updateExecutionToOngoing(
    id: string,
  ): Promise<Result<Order[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("Execution")
        .update({ status: "ONGOING" })
        .eq("id", id);
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  return Object.freeze({
    insertExecution,
    getOpenExecutions,
    findByOrderId,
    updateExecutionToOngoing,
  });
};

const useOrderDb = (getDbClient: Function) => {
  async function getAll(matchQuery: object): Promise<Result<Order[]>> {
    try {
      const clientInstance = await getDbClient();
      const query = clientInstance.from("Order").select();
      if (matchQuery != null) {
        query.match(matchQuery);
      }
      const response = await query;
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function findById(id: string): Promise<Result<Order[]>> {
    try {
      const clientInstance = await getDbClient();

      const response = await clientInstance
        .from("Order")
        .select()
        .match({ id: id });
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  async function insertOrder(
    order: Order,
  ): Promise<Result<Order[] | Execution[] | string>> {
    try {
      const clientInstance = await getDbClient();
      order.status = "NEW";
      const response = await clientInstance
        .from("Order")
        .insert(order)
        .select();
      if (response.error) {
        return { status: response.status, data: response.error.message };
      }
      const execResponse = await useExecutionDbClient.insertExecution(
        response.data[0],
      );
      if (execResponse.status != 201) {
        return execResponse;
      }
      return { status: 201, data: response.data };
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  return Object.freeze({
    getAll,
    findById,
    insertOrder,
  });
};

export const useOrderDbClient = useOrderDb(createDbClient);
export const useExecutionDbClient = useExecutionDb(createDbClient);
