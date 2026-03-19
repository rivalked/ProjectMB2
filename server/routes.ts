import type { Express } from "express";
import { createServer, type Server } from "http";
import { ZodError } from "zod";

import authRoutes from "./routes/auth.routes";
import financeRoutes from "./routes/finance.routes";
import branchesRoutes from "./routes/branches.routes";
import inventoryRoutes from "./routes/inventory.routes";
import clientsRoutes from "./routes/clients.routes";
import employeesRoutes from "./routes/employees.routes";
import servicesRoutes from "./routes/services.routes";
import appointmentsRoutes from "./routes/appointments.routes";
import paymentsRoutes from "./routes/payments.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import adminRoutes from "./routes/admin.routes";
import systemRoutes from "./routes/system.routes";

export function respondZodError(res: any, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      errors: error.errors.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  // Настоящая причина ошибки (например, ошибка базы данных от Neon)
  return res.status(500).json({ 
    message: error instanceof Error ? error.message : "Внутренняя ошибка сервера" 
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Mount Clean Architecture routes
  app.use("/api/auth", authRoutes);
  app.use("/api/finance", financeRoutes);
  app.use("/api/branches", branchesRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/clients", clientsRoutes);
  app.use("/api/employees", employeesRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/appointments", appointmentsRoutes);
  app.use("/api/payments", paymentsRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  
  // Mount the rest of the endpoints (Admin, System, Bot, Public Booking)
  app.use("/api/super-admin", adminRoutes);
  app.use("/api", systemRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
