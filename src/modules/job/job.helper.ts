import { ErrorMessages } from "../../shared/errors/error-message";
import { JobStatus } from "./job.dto";
import { Job } from "./job.type";

class JobHelper {
  jobPeding(job: Job | undefined) {
    if (!job) throw new Error(ErrorMessages.FAILED_TO_GET_JOB);
    switch (job.status) {
      case JobStatus.PENDING:
        break;
      case JobStatus.PROCESSING:
        break;
      case JobStatus.COMPLETED:
        throw new Error(ErrorMessages.JOB_IS_COMPLETED);
      case JobStatus.FAILED:
        throw new Error(ErrorMessages.JOB_IS_FAILED);
      default:
        throw new Error(ErrorMessages.UNDEFINED_JOB);
    }
  }
}

export default new JobHelper();
