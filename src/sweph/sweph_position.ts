import sweph, { constants } from "sweph";
import { BodyId, EphDate, EphObjectPosition, SwephError } from "../types";
import { swephConfig } from "../config";

export function sweph_position(date: EphDate): EphObjectPosition[] {
  const julday_ut = get_julday(date);

  return swephConfig.bodies.map((body) => {
   return sweph_body_position(julday_ut, body);
  });
}

export function get_julday(date: EphDate): number {
  return sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );
}

export function sweph_body_position(julday_ut: number, body: BodyId): EphObjectPosition {
  const calc = sweph.calc_ut(julday_ut, body, swephConfig.flag);
  if (calc.error) {
    throw { body, error: calc.error } as SwephError;
  }
  return {
    type: "body",
    bodyId: body,
    position: calc.data[0],
    speed: calc.data[3],
  } as EphObjectPosition;
}