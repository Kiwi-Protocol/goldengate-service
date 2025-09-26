import { makeCallback } from "../utils";
import { resolveOrderController } from "../controllers";

import express from "express";
export const orderRouter = express.Router();

orderRouter.post("/", makeCallback(resolveOrderController));
