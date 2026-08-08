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
    statusCode = 500,
    retryable = false,
    isOperational = true,
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
    super(code, message, 400, false, false);
  }
}

export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 404, false, false);
  }
}

export class InternalServerError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 500, false, false);
  }
}
