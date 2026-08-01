import { Request, Response } from "express";
import { sweph_houses } from "../sweph";
import {
  formatObjectPosition,
  formatSwephError,
} from "../format/formatPosition";
import { SwephError } from "../types";
import {
  assertGeoCoordinatesIfPresent,
  assertJsonDate,
  ValidationError,
} from "../validation";

export function gethouses(req: Request, res: Response) {
  try {
    assertJsonDate(req.body.baseDate, "baseDate");
    assertGeoCoordinatesIfPresent(
      req.body.baseDateCoordinates,
      "baseDateCoordinates",
    );
    const housesAndPoints = sweph_houses(
      req.body.baseDate,
      req.body.baseDateCoordinates,
    );
    res.json(housesAndPoints.map(formatObjectPosition));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json(formatSwephError(error as SwephError));
    }
  }
}
