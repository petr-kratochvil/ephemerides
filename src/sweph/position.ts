import sweph, { constants } from "sweph";
import { EphDate } from "../types";
import { swephCofig } from "../config";

export function position(date: EphDate) {
  const julday_ut = sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );

  return swephCofig.bodies.map((body) => ({
    [sweph.get_planet_name(body)]: sweph.calc_ut(
      julday_ut,
      body,
      swephCofig.flag
    ),
  }));
}
