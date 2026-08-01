import { test } from "node:test";
import assert from "node:assert";
import {
  assertJsonDate,
  assertGeoCoordinatesIfPresent,
  ValidationError,
} from "./validation";

test("assertJsonDate", () => {
  test("accepts a well-formed date", () => {
    assert.doesNotThrow(() =>
      assertJsonDate({ year: 2024, month: 2, day: 6, hour: 13 }, "body"),
    );
  });

  test("rejects null", () => {
    assert.throws(() => assertJsonDate(null, "body"), ValidationError);
  });

  test("rejects undefined", () => {
    assert.throws(() => assertJsonDate(undefined, "body"), ValidationError);
  });

  test("rejects an empty object", () => {
    assert.throws(() => assertJsonDate({}, "body"), ValidationError);
  });

  test("rejects a non-numeric field", () => {
    assert.throws(
      () =>
        assertJsonDate({ year: 2024, month: "2", day: 6, hour: 13 }, "body"),
      ValidationError,
    );
  });

  test("rejects NaN/Infinity", () => {
    assert.throws(
      () => assertJsonDate({ year: NaN, month: 2, day: 6, hour: 13 }, "body"),
      ValidationError,
    );
  });

  test("error message includes the field name", () => {
    assert.throws(() => assertJsonDate(null, "transitDate"), /transitDate/);
  });
});

test("assertGeoCoordinatesIfPresent", () => {
  test("accepts undefined (optional field)", () => {
    assert.doesNotThrow(() =>
      assertGeoCoordinatesIfPresent(undefined, "baseDateCoordinates"),
    );
  });

  test("accepts well-formed coordinates", () => {
    assert.doesNotThrow(() =>
      assertGeoCoordinatesIfPresent(
        { lat: 50.075, lon: 14.437 },
        "baseDateCoordinates",
      ),
    );
  });

  test("rejects a present but malformed value", () => {
    assert.throws(
      () =>
        assertGeoCoordinatesIfPresent({ lat: 50.075 }, "baseDateCoordinates"),
      ValidationError,
    );
  });

  test("rejects null (present but not omitted)", () => {
    assert.throws(
      () => assertGeoCoordinatesIfPresent(null, "baseDateCoordinates"),
      ValidationError,
    );
  });
});
