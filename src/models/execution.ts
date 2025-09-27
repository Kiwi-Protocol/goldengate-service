import { Address } from "viem";

export type Execution = {
  id: number | null;
  order_id: string;
  chain_id: number;
  amount_0: string;
  amount_1: string;
  start_time: string;
  address: Address;
  currency_0: Address;
  currency_1: Address;
  signature: string;
  status: string;
};
