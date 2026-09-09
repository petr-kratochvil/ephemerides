import { Request, Response } from "express";
import { transits } from "../computation/transits";
import { formatSwephError } from "../format/formatPosition";
import { SwephError } from "../types";
import { parseBody, transitsBodySchema, ValidationError } from "../validation";

export function getTransits(req: Request, res: Response) {
  try {
    const { baseDate, transitDate, baseDateCoordinates } = parseBody(
      transitsBodySchema,
      req.body,
    );
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
