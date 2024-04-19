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
  if ("bodyId" in pos.object) {
    return {
      type: 'body',
      ...formatPosition(pos.position),
      name: get_planet_name(pos.object.bodyId),
      retrograde:
        "speed" in pos && typeof pos.speed === "number" && pos.speed < 0,
      speed:
        "speed" in pos && typeof pos.speed === "number" ? pos.speed : 0,
    };
  } else if ("houseNumber" in pos.object) {
    return {
      type: 'house',
      name: `House ${pos.object.houseNumber}`,
      ...formatPosition(pos.position),
    };
  } else {
    return {
      type: 'point',
      name: pos.object.pointName,
      ...formatPosition(pos.position),
    };
  }
}

export function formatSwephError(error: SwephError): FormattedSwephError {
  return {
    ...error,
    body_name: error.body == null ? undefined : get_planet_name(error.body),
  };
}