import Zod, { ZodType } from "zod";
import { ErrorMessages } from "../shared/errors/error-message";
export function parseOrThrow<T>(schema: Zod.ZodSchema<T>, data: unknown): T {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    throw new Error(ErrorMessages.FAILED_TO_PARSE_DATA, {
      cause: parseResult.error.message,
    });
  }
  return parseResult.data;
}
