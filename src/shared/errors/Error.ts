import { ErrorCodes } from "./error-code";
import { ErrorMessages } from "./error-message";

export class AppError extends Error {
  public code: string;
  public retryable: boolean;

  constructor(code: string, message: string, retryable = false) {
    super(message);
    this.code = code;
    this.retryable = retryable;
  }
}

export function normalizeError(err: any): AppError {
  // Prisma deadlock
  if (err.code === "P2010" && err.message.includes(ErrorCodes.DEAD_LOCK)) {
    return new AppError(ErrorCodes.DEAD_LOCK, ErrorMessages.DEAD_LOCK);
  }

  // fallback
  return new AppError("UNKNOWN", err.message, false);
}
