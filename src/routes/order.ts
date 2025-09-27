import { makeCallback } from "../utils";
import {
  createNewOrderController,
  getOrderController,
  getPendingOrdersController,
} from "../controllers";

import express from "express";
export const orderRouter = express.Router();

orderRouter.post("/", makeCallback(createNewOrderController));
orderRouter.get("/:id", makeCallback(getOrderController));
orderRouter.get(
  "/user/:chain_id/:address/:is_open",
  makeCallback(getPendingOrdersController),
);
