import sweph, { constants } from "sweph";
import { EphDate } from "../types";
import { swephConfig } from "../config";
import { expandPosition } from "../utils";

export function houses(date: EphDate) {
  const julday_ut = sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );

  const calc = sweph.houses(
    julday_ut,
    swephConfig.lat,
    swephConfig.lon,
    swephConfig.houseMethod
  );
  const points = {
    AC: calc.data.points[0],
    MC: calc.data.points[1],
    ARMC: calc.data.points[2],
    vertex: calc.data.points[3],
    equatorialAscendant: calc.data.points[4],
    coAscendantWK: calc.data.points[5],
    coAscendantMM: calc.data.points[6],
    polarAscendantMM: calc.data.points[7],
  };
  const pointsWithDetail = {};
  Object.entries(points).forEach(([key, value]) =>
    Object.assign(pointsWithDetail, {
      [key]: { position: value, ...expandPosition(value) },
    })
  );
  return {
    houses: calc.data.houses.map((pos) => ({
      position: pos,
      ...expandPosition(pos),
    })),
    points: pointsWithDetail,
  };
}
