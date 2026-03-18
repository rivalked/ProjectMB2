import { Request, Response } from "express";
import { inventoryService } from "../services/inventory.service";
import { insertInventorySchema } from "@shared/schema";
import { respondZodError } from "../routes";
import * as xlsx from "xlsx";

class InventoryController {
  getAll = async (req: Request | any, res: Response) => {
    const inventory = await inventoryService.getInventory(req.user.tenantId);
    res.json(inventory);
  };

  getOne = async (req: Request | any, res: Response) => {
    const item = await inventoryService.getInventoryItem(req.params.id, req.user.tenantId);
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(item);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      if (!req.user || !req.user.tenantId) {
        return res.status(403).json({ message: "У вас нет доступа к добавлению материалов (отсутствует tenantId)" });
      }
      const data = insertInventorySchema.parse(req.body);
      const item = await inventoryService.createInventoryItem(req.user.tenantId, data);
      res.status(201).json(item);
    } catch (error) {
      console.error("POST /api/inventory error:", error);
      return respondZodError(res, error);
    }
  };

  update = async (req: Request | any, res: Response) => {
    try {
      const data = insertInventorySchema.partial().parse(req.body);
      const item = await inventoryService.updateInventoryItem(req.params.id, req.user.tenantId, data);
      if (!item) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  delete = async (req: Request | any, res: Response) => {
    const success = await inventoryService.deleteInventoryItem(req.params.id, req.user.tenantId);
    if (!success) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.status(204).send();
  };

  exportExcel = async (req: Request | any, res: Response) => {
    try {
      const data = await inventoryService.getExportData(req.user.tenantId);
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Склад");
      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="inventory.xlsx"');
      res.send(buffer);
    } catch (e) {
      res.status(500).json({ message: "Export failed" });
    }
  };
}

export const inventoryController = new InventoryController();
