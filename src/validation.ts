import { JsonDate, GeoCoordinates } from "./types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function assertJsonDate(
  value: unknown,
  fieldName: string,
): asserts value is JsonDate {
  const date = value as Partial<JsonDate> | null | undefined;
  if (
    typeof date !== "object" ||
    date === null ||
    !isFiniteNumber(date.year) ||
    !isFiniteNumber(date.month) ||
    !isFiniteNumber(date.day) ||
    !isFiniteNumber(date.hour)
  ) {
    throw new ValidationError(
      `${fieldName} must be an object with numeric year, month, day, and hour`,
    );
  }
}

export function assertGeoCoordinatesIfPresent(
  value: unknown,
  fieldName: string,
): asserts value is GeoCoordinates | undefined {
  if (value === undefined) {
    return;
  }
  const coords = value as Partial<GeoCoordinates> | null;
  if (
    typeof coords !== "object" ||
    coords === null ||
    !isFiniteNumber(coords.lat) ||
    !isFiniteNumber(coords.lon)
  ) {
    throw new ValidationError(
      `${fieldName}, if provided, must be an object with numeric lat and lon`,
    );
  }
}
