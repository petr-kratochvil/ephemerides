import { constants } from "sweph";

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
