import { Address } from "viem";

export type Execution = {
  id: number;
  order_id: string;
  chainId: number;
  amount_0: number;
  amount_1: number | undefined;
  start_time: string;
  address: Address;
  currency_0: Address;
  currency_1: Address;
  signature: string;
  status: string;
};
