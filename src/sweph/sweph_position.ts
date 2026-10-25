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

export function sweph_get_date(julday_ut: number): JsonDate {
  return sweph.revjul(julday_ut, constants.SE_GREG_CAL);
}

export function sweph_body_position(
  julday_ut: number,
  body: BodyId,
): EphObjectPosition {
  const calc = sweph.calc_ut(julday_ut, body, swephConfig.flag);
  // A negative flag means the calculation failed. A message with a non-negative flag
  // is only a warning - typically that the date lies outside the bundled ephemeris
  // files, where Swiss Ephemeris silently falls back to its built-in Moshier
  // ephemeris. The station search does reach such dates, as it samples up to about
  // two years around the requested one.
  if (calc.flag < 0) {
    throw new SwephCalculationError(body, calc.error);
  }
  return {
    type: "body",
    bodyId: body,
    position: calc.data[0],
    speed: calc.data[3],
  } as EphObjectPosition;
}
