import { z } from "zod";
import { MQActions } from "../../infrastructure/rabbitmq/constants";
import { JobStatus } from "./job.dto";
export const jobSchema = z.object({
  id: z.string(),
  data: z.any(),
  action: z.enum(Object.values(MQActions)),
  status: z.enum(Object.values(JobStatus)),
  createdAt: z.date(),
  updatedAt: z.date(),
});
