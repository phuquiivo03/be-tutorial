import { WorkerContext } from "../shared/errors/transfer.error.type";
import { handleCancelJob, handleRetry } from "./helper";
import { ErrorCodes } from "../shared/errors/error-code";

type ErrorStrategy = (ctx: WorkerContext) => Promise<void>;
type ErrorCodeValue = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const errorStrategies: Record<ErrorCodeValue, ErrorStrategy> = {
  [ErrorCodes.DEAD_LOCK]: async ({ channel, msg, retryQueue }) => {
    await handleRetry(msg, channel, retryQueue);
  },
  [ErrorCodes.INSUFFICIENT_BALANCE]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.FAILED_TO_CREATE_ENTRY]: async ({ channel, msg, retryQueue }) => {
    await handleRetry(msg, channel, retryQueue);
  },
  [ErrorCodes.FAILED_TO_CREATE_JOB]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.JOB_UPDATED_FAILED]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.FAILED_TO_CREATE_ACCOUNT]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.FAILED_TO_GET_JOB]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.JOB_IS_COMPLETED]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.JOB_IS_FAILED]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.UNDEFINED_JOB]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorCodes.UNKNOWN]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
};
