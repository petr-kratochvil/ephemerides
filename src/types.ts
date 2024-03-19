import { swephConfig } from "./config";

export interface EphDate {
  year: number;
  month: number;
  day: number;
  hour: number;
}

export interface Position {
  position: number;
}

export interface FormattedPosition extends Position {
  sign: number;
  degrees: number;
  minutes: number;
  seconds: number;
}

export type Body = (typeof swephConfig.bodies)[number];

export interface BodyPosition extends Position {
  body: Body;
  speed: number;
}

export interface FormattedBodyPosition extends FormattedPosition {
  name: string;
  speed: number;
  retrograde: boolean;
}

export interface BodyPositionError {
  body: Body;
  error: string;
}

export interface FormattedBodyPositionError {
  name: string;
  error: string;
}

export interface PointPosition extends Position {
  point: string;
}

export interface FormattedPointPosition extends FormattedPosition {
  name: string;
}

export interface HousePosition extends Position {
  house: number;
}

export interface FormattedHousePosition extends FormattedPosition {
  name: string;
}

export interface Aspect {
  name: string;
  orb: number;
}

export interface AspectWithPositions extends Aspect {
  pos1: Position;
  pos2: Position;
}