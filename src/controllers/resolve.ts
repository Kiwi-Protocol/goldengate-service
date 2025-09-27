import { Request } from "express";
import { resolveOrderService } from "../services";

export const resolveOrderController = async (req: Request) => {
  return await resolveOrderService();
};
