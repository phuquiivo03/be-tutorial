import { AppError } from "../../shared/errors/Error";
import { ErrorCodes } from "../../shared/errors/error-code";
import { ErrorMessages } from "../../shared/errors/error-message";
import { JobStatus } from "./job.dto";
import { Job } from "./job.type";

class JobHelper {
  jobPeding(job: Job | undefined) {
    if (!job)
      throw new AppError(
        ErrorCodes.FAILED_TO_GET_JOB,
        ErrorMessages.FAILED_TO_GET_JOB,
      );
    switch (job.status) {
      case JobStatus.PENDING:
        break;
      case JobStatus.PROCESSING:
        break;
      case JobStatus.COMPLETED:
        throw new AppError(
          ErrorCodes.JOB_IS_COMPLETED,
          ErrorMessages.JOB_IS_COMPLETED,
        );
      case JobStatus.FAILED:
        throw new AppError(
          ErrorCodes.JOB_IS_FAILED,
          ErrorMessages.JOB_IS_FAILED,
        );
      default:
        throw new AppError(
          ErrorCodes.UNDEFINED_JOB,
          ErrorMessages.UNDEFINED_JOB,
        );
    }
  }
}

export default new JobHelper();
