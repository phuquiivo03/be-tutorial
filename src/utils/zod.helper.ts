import Zod, { ZodType } from "zod";
import { ErrorMessages } from "../shared/errors/errorMessage";
import { AppError } from "../shared/errors";
import { ErrorStatusCode } from "../shared/errors/errorCode";
export function parseOrThrow<T>(schema: Zod.ZodSchema<T>, data: unknown): T {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    throw new AppError(
      ErrorMessages.FAILED_TO_PARSE_DATA,
      ErrorMessages.FAILED_TO_PARSE_DATA,
      ErrorStatusCode.BAD_REQUEST,
    );
  }
  return parseResult.data;
}
