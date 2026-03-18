import { storage } from "../storage";

class FinanceService {
  async calculateProfitAndLoss(tenantId: string) {
    // 1. Fetch raw data
    const [payments, expenses, appointments, employees, services] = await Promise.all([
      storage.getPayments(tenantId),
      storage.getExpenses(tenantId),
      storage.getAppointments(tenantId),
      storage.getEmployees(tenantId),
      storage.getServices(tenantId)
    ]);

    // 2. Gross Revenue: Sum of completed payments
    const grossRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(p.amount as string), 0);

    // 3. Payroll calculation
    let payroll = 0;
    const completedAppointments = appointments.filter((a) => a.status === "completed");
    
    completedAppointments.forEach((apt) => {
      const emp = employees.find((e) => e.id === apt.employeeId);
      const svc = services.find((s) => s.id === apt.serviceId);
      if (emp && svc && svc.price) {
        const aptPrice = parseFloat(svc.price as string);
        const salaryRate = parseFloat(emp.salaryRate as any || "0");
        
        if (emp.salaryType === "percentage") {
          payroll += aptPrice * (salaryRate / 100);
        } else if (emp.salaryType === "fixed") {
          payroll += salaryRate;
        } else if (emp.salaryType === "hybrid") {
          payroll += aptPrice * (salaryRate / 100); 
        }
      }
    });

    // 4. OPEX
    const opex = expenses.reduce((sum, e) => sum + parseFloat(e.amount as any || "0"), 0);

    // 5. COGS
    let cogs = 0;
    completedAppointments.forEach((apt) => {
      const svc = services.find((s) => s.id === apt.serviceId);
      if (svc) {
        cogs += parseFloat(svc.costPrice as any || "0");
      }
    });

    const netProfit = grossRevenue - cogs - payroll - opex;

    return {
      grossRevenue,
      cogs,
      payroll,
      opex,
      netProfit,
      currency: "UZS" // enforcing strict UZS currency rules
    };
  }
}

export const financeService = new FinanceService();
