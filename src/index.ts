import express from "express";
import cors from "cors";
import { orderRouter, resolveOrderRouter } from "./routes";

const app = express();
const PORT = 8008;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("OK!");
});

app.use("/order", orderRouter);
app.use("/resolve", resolveOrderRouter);

app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
