import { makeCallback } from "../utils";
import { resolveOrderController } from "../controllers";

import express from "express";
export const resolveOrderRouter = express.Router();

resolveOrderRouter.post("/", makeCallback(resolveOrderController));
