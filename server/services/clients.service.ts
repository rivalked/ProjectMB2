import { storage } from "../storage";
import { InsertClient } from "@shared/schema";

class ClientsService {
  async getClients(tenantId: string) { return storage.getClients(tenantId); }
  async getClient(id: string, tenantId: string) { return storage.getClient(id, tenantId); }
  async createClient(tenantId: string, data: InsertClient) { return storage.createClient(tenantId, data); }
  async updateClient(id: string, tenantId: string, data: Partial<InsertClient>) { return storage.updateClient(id, tenantId, data); }
  async deleteClient(id: string, tenantId: string) { return storage.deleteClient(id, tenantId); }
  
  async getExportData(tenantId: string) {
    const clients = await storage.getClients(tenantId);
    return clients.map(client => ({
      "Имя": client.name,
      "Телефон": client.phone,
      "Email": client.email || "",
      "Бонусы": client.bonusPoints || 0,
      "Визиты": client.totalVisits || 0,
    }));
  }
}

export const clientsService = new ClientsService();
