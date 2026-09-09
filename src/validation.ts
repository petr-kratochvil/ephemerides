import { z } from "zod";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const jsonDateSchema = z.object({
  year: z.int().min(1800).max(2399),
  month: z.int().min(1).max(12),
  day: z.int().min(1).max(31),
  hour: z.number().min(0).lt(24),
});

export const geoCoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

// Request body schemas
export const positionBodySchema = jsonDateSchema;

export const housesBodySchema = z.object({
  baseDate: jsonDateSchema,
  baseDateCoordinates: geoCoordinatesSchema.optional(),
});

export const transitsBodySchema = z.object({
  baseDate: jsonDateSchema,
  transitDate: jsonDateSchema,
  baseDateCoordinates: geoCoordinatesSchema.optional(),
});

function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((issue) =>
      issue.path.length
        ? `${issue.path.join(".")}: ${issue.message}`
        : issue.message,
    )
    .join("; ");
}

export function parseBody<S extends z.ZodType>(
  schema: S,
  body: unknown,
): z.infer<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(formatZodError(result.error));
  }
  return result.data;
}
