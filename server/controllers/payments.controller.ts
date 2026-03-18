import { Request, Response } from "express";
import { paymentsService } from "../services/payments.service";
import { insertPaymentSchema } from "@shared/schema";
import { respondZodError } from "../routes";

class PaymentsController {
  getAll = async (req: Request | any, res: Response) => {
    const payments = await paymentsService.getPayments(req.user.tenantId);
    res.json(payments);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      const data = insertPaymentSchema.parse(req.body);
      const payment = await paymentsService.createPayment(req.user.tenantId, data);
      res.status(201).json(payment);
    } catch (error) {
      return respondZodError(res, error);
    }
  };
}

export const paymentsController = new PaymentsController();
