import { Request, Response } from "express";
import { eph_houses } from "../sweph/houses";
import {
  formatHousePosition,
  formatPointPosition,
} from "../format/formatPosition";

export function gethouses(req: Request, res: Response) {
  const housesAndPoints = eph_houses(req.body);
  res.json({
    houses: housesAndPoints.houses.map(formatHousePosition),
    points: housesAndPoints.points.map(formatPointPosition),
  });
}
