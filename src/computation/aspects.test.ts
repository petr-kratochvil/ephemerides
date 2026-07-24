import { test } from "node:test";
import assert from "node:assert";
import { aspect, aspects } from "./aspects";

const testAspectDefinitions = [
  { name: "conjunction", maxOrb: 15, mediumOrb: 10, diff: 0 },
  { name: "square", maxOrb: 10, mediumOrb: 5, diff: 90 },
];

test("aspect", () => {
  test("detects a conjunction within the medium orb", () => {
    const result = aspect(
      { position: 10 },
      { position: 15 },
      false,
      testAspectDefinitions,
    );
    assert.deepStrictEqual(result, { name: "conjunction", orb: 5 });
  });

  test("returns null when no aspect matches within the medium orb", () => {
    const result = aspect(
      { position: 0 },
      { position: 45 },
      false,
      testAspectDefinitions,
    );
    assert.strictEqual(result, null);
  });

  test("includes orbSpeed when pos1 has a numeric speed", () => {
    const result = aspect(
      { position: 10, speed: 1 },
      { position: 15 },
      false,
      testAspectDefinitions,
    );
    assert.strictEqual(result?.orbSpeed, -1);
  });

  test("omits orbSpeed when pos1 has no speed", () => {
    const result = aspect(
      { position: 10 },
      { position: 15 },
      false,
      testAspectDefinitions,
    );
    assert.strictEqual(result?.orbSpeed, undefined);
  });

  test("useMaxOrb widens detection beyond the medium orb", () => {
    // 98deg apart: outside square's mediumOrb (5) but inside its maxOrb (10)
    assert.strictEqual(
      aspect({ position: 0 }, { position: 98 }, false, testAspectDefinitions),
      null,
    );
    assert.deepStrictEqual(
      aspect({ position: 0 }, { position: 98 }, true, testAspectDefinitions),
      { name: "square", orb: 8 },
    );
  });
});

test("aspects", () => {
  test("finds aspects across two charts and carries extra properties through", () => {
    const chart1 = [{ position: 10, speed: 1, extra: "pos1-marker" }];
    const chart2 = [
      { position: 15, extra: "pos2-marker-a" }, // conjunction with chart1[0]
      { position: 200, extra: "pos2-marker-b" }, // no aspect within medium orb
    ];

    const result = aspects(chart1, chart2, testAspectDefinitions);

    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], {
      name: "conjunction",
      orb: 5,
      orbSpeed: -1,
      pos1: chart1[0],
      pos2: chart2[0],
    });
  });

  test("returns an empty array when nothing aspects", () => {
    const result = aspects(
      [{ position: 0 }],
      [{ position: 45 }],
      testAspectDefinitions,
    );
    assert.deepStrictEqual(result, []);
  });
});
