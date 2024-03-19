import { Request, Response } from "express";
import { sw_position } from "../sweph/position";
import {
  formatBodyPosition,
  formatBodyPositionError,
} from "../format/formatPosition";
import { BodyPositionError } from "../types";

export function getPosition(req: Request, res: Response) {
  try {
    const positions = sw_position(req.body);
    res.json(positions.map((p) => formatBodyPosition(p)));
  } catch (error) {
    res.json(formatBodyPositionError(error as BodyPositionError));
  }
}
