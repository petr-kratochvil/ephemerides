import { describe, it } from "node:test";
import assert from "node:assert";
import path from "path";
import sweph from "sweph";
import { stations } from "./getStations";
import { stationsConfig } from "../config";
import { sweph_body_position, sweph_get_julday } from "../sweph";
import { JsonDate } from "../types";

// The station times are checked against the ephemeris itself rather than against
// hardcoded values: around a station the speed must change sign, and it must change
// it in the reported direction.

sweph.set_ephe_path(path.join(__dirname, "../../swisseph_files"));

// Comfortably more than the ~1 hour precision of the search, but far less than the
// shortest time a planet spends retrograde
const SIGN_CHANGE_TOLERANCE_DAYS = 0.2;

describe("stations", () => {
  const date: JsonDate = { year: 2026, month: 10, day: 25, hour: 13.5 };
  const result = stations(date);

  it("returns one entry per configured planet", () => {
    assert.deepStrictEqual(
      result.map((planet) => planet.bodyId),
      stationsConfig.planets.map((planet) => planet.bodyId),
    );
    assert.deepStrictEqual(result[0].name, "Mercury");
    assert.ok(result.every((planet) => planet.type === "body"));
  });

  it("surrounds the requested date with two stations of opposite direction", () => {
    const julianDay = sweph_get_julday(date);
    for (const planet of result) {
      assert.ok(
        planet.previous && planet.next,
        `${planet.name} is missing a station`,
      );
      assert.ok(
        sweph_get_julday(planet.previous.date) < julianDay,
        `${planet.name}: previous station is not before the date`,
      );
      assert.ok(
        sweph_get_julday(planet.next.date) > julianDay,
        `${planet.name}: next station is not after the date`,
      );
      assert.notStrictEqual(
        planet.previous.retrograde,
        planet.next.retrograde,
        `${planet.name}: two stations of the same direction in a row`,
      );
    }
  });

  it("reports times where the planet really does change direction", () => {
    for (const planet of result) {
      for (const station of [planet.previous!, planet.next!]) {
        const julianDay = sweph_get_julday(station.date);
        const { speed: before } = sweph_body_position(
          julianDay - SIGN_CHANGE_TOLERANCE_DAYS,
          planet.bodyId,
        );
        const { speed: after } = sweph_body_position(
          julianDay + SIGN_CHANGE_TOLERANCE_DAYS,
          planet.bodyId,
        );
        assert.notStrictEqual(
          Math.sign(before),
          Math.sign(after),
          `${planet.name}: the speed does not change sign around ${JSON.stringify(station)}`,
        );
        assert.strictEqual(
          before > 0,
          station.retrograde,
          `${planet.name}: wrong direction reported for ${JSON.stringify(station)}`,
        );
      }
    }
  });

  it("reports the longitude the planet stands at, formatted as in /position", () => {
    for (const planet of result) {
      for (const station of [planet.previous!, planet.next!]) {
        const { position } = sweph_body_position(
          sweph_get_julday(station.date),
          planet.bodyId,
        );
        assert.strictEqual(
          station.position,
          position,
          `${planet.name}: the position is not the one at the reported date`,
        );
        assert.strictEqual(station.sign, Math.floor(position / 30) + 1);
        // Degrees, minutes and seconds are the position within its sign, truncated
        const withinSign =
          station.degrees + station.minutes / 60 + station.seconds / 3600;
        const truncated = (position % 30) - withinSign;
        assert.ok(
          truncated >= 0 && truncated < 1 / 3600,
          `${planet.name}: ${JSON.stringify(station)} does not add up to ${position}`,
        );
      }
    }
  });

  it("matches the published Mercury retrograde period of autumn 2026", () => {
    const mercury = result[0];
    assert.deepStrictEqual(
      { ...mercury.previous!.date, hour: undefined },
      { year: 2026, month: 10, day: 24, hour: undefined },
    );
    assert.deepStrictEqual(
      { ...mercury.next!.date, hour: undefined },
      { year: 2026, month: 11, day: 13, hour: undefined },
    );
  });
});
