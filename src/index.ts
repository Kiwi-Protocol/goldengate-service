import express from "express";
import cors from "cors";

import { placeOrder, getPendingOrders } from "./service";

const app = express();
const PORT = 8008;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK!");
});

app.post("/order", (req, res) => {
  const {
    fromChain,
    fromToken,
    fromAmount,
    fromAddress,
    toChain,
    toToken,
    toAmount,
    toAddress,
  } = req.body;

  if (
    !fromChain ||
    !fromToken ||
    !fromAmount ||
    !fromAddress ||
    !toChain ||
    !toToken ||
    !toAmount ||
    !toAddress
  ) {
    res
      .status(400)
      .send(
        "Missing information. Required fields: fromChain, fromToken, fromAmount,  fromAddress,  toChain, toToken, toAmount, toAddress",
      );
  }
  const order = {
    fromChain,
    fromToken,
    fromAmount,
    fromAddress,
    toChain,
    toToken,
    toAmount,
    toAddress,
  };
  placeOrder(order);
});

app.get("/orders", (req, res) => {
  try {
    const orders = getPendingOrders();
    res.status(200).send(orders);
  } catch (e: any) {
    res.status(500).send(e.message);
  }
});

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
