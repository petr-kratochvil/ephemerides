import { Request, Response } from "express";
import { transits } from "../computation/transits";

export function getTransits(req: Request, res: Response) {
  const baseDate = req.body.baseDate;
  const transitDate = req.body.transitDate;
  const result = transits(baseDate, transitDate);
  res.json(result)
}