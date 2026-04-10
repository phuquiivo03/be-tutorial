import { MQActions } from "../../infrastructure/rabbitmq/constants";

export interface CreateJobDTO {
  id: String;
  data: JSON;
  action: MQActions;
  status?: string;
}
export interface JobDTO {
  id: string;
  data: JSON;
  action: MQActions;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum JobStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}
