import { Request, Response } from "express";
import { houses } from "../sweph/houses";

export function gethouses(req: Request, res: Response) {
  const result = houses(req.body);
  res.json(result)
}