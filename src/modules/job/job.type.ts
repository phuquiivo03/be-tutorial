import { z } from "zod";
import { jobSchema } from "./job.schema";

export type Job = z.infer<typeof jobSchema>;
