import { ErrorCodes } from "./errorCode";
import { ErrorMessages } from "./errorMessage";
import { ErrorStrategyCodes } from "./errorCode";
import { ErrorCodeValues, ErrorStrategyValues } from "./error.type";
export class AppError extends Error {
  public code: string;
  public retryable: boolean;
  public isOperational: boolean;
  public statusCode: number;
  constructor(
    code: string,
    message: string,
    retryable = false,
    isOperational = true,
    statusCode = 500,
  ) {
    super(message);
    this.code = code;
    this.retryable = retryable;
    this.isOperational = isOperational;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, false, false, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, false, false, 404);
  }
}

export class InternalServerError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, false, false, 500);
  }
}
