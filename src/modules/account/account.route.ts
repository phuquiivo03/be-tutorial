import { Request, Response, Router } from "express";
import { getAccountBalance } from "./account.controller";
const router = Router();

router.get("/:userId", (req: Request, res: Response) => {
  res.status(200).json({ message: "Account route" });
});
router.get("/:accountId/balance", getAccountBalance);

export default router;
