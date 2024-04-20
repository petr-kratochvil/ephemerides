import { get_planet_name } from "sweph";
import {
  EphObjectPosition,
  FormattedPosition,
  SwephError,
  FormattedSwephError,
  FormattedObjectPosition,
} from "../types";

function degMinSec(position: number) {
  const deg = Math.floor(position % 30);
  const remainderMin = (position % 30) - deg;
  const min = Math.floor(remainderMin * 60);
  const remainderSec = remainderMin * 60 - min;
  const sec = Math.floor(remainderSec * 60);
  return { deg, min, sec };
}

export function formatPosition(position: number): FormattedPosition {
  const dms = degMinSec(position);
  return {
    position,
    sign: Math.floor(position / 30) + 1,
    degrees: dms.deg,
    minutes: dms.min,
    seconds: dms.sec,
  };
}

export function formatObjectPosition(
  pos: EphObjectPosition
): FormattedObjectPosition {
  const result: Partial<FormattedObjectPosition> = {
    ...pos,
    ...formatPosition(pos.position),
  };
  if (pos.type === "body") {
    result.name = get_planet_name(pos.bodyId);
    if ("speed" in pos && typeof pos.speed === "number") {
      result.retrograde = pos.speed < 0;
      result.speed = pos.speed;
    }
  } else if (pos.type === "house") {
    let ordinal = 'st';
    if (pos.houseNumber > 1) {
      ordinal = 'nd';
    }
    if (pos.houseNumber > 2) {
      ordinal = 'rd';
    }
    if (pos.houseNumber > 3) {
      ordinal = 'th';
    }
    result.name = `${pos.houseNumber}${ordinal} house`;
  } else if (pos.type === "point") {
    result.name = pos.pointName;
  }
  return result as FormattedObjectPosition;
}

export function formatSwephError(error: SwephError): FormattedSwephError {
  return {
    ...error,
    body_name: error.body == null ? undefined : get_planet_name(error.body),
  };
}
