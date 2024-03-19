import { EphDate } from "../types";
import { sw_position } from "../sweph/position";
import { aspects } from "./aspects";
import { formatBodyPosition } from "../format/formatPosition";

export function transits(baseDate: EphDate, transitDate: EphDate) {
  const basePosition = sw_position(baseDate);
  const transitPosition = sw_position(transitDate);
  return aspects(
    transitPosition.map(formatBodyPosition),
    basePosition.map(formatBodyPosition)
  );
}
