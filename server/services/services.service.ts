import { storage } from "../storage";
import { InsertService } from "@shared/schema";

class ServicesService {
  async getServices(tenantId: string) { return storage.getServices(tenantId); }
  async getService(id: string, tenantId: string) { return storage.getService(id, tenantId); }
  async createService(tenantId: string, data: InsertService) { return storage.createService(tenantId, data); }
  async updateService(id: string, tenantId: string, data: Partial<InsertService>) { return storage.updateService(id, tenantId, data); }
  async deleteService(id: string, tenantId: string) { return storage.deleteService(id, tenantId); }
}

export const servicesService = new ServicesService();
