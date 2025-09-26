import { Request } from "express";
import { resolveOrderService } from "../services";

export const resolveOrderController = (req: Request) => {
  const { id } = req.body;

  if (!id) {
    return {
      status: 400,
      data: "Missing information. Required field: id",
    };
  }

  return resolveOrderService(id);
};
