import { Request, Response } from "express";
import { transits } from "../computation/transits";
import { formatSwephError } from "../format/formatPosition";
import { SwephError } from "../types";

export function getTransits(req: Request, res: Response) {
  try {
    const baseDate = req.body.baseDate;
    const transitDate = req.body.transitDate;
    const result = transits(baseDate, transitDate);
    res.json(result);
  } catch (error) {
    res.status(500).json(formatSwephError(error as SwephError));
  }
}
