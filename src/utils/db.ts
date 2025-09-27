import { createClient } from "@supabase/supabase-js";
import { Order, Execution, Result } from "../models";
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
  async function insertExecution(order: Order): Promise<Result<Order[]>> {
    try {
      const clientInstance = await getDbClient();
      const execution: Execution = {};
      execution.status = "PENDING";
      const response = await clientInstance
        .from("Execution")
        .insert(execution)
        .select();
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
  });
};

const useOrderDb = (getDbClient: Function) => {
  async function getPending(matchQuery: object): Promise<Result<Order[]>> {
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

  async function insertOrder(order: Order): Promise<Result<Order[]>> {
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
      return response;
    } catch (e: any) {
      return { status: 400, data: e.message };
    }
  }

  return Object.freeze({
    getPending,
    findById,
    insertOrder,
  });
};

export const useOrderDbClient = useOrderDb(createDbClient);
