import { AppError } from "./Error";
import { ErrorCodes, ErrorStrategyCodes } from "./errorCode";
import { ErrorMessages } from "./errorMessage";
import {
  ErrorCodeValues,
  ErrorStrategy,
  ErrorStrategyValues,
} from "./error.type";
import { errorStrategies, strategiesDictionary } from "./error.strategies";
export function normalizeError(err: any): AppError {
  // Prisma deadlock
  if (err.code === "P2010" && err.message.includes(ErrorCodes.DEAD_LOCK)) {
    return new AppError(ErrorCodes.DEAD_LOCK, ErrorMessages.DEAD_LOCK, false);
  }

  // fallback
  return new AppError(err.code || "UNKNOWN", err.message, false);
}

export function getErrorStrategy(code: ErrorCodeValues): ErrorStrategy {
  const strategy = strategiesDictionary[code];
  if (strategy) {
    return strategy;
  }
  const defaultStrategy = errorStrategies[ErrorStrategyCodes.UNKNOWN];
  return defaultStrategy;
}
