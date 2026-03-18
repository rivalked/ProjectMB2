import { Router } from "express";
import { authenticateAccess } from "../auth";
import { dashboardController } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", authenticateAccess, dashboardController.getStats);

export default router;
