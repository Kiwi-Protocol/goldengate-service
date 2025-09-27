import { Address } from "viem";

export type Order = {
  id: string;
  created_at: string;
  signature: string;
  chain_id: number;
  amount_0: number;
  amount_1: number;
  batch_size: number | undefined;
  interval: number | undefined;
  max_interval: number | undefined;
  address: Address;
  currency_0: Address;
  currency_1: Address;
  status: string;
};
