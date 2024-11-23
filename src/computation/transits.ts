import { EphDate, GeoCoordinates } from "../types";
import { sweph_position } from "../sweph/sweph_position";
import { aspects } from "./aspects";
import {
  formatObjectPosition,
} from "../format/formatPosition";
import { sweph_houses } from "../sweph/sweph_houses";

export function transits(baseDate: EphDate, transitDate: EphDate, baseDateCoordinates?: GeoCoordinates) {
  const basePosition = [
    ...sweph_position(baseDate).map(formatObjectPosition),
    ...sweph_houses(baseDate, baseDateCoordinates)
      .filter(pos => !(pos.type == 'house' && [1,4,7,10].includes(pos.houseNumber)))
      .map(formatObjectPosition),
  ];
  const transitPosition = sweph_position(transitDate).map(formatObjectPosition);
  return aspects(transitPosition, basePosition);
}
