import { Router } from "express";
import { authenticateAccess } from "../auth";
import { inventoryController } from "../controllers/inventory.controller";

const router = Router();

router.get("/export", authenticateAccess, inventoryController.exportExcel);
router.get("/", authenticateAccess, inventoryController.getAll);
router.post("/", authenticateAccess, inventoryController.create);
router.get("/:id", authenticateAccess, inventoryController.getOne);
router.put("/:id", authenticateAccess, inventoryController.update);
router.delete("/:id", authenticateAccess, inventoryController.delete);

export default router;
