import { AppError } from "./Error";
import { ErrorCodes } from "./error-code";
import { ErrorMessages } from "./error-message";

export class DeadlockError extends AppError {
  constructor() {
    super(ErrorCodes.DEAD_LOCK, "Deadlock detected", true);
  }
}

export class InsufficientBalanceError extends AppError {
  constructor() {
    super(
      ErrorCodes.INSUFFICIENT_BALANCE,
      ErrorMessages.INSUFFICIENT_BALANCE,
      false,
    );
  }
}
