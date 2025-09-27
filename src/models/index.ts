export * from "./order";
export * from "./execution";

export type Result<T = string> = {
  status: number;
  data: T;
};
