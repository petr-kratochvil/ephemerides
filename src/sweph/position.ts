import sweph, { constants } from "sweph";
import { EphDate } from "../types";
import { swephConfig } from "../config";
import { expandPosition } from "../utils";

export function position(date: EphDate) {
  const julday_ut = sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );

  return swephConfig.bodies.map((body) => {
    const calc = sweph.calc_ut(julday_ut, body, swephConfig.flag);
    const name = sweph.get_planet_name(body);
    if (calc.error) {
      return { name, error: calc.error };
    }
    const pos = calc.data[0];
    const speed = calc.data[3];
    const detail = expandPosition(pos);
    return {
      name,
      position: pos,
      speed,
      retrograde: speed < 0,
      ...detail
    };
  });
}
