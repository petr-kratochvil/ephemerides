import { describe, it } from "node:test";
import assert from "node:assert";
import { constants } from "sweph";
import { SpeedAt, findStationsAround } from "./stations";
import { StationPlanet } from "../types";

// --- Station search on a synthetic planet -----------------------------------
//
// A speed that is a sine wave with a 100 day period: the planet turns retrograde on
// day 50, direct on day 100, retrograde on day 150 and so on. Days are Julian days
// here, but any origin works - the search never looks at the calendar.

const PERIOD_DAYS = 100;
const sineSpeed: SpeedAt = (julianDay) =>
  Math.sin((2 * Math.PI * julianDay) / PERIOD_DAYS);

const sinePlanet: StationPlanet = {
  bodyId: constants.SE_MERCURY,
  scanStep: 20,
  retrogradeDays: [45, 55],
  directDays: [45, 55],
};

// Far below the production precision, so the result can be compared to the exact
// zero crossing of the sine wave
const PRECISION_DAYS = 1e-6;

function assertStationsAt(
  julianDay: number,
  planet: StationPlanet,
  speedAt: SpeedAt = sineSpeed,
) {
  const { previous, next } = findStationsAround(
    speedAt,
    julianDay,
    planet,
    PRECISION_DAYS,
  );
  assert.strictEqual(previous?.retrograde, true);
  assert.ok(Math.abs(previous.julianDay - 50) < 1e-4);
  assert.strictEqual(next?.retrograde, false);
  assert.ok(Math.abs(next.julianDay - 100) < 1e-4);
}

describe("findStationsAround", () => {
  it("finds both stations when the next one is the nearer of the two", () => {
    // Day 70 is just past the retrograde station, a step forward gets closer to
    // the direct one, so the search runs forward first
    assertStationsAt(70, sinePlanet);
  });

  it("finds both stations when the previous one is the nearer of the two", () => {
    // Day 55 is right after the retrograde station, a step forward leads away from
    // it, so the search runs backward first
    assertStationsAt(55, sinePlanet);
  });

  it("falls back to a scan when a station comes later than the table says", () => {
    const tableTooShort = {
      ...sinePlanet,
      retrogradeDays: [20, 24] as [number, number],
      directDays: [20, 24] as [number, number],
    };
    assertStationsAt(70, tableTooShort);
  });

  it("falls back to a scan when a station comes earlier than the table says", () => {
    const tableTooLong = {
      ...sinePlanet,
      retrogradeDays: [90, 110] as [number, number],
      directDays: [90, 110] as [number, number],
    };
    assertStationsAt(70, tableTooLong);
  });

  it("returns no stations for a planet that never turns retrograde", () => {
    const alwaysDirect: SpeedAt = () => 1;
    const result = findStationsAround(alwaysDirect, 70, sinePlanet);
    assert.deepStrictEqual(result, { previous: null, next: null });
  });

  it("gets by with a handful of speed samples", () => {
    let samples = 0;
    const countedSpeed: SpeedAt = (julianDay) => {
      samples++;
      return sineSpeed(julianDay);
    };
    findStationsAround(countedSpeed, 70, sinePlanet);
    // The production precision needs about 10; the scan fallbacks above cost more
    assert.ok(samples < 20, `used ${samples} samples`);
  });
});
