import { Router } from "express";
import { getJobById } from "./job.controller";
const router = Router();

router.get("/:id", getJobById);
export default router;
