import sweph, { constants } from "sweph";
import { EphDate, BodyPosition, SwephError } from "../types";
import { swephConfig } from "../config";

export function sweph_position(date: EphDate): BodyPosition[] {
  const julday_ut = sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );

  return swephConfig.bodies.map((body) => {
    const calc = sweph.calc_ut(julday_ut, body, swephConfig.flag);
    if (calc.error) {
      throw { body, error: calc.error } as SwephError;
    }
    return {
      body,
      position: calc.data[0],
      speed: calc.data[3],
    } as BodyPosition;
  });
}
