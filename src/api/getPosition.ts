import { Request, Response } from "express";
import { position } from "../sweph/position";

export function getPosition(req: Request, res: Response) {
  const result = position(req.body);
  res.set('Access-Control-Allow-Origin', '*')
  res.json(result)
}