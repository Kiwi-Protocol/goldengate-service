import { Request, Response } from "express";
import { Result } from "../models";

export * from "./db";

export const makeCallback = (controller: Function) => {
  return (req: Request, res: Response) => {
    try {
      controller(req).then((response: Result) => {
        res.status(response.status).send(response.data);
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Something went wrong!");
    }
  };
};
