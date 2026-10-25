import { constants } from "sweph";
import type { StationPlanet } from "./types";

const points = [
  "AC",
  "IC",
  "DC",
  "MC",
  "vertex",
  // "antiVertex",
  // 'ARMC', 'equatorialAscendant', 'coAscendantWK', 'coAscendantMM',  'polarAscendantMM'
] as const;

export const swephConfig = {
  // flag: constants.SEFLG_MOSEPH;
  flag: constants.SEFLG_SPEED,
  bodies: [
    constants.SE_SUN,
    constants.SE_MOON,
    constants.SE_MERCURY,
    constants.SE_VENUS,
    constants.SE_MARS,
    constants.SE_JUPITER,
    constants.SE_SATURN,
    constants.SE_URANUS,
    constants.SE_NEPTUNE,
    constants.SE_PLUTO,
  ],
  points,
  // default birth place is Prague
  lat: 50.075,
  lon: 14.437,
  houseMethod: "P",
};

// Search parameters for planetary stations - the moments when a planet turns
// retrograde or direct. Sun and Moon are left out, they never turn retrograde.
//
// scanStep must be shorter than the planet's shortest retrograde period, so that two
// stations can never hide between two consecutive samples of a blind scan.
//
// retrogradeDays / directDays are [min, max] durations in days, measured over
// 1800-2050. They are only used to guess where the station neighbouring an already
// known one lies; a missed guess just falls back to a scan, so they need not be exact.
export const stationsConfig: {
  precisionDays: number;
  planets: StationPlanet[];
} = {
  // Refinement stops once the next correction would be smaller than this.
  // 0.15 day gives about +-1 hour, which is plenty for astrological use.
  precisionDays: 0.15,
  // prettier-ignore
  planets: [
    { bodyId: constants.SE_MERCURY, scanStep: 15,  retrogradeDays: [19.8, 24.3],   directDays: [87.8, 102.0] },
    { bodyId: constants.SE_VENUS,   scanStep: 32,  retrogradeDays: [40.8, 43.3],   directDays: [538.0, 545.3] },
    { bodyId: constants.SE_MARS,    scanStep: 45,  retrogradeDays: [60.0, 81.3],   directDays: [684.0, 745.3] },
    { bodyId: constants.SE_JUPITER, scanStep: 90,  retrogradeDays: [117.5, 123.8], directDays: [272.3, 284.8] },
    { bodyId: constants.SE_SATURN,  scanStep: 100, retrogradeDays: [133.5, 141.5], directDays: [235.5, 245.8] },
    { bodyId: constants.SE_URANUS,  scanStep: 110, retrogradeDays: [149.0, 154.5], directDays: [214.8, 221.0] },
    { bodyId: constants.SE_NEPTUNE, scanStep: 110, retrogradeDays: [156.5, 160.5], directDays: [207.0, 211.0] },
    { bodyId: constants.SE_PLUTO,   scanStep: 110, retrogradeDays: [156.3, 165.5], directDays: [200.5, 211.5] },
  ],
};

export const aspectsConfig = {
  aspects: [
    {
      name: "conjunction",
      maxOrb: 15,
      mediumOrb: 10,
      diff: 0,
    },
    {
      name: "opposition",
      maxOrb: 15,
      mediumOrb: 8,
      diff: 180,
    },
    {
      name: "square",
      maxOrb: 10,
      mediumOrb: 5,
      diff: 90,
    },
    {
      name: "trine",
      maxOrb: 10,
      mediumOrb: 5,
      diff: 120,
    },
    {
      name: "sextile",
      maxOrb: 6,
      mediumOrb: 3.5,
      diff: 60,
    },
    {
      name: "semiSextile",
      maxOrb: 3,
      mediumOrb: 1.5,
      diff: 30,
    },
    {
      name: "quincunx",
      maxOrb: 5,
      mediumOrb: 3.5,
      diff: 150,
    },
  ],
};
