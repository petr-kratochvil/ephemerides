import sweph, { constants } from "sweph";
import { BodyId, JsonDate, EphObjectPosition, SwephError } from "../types";
import { swephConfig } from "../config";

export class SwephCalculationError extends Error implements SwephError {
  body: BodyId;
  error: string;

  constructor(body: BodyId, error: string) {
    super(error);
    this.body = body;
    this.error = error;
  }
}

export function sweph_position(date: JsonDate): EphObjectPosition[] {
  const julday_ut = sweph_get_julday(date);

  return swephConfig.bodies.map((body) => {
    return sweph_body_position(julday_ut, body);
  });
}

export function sweph_get_julday(date: JsonDate): number {
  return sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL,
  );
}

export function sweph_body_position(
  julday_ut: number,
  body: BodyId,
): EphObjectPosition {
  const calc = sweph.calc_ut(julday_ut, body, swephConfig.flag);
  if (calc.error) {
    throw new SwephCalculationError(body, calc.error);
  }
  return {
    type: "body",
    bodyId: body,
    position: calc.data[0],
    speed: calc.data[3],
  } as EphObjectPosition;
}
