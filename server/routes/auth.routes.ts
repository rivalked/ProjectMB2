import { Router } from "express";
import { authenticateAccess } from "../auth";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticateAccess, authController.me);

export default router;
