import { EphDate } from "../types";
import { eph_position } from "../sweph/position";
import { aspects } from "./aspects";
import { formatBodyPosition } from "../format/formatPosition";

export function transits(baseDate: EphDate, transitDate: EphDate) {
  const basePosition = eph_position(baseDate);
  const transitPosition = eph_position(transitDate);
  return aspects(
    transitPosition.map(formatBodyPosition),
    basePosition.map(formatBodyPosition)
  );
}
