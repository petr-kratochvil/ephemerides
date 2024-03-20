import { EphDate } from "../types";
import { eph_position } from "../sweph/position";
import { aspects } from "./aspects";
import {
  formatBodyPosition,
  formatPointPosition,
} from "../format/formatPosition";
import { eph_houses } from "../sweph/houses";

export function transits(baseDate: EphDate, transitDate: EphDate) {
  const basePosition = [
    ...eph_position(baseDate).map(formatBodyPosition),
    ...eph_houses(baseDate).points.map(formatPointPosition),
  ];
  const transitPosition = eph_position(transitDate).map(formatBodyPosition);
  return aspects(transitPosition, basePosition);
}
