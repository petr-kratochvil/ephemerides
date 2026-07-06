import { JsonDate, GeoCoordinates } from "../types";
import { sweph_position } from "../sweph";
import { aspects } from "./aspects";
import { formatObjectPosition } from "../format/formatPosition";
import { sweph_houses } from "../sweph";

export function transits(
  baseDate: JsonDate,
  transitDate: JsonDate,
  baseDateCoordinates?: GeoCoordinates
) {
  const basePosition = [
    ...sweph_position(baseDate).map(formatObjectPosition),
    ...sweph_houses(baseDate, baseDateCoordinates)
      .filter(pos => !(pos.type == 'house' && [1,4,7,10].includes(pos.houseNumber)))
      .map(formatObjectPosition),
  ];
  const transitPosition = sweph_position(transitDate).map(formatObjectPosition);
  return aspects(transitPosition, basePosition);
}
