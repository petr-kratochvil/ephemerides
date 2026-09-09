import { describe, it } from "node:test";
import assert from "node:assert";
import {
  ValidationError,
  jsonDateSchema,
  geoCoordinatesSchema,
  housesBodySchema,
  transitsBodySchema,
  parseBody,
} from "./validation";

const validDate = { year: 2024, month: 2, day: 6, hour: 13 };
const validCoords = { lat: 50.075, lon: 14.437 };

describe("jsonDateSchema", () => {
  it("accepts a well-formed date", () => {
    assert.deepStrictEqual(jsonDateSchema.parse(validDate), validDate);
  });

  it("strips unknown keys", () => {
    assert.deepStrictEqual(
      jsonDateSchema.parse({ ...validDate, junk: 1 }),
      validDate,
    );
  });

  // Accepts:
  for (const [label, value] of [
    ["a decimal hour", { ...validDate, hour: 13.5 }],
    ["hour 0", { ...validDate, hour: 0 }],
    ["hour just under 24", { ...validDate, hour: 23.999 }],
    ["the first year of the ephemeris range", { ...validDate, year: 1800 }],
    ["the last year of the ephemeris range", { ...validDate, year: 2399 }],
  ] as const) {
    it(`accepts ${label}`, () => {
      assert.deepStrictEqual(jsonDateSchema.parse(value), value);
    });
  }

  // Rejects:
  for (const [label, value] of [
    ["NaN", { ...validDate, year: NaN }],
    ["Infinity", { ...validDate, year: Infinity }],
    ["month 0", { ...validDate, month: 0 }],
    ["month 13", { ...validDate, month: 13 }],
    ["day 0", { ...validDate, day: 0 }],
    ["day 32", { ...validDate, day: 32 }],
    ["a fractional month", { ...validDate, month: 2.5 }],
    ["a fractional day", { ...validDate, day: 6.5 }],
    ["a fractional year", { ...validDate, year: 2024.5 }],
    ["a negative month", { ...validDate, month: -1 }],
    ["a negative day", { ...validDate, day: -1 }],
    ["a year before the ephemeris range", { ...validDate, year: 1799 }],
    ["a year after the ephemeris range", { ...validDate, year: 2400 }],
    ["hour 24", { ...validDate, hour: 24 }],
    ["a negative hour", { ...validDate, hour: -1 }],
  ] as const) {
    it(`rejects ${label}`, () => {
      assert.strictEqual(jsonDateSchema.safeParse(value).success, false);
    });
  }
});

// Accepts:
describe("geoCoordinatesSchema", () => {
  for (const [label, value] of [
    ["well-formed coordinates", validCoords],
    ["the northern/eastern extremes", { lat: 90, lon: 180 }],
    ["the southern/western extremes", { lat: -90, lon: -180 }],
  ] as const) {
    it(`accepts ${label}`, () => {
      assert.deepStrictEqual(geoCoordinatesSchema.parse(value), value);
    });
  }

  // Rejects:
  for (const [label, value] of [
    ["a latitude above 90", { lat: 91, lon: 0 }],
    ["a latitude below -90", { lat: -91, lon: 0 }],
    ["a longitude above 180", { lat: 0, lon: 181 }],
    ["a longitude below -180", { lat: 0, lon: -181 }],
  ] as const) {
    it(`rejects ${label}`, () => {
      assert.strictEqual(geoCoordinatesSchema.safeParse(value).success, false);
    });
  }
});

describe("housesBodySchema", () => {
  it("accepts a body without coordinates", () => {
    assert.deepStrictEqual(housesBodySchema.parse({ baseDate: validDate }), {
      baseDate: validDate,
    });
  });

  it("accepts a body with coordinates", () => {
    const body = { baseDate: validDate, baseDateCoordinates: validCoords };
    assert.deepStrictEqual(housesBodySchema.parse(body), body);
  });

  it(`rejects a missing baseDate`, () => {
    assert.strictEqual(housesBodySchema.safeParse({}).success, false);
  });
});

describe("transitsBodySchema", () => {
  it("accepts both dates", () => {
    const body = { baseDate: validDate, transitDate: validDate };
    assert.deepStrictEqual(transitsBodySchema.parse(body), body);
  });

  it("rejects a missing transitDate", () => {
    assert.strictEqual(
      transitsBodySchema.safeParse({ baseDate: validDate }).success,
      false,
    );
  });

  it("rejects a missing baseDate", () => {
    assert.strictEqual(
      transitsBodySchema.safeParse({ transitDate: validDate }).success,
      false,
    );
  });
});

describe("parseBody", () => {
  it("returns the parsed value", () => {
    assert.deepStrictEqual(parseBody(jsonDateSchema, validDate), validDate);
  });

  it("throws ValidationError on a malformed body", () => {
    assert.throws(
      () => parseBody(jsonDateSchema, { ...validDate, month: "2" }),
      ValidationError,
    );
  });
});
