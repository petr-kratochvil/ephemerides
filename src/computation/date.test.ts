import { test } from "node:test";
import assert from "node:assert";
import { addDays } from "./date";

test("addDays", () => {
  test("adds days within the same month", () => {
    const result = addDays({ year: 2024, month: 2, day: 6, hour: 13 }, 3);
    assert.deepStrictEqual(result, { year: 2024, month: 2, day: 9, hour: 13 });
  });

  test("rolls over into the next month", () => {
    const result = addDays({ year: 2024, month: 2, day: 27, hour: 13 }, 3);
    assert.deepStrictEqual(result, { year: 2024, month: 3, day: 1, hour: 13 });
  });

  test("rolls over into the next year", () => {
    const result = addDays({ year: 2024, month: 12, day: 30, hour: 0 }, 5);
    assert.deepStrictEqual(result, { year: 2025, month: 1, day: 4, hour: 0 });
  });

  test("preserves the hour unchanged", () => {
    const result = addDays({ year: 2024, month: 2, day: 6, hour: 13.5 }, 1);
    assert.strictEqual(result.hour, 13.5);
  });
});
