import { Request, Response } from "express";
import { eph_position } from "../sweph/position";
import {
  formatBodyPosition,
  formatSwephError,
} from "../format/formatPosition";
import { SwephError } from "../types";

export function getPosition(req: Request, res: Response) {
  try {
    const positions = eph_position(req.body);
    res.json(positions.map((p) => formatBodyPosition(p)));
  } catch (error) {
    res.status(500).json(formatSwephError(error as SwephError));
  }
}
