import sweph, { constants } from "sweph";
import { EphDate } from "../types";
import { swephCofig } from "../config";

export function houses(date: EphDate) {
  const julday_ut = sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );

  return sweph.houses(
    julday_ut,
    swephCofig.lat,
    swephCofig.lon,
    swephCofig.houseType
  );
}
