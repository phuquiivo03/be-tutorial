import JobService from "./job.service";
import { Request, Response } from "express";
export const getJobById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    const job = await JobService.find(id);
    res.status(200).json({ data: job });
  } catch (error) {
    res.status(500).json({ message: "Failed to get job", error });
  }
};
