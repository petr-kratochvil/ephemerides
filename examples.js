import sweph, { constants } from "sweph";
import assert from "assert";


// path to ephemeris data
sweph.set_ephe_path(__dirname + "/../swisseph_files");
// sweph.set_ephe_path('null');

// Test date
// var date = { year: 2012, month: 1, day: 1, hour: 0 };
var date = { year: 2024, month: 2, day: 6, hour: 13 };
console.log("Test date:", date);

// var flag = constants.SEFLG_MOSEPH;
var flag = constants.SEFLG_SPEED;

// Julian day
const julday_ut = sweph.julday(
  date.year,
  date.month,
  date.day,
  date.hour,
  constants.SE_GREG_CAL
);
// assert.equal(julday_ut, 2455927.5);
console.log("Julian UT day for date:", julday_ut);

// Sun position
const body = sweph.calc_ut(julday_ut, constants.SE_SUN, flag);
assert(!body.error, body.error);
console.log("Sun position:", body);

const sun_name = sweph.get_planet_name(constants.SE_SUN);
console.log({ sun_name });

// Moon position
const body_moon = sweph.calc_ut(julday_ut, constants.SE_MOON, flag);
assert(!body_moon.error, body_moon.error);
console.log("Moon position:", body_moon);

console.log({ sweVersion: sweph.version() });
console.log({ houseName: sweph.house_name("P") });
const houses = sweph.houses(julday_ut, 50, 15, "P");
console.log(houses);
