import { Request, Response } from "express";
import { houses } from "../sweph/houses";
import {
  formatHousePosition,
  formatPointPosition,
} from "../format/formatPosition";

export function gethouses(req: Request, res: Response) {
  const housesAndPoints = houses(req.body);
  res.json({
    houses: housesAndPoints.houses.map(formatHousePosition),
    points: housesAndPoints.points.map(formatPointPosition),
  });
}
