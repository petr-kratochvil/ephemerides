import sweph, { constants } from "sweph";
import { EphDate, EphObject, EphObjectPosition, GeoCoordinates } from "../types";
import { swephConfig } from "../config";
import { oppositePosition } from "../utils";

export function sweph_houses(date: EphDate, geoCoordinates?: GeoCoordinates): EphObjectPosition[] {
  const julday_ut = sweph.julday(
    date.year,
    date.month,
    date.day,
    date.hour,
    constants.SE_GREG_CAL
  );

  const calc = sweph.houses(
    julday_ut,
    geoCoordinates?.lat ?? swephConfig.lat,
    geoCoordinates?.lon ?? swephConfig.lon,
    swephConfig.houseMethod
  );

  const points = {
    AC: calc.data.points[0],
    IC: oppositePosition(calc.data.points[1]),
    DC: oppositePosition(calc.data.points[0]),
    MC: calc.data.points[1],
    ARMC: calc.data.points[2],
    vertex: calc.data.points[3],
    antiVertex: oppositePosition(calc.data.points[3]),
    equatorialAscendant: calc.data.points[4],
    coAscendantWK: calc.data.points[5],
    coAscendantMM: calc.data.points[6],
    polarAscendantMM: calc.data.points[7],
  } as Record<string, number>;

  const pointsPositions = swephConfig.points.map(
    (pointName) =>
      ({
        type: "point",
        pointName,
        position: points[pointName],
      } as EphObjectPosition)
  );

  return calc.data.houses
    .map(
      (pos, index) =>
        ({
          type: "house",
          houseNumber: index + 1,
          position: pos,
        } as EphObjectPosition)
    )
    .concat(pointsPositions);
}
