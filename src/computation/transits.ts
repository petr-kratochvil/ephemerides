import { EphDate } from "../types";
import { sweph_position } from "../sweph/sweph_position";
import { aspects } from "./aspects";
import {
  formatObjectPosition,
} from "../format/formatPosition";
import { sweph_houses } from "../sweph/sweph_houses";

export function transits(baseDate: EphDate, transitDate: EphDate) {
  const basePosition = [
    ...sweph_position(baseDate).map(formatObjectPosition),
    ...sweph_houses(baseDate)
      .filter((pos) => pos.object.type === "point")
      .map(formatObjectPosition),
  ];
  const transitPosition = sweph_position(transitDate).map(formatObjectPosition);
  return aspects(transitPosition, basePosition);
}
