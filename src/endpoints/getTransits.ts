import { Request, Response } from "express";
import { transits } from "../computation/transits";
import { formatSwephError } from "../format/formatPosition";
import { SwephError } from "../types";
import {
  assertGeoCoordinatesIfPresent,
  assertJsonDate,
  ValidationError,
} from "../validation";

export function getTransits(req: Request, res: Response) {
  try {
    const baseDate = req.body.baseDate;
    const transitDate = req.body.transitDate;
    const baseDateCoordinates = req.body.baseDateCoordinates;
    assertJsonDate(baseDate, "baseDate");
    assertJsonDate(transitDate, "transitDate");
    assertGeoCoordinatesIfPresent(baseDateCoordinates, "baseDateCoordinates");
    const result = transits(baseDate, transitDate, baseDateCoordinates);
    res.json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json(formatSwephError(error as SwephError));
    }
  }
}
