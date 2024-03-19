import { Request, Response } from "express";
import { sw_position } from "../sweph/position";
import { formatBodyPosition, formatBodyPositionError } from "../format/formatPosition";

export function getPosition(req: Request, res: Response) {
  const positions = sw_position(req.body);
  res.json(
    positions.map((p) => {
      if ("error" in p) {
        return formatBodyPositionError(p);
      }
      return formatBodyPosition(p);
    })
  );
}
