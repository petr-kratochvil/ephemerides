import { Request, Response } from "express";
import { sweph_houses } from "../sweph/sweph_houses";
import {
  formatHousePosition,
  formatPointPosition,
  formatSwephError,
} from "../format/formatPosition";
import { SwephError } from "../types";

export function gethouses(req: Request, res: Response) {
  try {
    const housesAndPoints = sweph_houses(req.body);
    res.json({
      houses: housesAndPoints.houses.map(formatHousePosition),
      points: housesAndPoints.points.map(formatPointPosition),
    });
  } catch (error) {
    res.status(500).json(formatSwephError(error as SwephError));
  }
}
