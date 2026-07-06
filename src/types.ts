import { swephConfig } from "./config";

export interface JsonDate {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface GeoCoordinates {
  lat: number;
  lon: number;
}

export type BodyId = (typeof swephConfig.bodies)[number];
export type PointName = (typeof swephConfig.points)[number];
export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface BodyObject {
  type: "body";
  bodyId: BodyId;
}

export interface PointObject {
  type: "point";
  pointName: PointName;
}

export interface HouseObject {
  type: "house";
  houseNumber: HouseNumber;
}

export type EphObject = BodyObject | PointObject | HouseObject;

export interface Position {
  position: number;
}

interface EphObjectPositionInt extends Position {
  speed?: number;
}

export type EphObjectPosition = EphObjectPositionInt & EphObject;
let a : EphObjectPosition = {
  position: 1,
  type: 'house',
  houseNumber: 1,
}

export interface FormattedPosition extends Position {
  sign: number;
  degrees: number;
  minutes: number;
  seconds: number;
}

interface FormattedObjectPositionInt extends FormattedPosition {
  name: string;
  type: 'body' | 'point' | 'house';
  speed?: number;
  retrograde?: boolean;
}

export type FormattedObjectPosition = FormattedObjectPositionInt & EphObject;

export interface Aspect {
  name: string;
  orb: number;
  orbSpeed?: number;
}

export interface AspectWithPositions extends Aspect {
  pos1: Position;
  pos2: Position;
}

// Sweph errors

export interface SwephError {
  body?: number;
  error?: string;
}

export interface FormattedSwephError {
  body_name?: string;
  error?: string;
}