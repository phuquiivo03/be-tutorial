import { DeadlockError } from "./transfer.error";
import { ErrorCodes } from "./error-code";

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
    return new DeadlockError();
  }

  

  // fallback
  return new AppError("UNKNOWN", err.message, false);
}
