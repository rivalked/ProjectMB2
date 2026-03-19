import { Request, Response } from "express";
import { clientsService } from "../services/clients.service";
import { insertClientSchema } from "@shared/schema";
import { respondZodError } from "../routes";
import * as xlsx from "xlsx";

class ClientsController {
  getAll = async (req: Request | any, res: Response) => {
    const clients = await clientsService.getClients(req.user.tenantId);
    res.json(clients);
  };

  getOne = async (req: Request | any, res: Response) => {
    const client = await clientsService.getClient(req.params.id, req.user.tenantId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      if (!req.user || !req.user.tenantId) {
        return res.status(403).json({ message: "У вас нет привязки к бизнесу (tenantId) для создания этой записи" });
      }
      const tenantId = req.user.tenantId;
      const parsedData = insertClientSchema.parse(req.body);
      const data = { ...parsedData, tenantId };
      const client = await clientsService.createClient(tenantId, data as any);
      res.status(201).json(client);
    } catch (error: any) {
      console.error("[CLIENT CREATION ERROR]:", error);
      return res.status(400).json({ 
        message: "Ошибка создания", 
        details: error instanceof Error ? error.message : error,
        zodErrors: error.errors || null 
      });
    }
  };

  update = async (req: Request | any, res: Response) => {
    try {
      const data = insertClientSchema.partial().parse(req.body);
      const client = await clientsService.updateClient(req.params.id, req.user.tenantId, data);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  delete = async (req: Request | any, res: Response) => {
    const success = await clientsService.deleteClient(req.params.id, req.user.tenantId);
    if (!success) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(204).send();
  };

  exportExcel = async (req: Request | any, res: Response) => {
    try {
      const data = await clientsService.getExportData(req.user.tenantId);
      const ws = xlsx.utils.json_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Клиенты");
      const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="clients.xlsx"');
      res.send(buffer);
    } catch (e) {
      res.status(500).json({ message: "Export failed" });
    }
  };
}

export const clientsController = new ClientsController();
