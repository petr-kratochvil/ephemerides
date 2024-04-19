import { Request, Response } from "express";
import { sweph_position } from "../sweph/sweph_position";
import {
  formatObjectPosition,
  formatSwephError,
} from "../format/formatPosition";
import { SwephError } from "../types";

export function getPosition(req: Request, res: Response) {
  try {
    const position = sweph_position(req.body);
    res.json(position.map((p) => formatObjectPosition(p)));
  } catch (error) {
    res.status(500).json(formatSwephError(error as SwephError));
  }
}
