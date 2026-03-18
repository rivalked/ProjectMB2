import { storage } from "../storage";
import { InsertAppointment } from "@shared/schema";

class AppointmentsService {
  async getAppointments(tenantId: string) { return storage.getAppointments(tenantId); }
  async getAppointment(id: string, tenantId: string) { return storage.getAppointment(id, tenantId); }
  async createAppointment(tenantId: string, data: InsertAppointment) { return storage.createAppointment(tenantId, data); }
  async updateAppointment(id: string, tenantId: string, data: Partial<InsertAppointment>) { return storage.updateAppointment(id, tenantId, data); }
  async deleteAppointment(id: string, tenantId: string) { return storage.deleteAppointment(id, tenantId); }
}

export const appointmentsService = new AppointmentsService();
