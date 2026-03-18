import { Router } from "express";
import { authenticateAccess } from "../auth";
import { financeController } from "../controllers/finance.controller";

const router = Router();

router.get("/p-and-l", authenticateAccess, financeController.getProfitAndLoss);

export default router;
