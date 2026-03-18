import { storage } from "../storage";
import { InsertEmployee } from "@shared/schema";

class EmployeesService {
  async getEmployees(tenantId: string) { return storage.getEmployees(tenantId); }
  async getEmployee(id: string, tenantId: string) { return storage.getEmployee(id, tenantId); }
  async createEmployee(tenantId: string, data: InsertEmployee) { return storage.createEmployee(tenantId, data); }
  async updateEmployee(id: string, tenantId: string, data: Partial<InsertEmployee>) { return storage.updateEmployee(id, tenantId, data); }
  async deleteEmployee(id: string, tenantId: string) { return storage.deleteEmployee(id, tenantId); }
}

export const employeesService = new EmployeesService();
