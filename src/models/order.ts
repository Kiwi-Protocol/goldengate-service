import { Address } from "viem";

export type Order = {
  id: string;
  created_at: string;
  signature: string;
  chain_id: number;
  amount_0: string;
  amount_1: string;
  total_trades: number | undefined;
  interval: number | undefined;
  max_interval: number | undefined;
  address: Address;
  currency_0: Address;
  currency_1: Address;
  status: string;
};
