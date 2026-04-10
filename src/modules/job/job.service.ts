import prisma from "../../infrastructure/prisma/connect";
import { CreateJobDTO, JobStatus, JobDTO } from "./job.dto";
import { Prisma } from "@prisma/client";
import { ErrorMessages } from "../../shared/errors/error-message";
import { jobSchema } from "./job.schema";
import { parseOrThrow } from "../../utils";
import { Job } from "./job.type";
export class JobService {
  async create(data: CreateJobDTO): Promise<Job> {
    try {
      const createdJob = await prisma.job.create({
        data: {
          id: data.id as string,
          // Nếu data.data là undefined, lưu một object rỗng {} vào database
          data: (data.data || {}) as unknown as Prisma.InputJsonValue,
          action: data.action,
          status: data.status || JobStatus.PENDING,
        },
      });

      return parseOrThrow(jobSchema, createdJob);
    } catch (error) {
      throw new Error(ErrorMessages.FAILED_TO_CREATE_JOB, { cause: error });
    }
  }

  async get(jobId: string): Promise<Job> {
    try {
      const result = await prisma.job.findUnique({
        where: { id: jobId },
      });
      return parseOrThrow(jobSchema, result);
    } catch (error) {
      if (error.message === ErrorMessages.FAILED_TO_PARSE_DATA) throw error;
      throw new Error(ErrorMessages.FAILED_TO_GET_JOB, {
        cause: error.message,
      });
    }
  }

  async update(jobId: string, status: JobStatus): Promise<void> {
    await prisma.job.update({
      where: { id: jobId },
      data: { status },
    });
  }
}

export default new JobService();
