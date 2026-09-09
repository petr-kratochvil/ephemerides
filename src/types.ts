import { z } from "zod";
import { swephConfig } from "./config";
import { geoCoordinatesSchema, jsonDateSchema } from "./validation";

// Infered types from zod schemas
export type JsonDate = z.infer<typeof jsonDateSchema>;
export type GeoCoordinates = z.infer<typeof geoCoordinatesSchema>;

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

export interface FormattedPosition extends Position {
  sign: number;
  degrees: number;
  minutes: number;
  seconds: number;
}

interface FormattedObjectPositionInt extends FormattedPosition {
  name: string;
  type: "body" | "point" | "house";
  speed?: number;
  retrograde?: boolean;
}

export type FormattedObjectPosition = FormattedObjectPositionInt & EphObject;

export interface Aspect {
  name: string;
  orb: number;
  orbSpeed?: number;
}

export interface AspectWithPositions<
  T extends Position = Position,
> extends Aspect {
  pos1: T;
  pos2: T;
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
