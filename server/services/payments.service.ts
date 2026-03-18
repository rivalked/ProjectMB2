import { storage } from "../storage";
import { InsertPayment } from "@shared/schema";

class PaymentsService {
  async getPayments(tenantId: string) { return storage.getPayments(tenantId); }
  async createPayment(tenantId: string, data: InsertPayment) { 
    const payment = await storage.createPayment(tenantId, data);
    
    // Loyalty Program - 5% Bonus Points on successful payment
    if (payment.status === "completed" && payment.clientId) {
      const client = await storage.getClient(payment.clientId, tenantId);
      if (client) {
        const pointsEarned = Math.floor(parseFloat(data.amount as any) * 0.05);
        await (storage as any).updateClient(client.id, tenantId, {
          bonusPoints: (client.bonusPoints || 0) + pointsEarned
        });
      }
    }
    return payment;
  }
}

export const paymentsService = new PaymentsService();
