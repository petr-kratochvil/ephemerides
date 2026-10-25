/**
 * Planetary stations - the moments when a planet stops moving forward along the
 * ecliptic and turns retrograde, or stops moving backwards and turns direct again.
 *
 * A station is a zero crossing of the planet's ecliptic longitude speed:
 *   speed + -> -   the planet turns retrograde
 *   speed - -> +   the planet turns direct again
 *
 * The search only ever looks at the sign of the speed, never at the longitude, and
 * needs about 10 ephemeris calls per planet for a precision of roughly +-1 hour.
 */

import { stationsConfig } from "../config";
import { StationPlanet } from "../types";

// Ecliptic longitude speed of a single planet at a Julian day, in degrees per day
export type SpeedAt = (julianDay: number) => number;

// A station found by the search, timed as a Julian day (UT)
export interface StationAtJulianDay {
  retrograde: boolean;
  julianDay: number;
}

export interface StationsAround {
  previous: StationAtJulianDay | null;
  next: StationAtJulianDay | null;
}

const FORWARD = 1;
const BACKWARD = -1;
type Direction = typeof FORWARD | typeof BACKWARD;

// One ephemeris sample: the planet's speed at a given Julian day
interface Sample {
  julianDay: number;
  speed: number;
}

// A station lies between two samples exactly when their speeds have different signs
function hasStationBetween(a: Sample, b: Sample): boolean {
  return Math.sign(a.speed) !== Math.sign(b.speed);
}

// Searches the stations of one planet, whose speed is given by `speedAt`
class StationFinder {
  constructor(
    private readonly speedAt: SpeedAt,
    private readonly planet: StationPlanet,
    private readonly precisionDays: number,
  ) {}

  private sample(julianDay: number): Sample {
    return { julianDay, speed: this.speedAt(julianDay) };
  }

  /**
   * Exact-ish station time between samples a and b, whose speeds have opposite signs.
   *
   * Regula falsi: draw a straight line through the two samples and take its zero as the
   * next guess. This is Newton's method with the slope estimated from the two samples,
   * so it costs one ephemeris call per step (true Newton would also need the
   * acceleration) and the guess can never leave the interval.
   *
   * Illinois tweak: when the same end gets replaced twice in a row, the other end's
   * speed is halved, so the guesses don't creep towards the zero from one side only.
   */
  private refineStation(a: Sample, b: Sample): StationAtJulianDay {
    let [left, right] = a.julianDay < b.julianDay ? [a, b] : [b, a];
    // A speed going from + to - means the planet turns retrograde, - to + direct
    const retrograde = left.speed > 0;

    // The speeds used for drawing the line - the real ones, unless halved by Illinois
    let leftWeight = left.speed;
    let rightWeight = right.speed;
    let lastReplaced: "left" | "right" | null = null;

    // A few steps are always enough; the limit is only a safety net
    for (let step = 0; step < 60; step++) {
      const guess = this.sample(
        (left.julianDay * rightWeight - right.julianDay * leftWeight) /
          (rightWeight - leftWeight),
      );
      const replacesLeft = !hasStationBetween(left, guess);

      // How far the zero still is from the guess, judged by the line from the guess to
      // the opposite end. Once that distance is small enough, apply it and finish.
      const opposite = replacesLeft ? right : left;
      const remainingDays =
        (guess.speed * (guess.julianDay - opposite.julianDay)) /
        (opposite.speed - guess.speed);
      if (Math.abs(remainingDays) < this.precisionDays) {
        return { retrograde, julianDay: guess.julianDay + remainingDays };
      }

      if (replacesLeft) {
        left = guess;
        leftWeight = guess.speed;
        rightWeight = lastReplaced === "left" ? rightWeight / 2 : right.speed;
        lastReplaced = "left";
      } else {
        right = guess;
        rightWeight = guess.speed;
        leftWeight = lastReplaced === "right" ? leftWeight / 2 : left.speed;
        lastReplaced = "right";
      }
    }
    return { retrograde, julianDay: (left.julianDay + right.julianDay) / 2 };
  }

