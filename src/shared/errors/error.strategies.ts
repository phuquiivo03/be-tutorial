import { ErrorCodeValues, ErrorStrategy, WorkerContext } from "./error.type";
import { handleCancelJob, handleRetry } from "../../workers/helper";
import { ErrorCodes, ErrorStrategyCodes } from "./errorCode";
import { ErrorStrategyValues } from "./error.type";

export const errorStrategies: Record<ErrorStrategyValues, ErrorStrategy> = {
  [ErrorStrategyCodes.RETRY_JOB]: async ({ channel, msg, retryQueue }) => {
    await handleRetry(msg, channel, retryQueue);
  },
  [ErrorStrategyCodes.CANCEL_JOB]: async ({ channel, msg, data }) => {
    await handleCancelJob(data.id, msg, channel);
  },
  [ErrorStrategyCodes.UNKNOWN]: async ({ channel, msg, retryQueue }) => {
    //
    console.error("Unknown error", msg.content.toString());
  },
};

export const strategiesDictionary: Record<string, ErrorStrategy> = {
  [ErrorCodes.DEAD_LOCK]: errorStrategies[ErrorStrategyCodes.RETRY_JOB],
  [ErrorCodes.FAILED_TO_CREATE_ENTRY]:
    errorStrategies[ErrorStrategyCodes.RETRY_JOB],
  [ErrorCodes.JOB_UPDATED_FAILED]:
    errorStrategies[ErrorStrategyCodes.CANCEL_JOB],
  [ErrorCodes.INSUFFICIENT_BALANCE]:
    errorStrategies[ErrorStrategyCodes.CANCEL_JOB],
};
