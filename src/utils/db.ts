import { createClient } from "@supabase/supabase-js";
import { Order, Execution, Result } from "../models";
import { BigNumber as BN } from "bignumber.js";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

export const createDbClient = () => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
    },
  });
};

const useExecutionDb = (getDbClient: Function) => {
  async function insertExecution(
    order: Order,
  ): Promise<Result<Execution[] | string>> {
    try {
      const clientInstance = await getDbClient();
      let totalAmount0 = BN(0);
      let totalTime = 0;
      while (totalAmount0.isLessThan(BN(order.amount_0))) {
        let randomTime = 0; // TODO: sometime between order.interval and order.max_interval
        totalTime += randomTime;

        // these are the execution amounts
        let amount_0 = BN(0);
        let amount_1 = BN(0);

        // if we have a defined batch size
        let batch_size = BN(0);
        if (order.batch_size) {
          batch_size = BN(order.batch_size);
        } else {
          batch_size = BN(0); // TODO: random batch_size
        }

        amount_0 = BN.min(batch_size, BN(order.amount_0).minus(totalAmount0));
        amount_1 = BN(order.amount_1)
          .multipliedBy(amount_0)
          .dividedBy(BN(order.amount_0));

        const execution: Execution = {
          order_id: order.id,
          chain_id: order.chain_id,
          address: order.address,
          currency_0: order.currency_0,
          currency_1: order.currency_1,
          signature: order.signature,
          status: "PENDING",
          id: null,
          start_time: order.created_at + totalTime, // TODO: update time
          amount_0: amount_0.toString(),
          amount_1: amount_1.toString(),
        };

        const response = await clientInstance
          .from("Execution")
          .insert(execution)
          .select();
      }
      return {
        status: 201,
        data: "Execution plan created.",
      };
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  return Object.freeze({
    insertExecution,
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
      const execResponse = await useExecutionDbClient.insertExecution(order);
      if (execResponse.status != 201) {
        return execResponse;
      }
      return response;
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
