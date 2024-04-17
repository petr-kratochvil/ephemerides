import { get_planet_name } from "sweph";
import {
  FormattedBodyPosition,
  BodyPosition,
  FormattedPosition,
  HousePosition,
  PointPosition,
  FormattedHousePosition,
  FormattedPointPosition,
  SwephError,
  FormattedSwephError,
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

export function formatBodyPosition(pos: BodyPosition): FormattedBodyPosition {
  return {
    name: get_planet_name(pos.body),
    speed: pos.speed,
    retrograde: pos.speed < 0,
    ...formatPosition(pos.position),
  };
}

export function formatSwephError(error: SwephError): FormattedSwephError {
  return {
    ...error,
    body_name: error.body == null ? undefined : get_planet_name(error.body),
  };
}

export function formatHousePosition(
  pos: HousePosition
): FormattedHousePosition {
  return {
    name: `House ${pos.house}`,
    ...formatPosition(pos.position),
  };
}

export function formatPointPosition(
  pos: PointPosition
): FormattedPointPosition {
  return {
    name: pos.point,
    ...formatPosition(pos.position),
  };
}
