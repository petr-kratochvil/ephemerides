import { Request, Response } from "express";
import { sweph_position } from "../sweph";
import {
  formatObjectPosition,
  formatSwephError,
} from "../format/formatPosition";
import { SwephError } from "../types";
import { assertJsonDate, ValidationError } from "../validation";

export function getPosition(req: Request, res: Response) {
  try {
    assertJsonDate(req.body, "body");
    const position = sweph_position(req.body);
    res.json(position.map((p) => formatObjectPosition(p)));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json(formatSwephError(error as SwephError));
    }
  }
}
