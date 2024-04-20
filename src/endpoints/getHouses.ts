import { Request, Response } from "express";
import { sweph_houses } from "../sweph/sweph_houses";
import {
  formatObjectPosition,
  formatSwephError,
} from "../format/formatPosition";
import { SwephError } from "../types";

export function gethouses(req: Request, res: Response) {
  try {
    const housesAndPoints = sweph_houses(req.body);
    res.json(housesAndPoints.map(formatObjectPosition));
  } catch (error) {
    res.status(500).json(formatSwephError(error as SwephError));
  }
}
