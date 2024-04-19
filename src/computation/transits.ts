import { EphDate } from "../types";
import { sweph_position } from "../sweph/sweph_position";
import { aspects } from "./aspects";
import {
  formatBodyPosition,
  formatPointPosition,
} from "../format/formatPosition";
import { sweph_houses } from "../sweph/sweph_houses";

export function transits(baseDate: EphDate, transitDate: EphDate) {
  const basePosition = [
    ...sweph_position(baseDate).map(formatBodyPosition),
    ...sweph_houses(baseDate).points.map(formatPointPosition),
  ];
  const transitPosition = sweph_position(transitDate).map(formatBodyPosition);
  return aspects(transitPosition, basePosition);
}
