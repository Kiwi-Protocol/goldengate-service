import { Request } from "express";
import { resolveOrderService } from "../services";

export const resolveOrderController = (req: Request) => {
  return resolveOrderService();
};
