import { Router } from "express";
import { authenticateAccess } from "../auth";
import { branchesController } from "../controllers/branches.controller";

const router = Router();

router.get("/", authenticateAccess, branchesController.getAll);
router.post("/", authenticateAccess, branchesController.create);
router.get("/:id", authenticateAccess, branchesController.getOne);
router.put("/:id", authenticateAccess, branchesController.update);
router.delete("/:id", authenticateAccess, branchesController.delete);

export default router;
