import { Address } from "viem";

export type Order = {
  id: string;
  chainId: number;
  amount: number;
  limit_price: number | undefined;
  batch_size: number | undefined;
  interval: number | undefined;
  address: Address;
  currency_0: Address;
  currency_1: Address;
  status: string;
};
