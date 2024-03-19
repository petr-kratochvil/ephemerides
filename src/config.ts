import { constants } from "sweph";

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
  points: [
    "AC",
    "IC",
    "DC",
    "MC",
    "vertex",
    "antiVertex",
    // 'ARMC', 'equatorialAscendant', 'coAscendantWK', 'coAscendantMM',  'polarAscendantMM'
  ],
  lat: 50,
  lon: 15,
  houseMethod: "P",
};
