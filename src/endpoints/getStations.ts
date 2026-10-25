import { Request, Response } from "express";
import { get_planet_name } from "sweph";
import { stationsConfig } from "../config";
import {
  SpeedAt,
  StationAtJulianDay,
  findStationsAround,
} from "../computation/stations";
import { formatPosition, formatSwephError } from "../format/formatPosition";
import {
  sweph_body_position,
  sweph_get_date,
  sweph_get_julday,
} from "../sweph";
import { BodyId, BodyStations, JsonDate, Station, SwephError } from "../types";
import { parseBody, stationsBodySchema, ValidationError } from "../validation";

const MINUTES_PER_DAY = 1440;

// Enriches a station found by the search with the longitude the planet stands at.
// The search itself only ever looks at speeds, so this takes one more ephemeris call,
// made at the rounded time so that position and date describe the same moment.
function describeStation(
  station: StationAtJulianDay | null,
  body: BodyId,
): Station | null {
  if (station === null) {
    return null;
  }
  // Rounded to whole minutes - the search is only accurate to about an hour anyway
  const julianDay =
    Math.round(station.julianDay * MINUTES_PER_DAY) / MINUTES_PER_DAY;
  const { position } = sweph_body_position(julianDay, body);
  return {
    ...formatPosition(position),
    retrograde: station.retrograde,
    date: sweph_get_date(julianDay),
  };
}

// The stations surrounding `date` for every planet from Mercury to Pluto
export function stations(date: JsonDate): BodyStations[] {
  const julianDay = sweph_get_julday(date);

  return stationsConfig.planets.map((planet) => {
    // swephConfig.flag contains SEFLG_SPEED, so the speed is always calculated
    const speedAt: SpeedAt = (at) =>
      sweph_body_position(at, planet.bodyId).speed as number;
    const { previous, next } = findStationsAround(speedAt, julianDay, planet);
    return {
      type: "body",
      bodyId: planet.bodyId,
      name: get_planet_name(planet.bodyId),
      previous: describeStation(previous, planet.bodyId),
      next: describeStation(next, planet.bodyId),
    };
  });
}

export function getStations(req: Request, res: Response) {
  try {
    const date = parseBody(stationsBodySchema, req.body);
    res.json(stations(date));
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json(formatSwephError(error as SwephError));
    }
  }
}
