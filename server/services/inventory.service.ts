import { storage } from "../storage";
import { InsertInventory } from "@shared/schema";

class InventoryService {
  async getInventory(tenantId: string) { return storage.getInventory(tenantId); }
  async getInventoryItem(id: string, tenantId: string) { return storage.getInventoryItem(id, tenantId); }
  async createInventoryItem(tenantId: string, data: InsertInventory) { return storage.createInventoryItem(tenantId, data); }
  async updateInventoryItem(id: string, tenantId: string, data: Partial<InsertInventory>) { return storage.updateInventoryItem(id, tenantId, data); }
  async deleteInventoryItem(id: string, tenantId: string) { return storage.deleteInventoryItem(id, tenantId); }
  
  async getExportData(tenantId: string) {
    const inventory = await storage.getInventory(tenantId);
    const branches = await storage.getBranches(tenantId);
    return inventory.map(item => ({
      "Название": item.name,
      "Категория": item.category || "general",
      "Количество": item.quantity,
      "Мин. остаток": item.minQuantity,
      "Ед. изм.": item.unit,
      "Филиал": branches.find(b => b.id === item.branchId)?.name || "Общий склад",
    }));
  }
}

export const inventoryService = new InventoryService();