  // Walks from `start` in fixed steps until the first station; never skips one
  private scanForStation(
    start: Sample,
    direction: Direction,
  ): StationAtJulianDay | null {
    const { scanStep, retrogradeDays, directDays } = this.planet;
    // One full retrograde + direct cycle is always enough, with a little room to spare
    const maxSearchDays = 1.2 * (retrogradeDays[1] + directDays[1]);

    let previous = start;
    for (let walked = 0; walked < maxSearchDays; walked += scanStep) {
      const current = this.sample(previous.julianDay + direction * scanStep);
      if (hasStationBetween(previous, current)) {
        return this.refineStation(previous, current);
      }
      previous = current;
    }
    return null;
  }

  /**
   * Finds the station right next to an already known one, in the given direction.
   * `boundary` is a sample lying between the two stations; the result must be beyond it.
   *
   * Stations alternate retrograde -> direct -> retrograde ..., and the time between two
   * of them is fairly regular, so the neighbour lies within a window we can compute from
   * the duration table. Sample both edges of that window; if the station is between
   * them, refine it. Otherwise the table was off for this date and we fall back to a
   * scan - which is what the window saves us from in the common case, as scanning a
   * direct period of Venus or Mars takes about two years.
   */
  private findNeighbourStation(
    known: StationAtJulianDay,
    direction: Direction,
    boundary: Sample,
  ): StationAtJulianDay | null {
    const { retrogradeDays, directDays } = this.planet;
    // Going forward from a retrograde station (or backward from a direct one) means
    // crossing the retrograde part of the cycle, otherwise the direct part
    const crossesRetrograde = known.retrograde === (direction === FORWARD);
    const [minGap, maxGap] = crossesRetrograde ? retrogradeDays : directDays;
    const margin = 0.25 * retrogradeDays[0];

    const isBeyondBoundary = (julianDay: number) =>
      direction * (julianDay - boundary.julianDay) > 0;
    const nearJulianDay = known.julianDay + direction * (minGap - margin);
    const farJulianDay = known.julianDay + direction * (maxGap + margin);

    const near = isBeyondBoundary(nearJulianDay)
      ? this.sample(nearJulianDay)
      : boundary;
    if (hasStationBetween(boundary, near)) {
      // The station came earlier than the table says
      return this.scanForStation(boundary, direction);
    }

    const far = this.sample(farJulianDay);
    if (hasStationBetween(near, far)) {
      return this.refineStation(near, far);
    }
    // The station comes later than the table says
    return this.scanForStation(near, direction);
  }

  findAround(julianDay: number): StationsAround {
    const start = this.sample(julianDay);

    // Find one station first. Take a single scan step forward: if the speed got closer
    // to zero, the station ahead is probably the nearer one, so keep going forward;
    // otherwise scan backward. The second station is then derived from the first one.
    const oneStepAhead = this.sample(julianDay + this.planet.scanStep);
    let first: StationAtJulianDay | null;
    if (hasStationBetween(start, oneStepAhead)) {
      first = this.refineStation(start, oneStepAhead);
    } else if (Math.abs(oneStepAhead.speed) < Math.abs(start.speed)) {
      first = this.scanForStation(oneStepAhead, FORWARD);
    } else {
      first = this.scanForStation(start, BACKWARD);
    }
    if (first === null) {
      return { previous: null, next: null };
    }

    return first.julianDay > julianDay
      ? {
          previous: this.findNeighbourStation(first, BACKWARD, start),
          next: first,
        }
      : {
          previous: first,
          next: this.findNeighbourStation(first, FORWARD, start),
        };
  }
}

/**
 * The last station of a planet before `julianDay` and the first one after it.
 *
 * Both are null when the planet has no station at all within one retrograde cycle,
 * which can only happen for a speed that never changes sign.
 */
export function findStationsAround(
  speedAt: SpeedAt,
  julianDay: number,
  planet: StationPlanet,
  precisionDays: number = stationsConfig.precisionDays,
): StationsAround {
  return new StationFinder(speedAt, planet, precisionDays).findAround(
    julianDay,
  );
}
