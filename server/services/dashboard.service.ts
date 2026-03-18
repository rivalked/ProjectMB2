import { storage } from "../storage";

class DashboardService {
  async getStats(tenantId: string) {
    const clients = await storage.getClients(tenantId);
    const appointments = await storage.getAppointments(tenantId);
    const payments = await storage.getPayments(tenantId);
    const services = await storage.getServices(tenantId);
    const employees = await storage.getEmployees(tenantId);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    });

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const revenueMap = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      revenueMap.set(daysOfWeek[d.getDay()], 0);
    }

    const weeklyPayments = payments.filter(payment => {
      const createdAt = payment.createdAt ? new Date(payment.createdAt) : new Date();
      return createdAt >= weekStart;
    });

    let weeklyRevenue = 0;
    weeklyPayments.forEach(payment => {
      const amount = parseFloat(payment.amount as any);
      weeklyRevenue += amount;
      const paymentDate = payment.createdAt ? new Date(payment.createdAt) : new Date();
      if (paymentDate >= weekStart) {
        const dayName = daysOfWeek[paymentDate.getDay()];
        revenueMap.set(dayName, (revenueMap.get(dayName) || 0) + amount);
      }
    });

    const revenueData = Array.from(revenueMap.entries()).map(([name, revenue]) => ({ name, revenue }));

    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount as any), 0);
    const averageCheck = payments.length > 0 ? Math.round(totalRevenue / payments.length) : 0;

    const returningClients = clients.filter(c => (c.totalVisits || 0) > 1).length;
    const retentionRate = clients.length > 0 ? Math.round((returningClients / clients.length) * 100) : 0;

    const serviceCounts: Record<string, number> = {};
    appointments.forEach(apt => {
      if (apt.serviceId) {
        serviceCounts[apt.serviceId] = (serviceCounts[apt.serviceId] || 0) + 1;
      }
    });
    const servicePopularityData = Object.entries(serviceCounts)
      .map(([svcId, count]) => {
        const svc = services.find(s => s.id === svcId);
        return { name: svc?.name || "Неизвестно", value: count };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const employeeCounts: Record<string, number> = {};
    appointments.forEach(apt => {
      if (apt.employeeId) {
        employeeCounts[apt.employeeId] = (employeeCounts[apt.employeeId] || 0) + 1;
      }
    });
    const employeePerformanceData = Object.entries(employeeCounts)
      .map(([empId, count]) => {
        const emp = employees.find(e => e.id === empId);
        return { name: emp?.name || "Неизвестно", value: count };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const upcomingAppointments = appointments
      .filter(apt => new Date(apt.appointmentDate) >= now)
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 4)
      .map(apt => {
        const client = clients.find(c => c.id === apt.clientId);
        const service = services.find(s => s.id === apt.serviceId);
        const employee = employees.find(e => e.id === apt.employeeId);
        const aptDate = new Date(apt.appointmentDate);
        return {
          id: apt.id,
          clientName: client?.name || "Без имени",
          service: service?.name || "Услуга",
          employee: employee?.name || "Мастер",
          time: String(aptDate.getHours()).padStart(2, '0') + ":" + String(aptDate.getMinutes()).padStart(2, '0')
        };
      });

    return {
      totalClients: clients.length,
      todayAppointments: todayAppointments.length,
      weeklyRevenue,
      staffUtilization: 78,
      averageCheck,
      retentionRate,
      revenueData: revenueData.length ? revenueData : [{ name: "Нет данных", revenue: 0 }],
      servicePopularityData: servicePopularityData.length ? servicePopularityData : [{ name: "Нет данных", value: 1 }],
      employeePerformanceData: employeePerformanceData.length ? employeePerformanceData : [{ name: "Нет данных", value: 1 }],
      upcomingAppointments
    };
  }
}

export const dashboardService = new DashboardService();
