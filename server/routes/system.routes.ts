import { Router } from "express";
import { authenticateAccess } from "../auth";
import { storage } from "../storage";

const router = Router();

// Billing and Subscriptions
router.post("/payments/subscribe", authenticateAccess, async (req: any, res) => {
  const { provider } = req.body;
  const tenantId = req.user.tenantId;

  if (!tenantId) return res.status(400).json({ message: "Valid tenant required" });
  res.json({ url: `https://mock-${provider}.uz/pay?account=${tenantId}&amount=100000`, orderId: "mock_order_123" });
});

router.post("/payments/callback/:provider", async (req, res) => {
  const { provider } = req.params;
  const { tenantId, subscriptionId, status } = req.body;

  if (status === "success" && tenantId && subscriptionId) {
    if ((storage as any).updateTenant) {
      await (storage as any).updateTenant(tenantId, { subscriptionId, status: 'active' });
    }
    return res.json({ success: true, message: `Payment verified via ${provider}` });
  }
  res.status(400).json({ success: false, message: "Invalid payment payload" });
});

router.post("/addons/purchase", authenticateAccess, async (req: any, res) => {
  const { addonId } = req.body;
  const tenantId = req.user.tenantId;

  if (!tenantId) return res.status(400).json({ message: "Valid tenant required" });
  if ((storage as any).addTenantAddon) {
    await (storage as any).addTenantAddon({ tenantId, addonId, active: true });
  }
  res.json({ success: true, message: "Addon purchased successfully" });
});

// Settings / Integrations
router.patch("/tenant/settings", authenticateAccess, async (req: any, res) => {
  try {
    const { telegramBotToken, botEnabled } = req.body;
    const tenant = await (storage as any).updateTenant(req.user.tenantId, { telegramBotToken, botEnabled });
    res.json(tenant);
  } catch (error) { res.status(500).json({ message: "Failed to update settings" }); }
});

// Telegram Bot Webhook
router.post("/bot/webhook/:tenantId", async (req, res) => {
  try {
    const { tenantId } = req.params;
    const tenant = await (storage as any).getTenant(tenantId);

    if (!tenant || !tenant.botEnabled) return res.status(404).json({ ok: false, message: "Bot not enabled" });
    const message = req.body.message;
    if (!message || !message.text) return res.status(200).json({ ok: true });

    const text = message.text.toLowerCase();
    let replyText = "Я пока не понимаю этот запрос.";
    if (text.includes("услуг") || text.includes("прайс") || text.includes("цен")) {
      const services = await storage.getServices(tenantId);
      replyText = "Список наших услуг:\n" + services.map(s => `- ${s.name}: ${s.price} ₸`).join("\n");
    } else if (text.includes("запись") || text.includes("записаться")) {
      replyText = `Вы можете записаться онлайн по этой ссылке: https://crm.yourdomain.com/book/${tenantId}`;
    } else {
      replyText = `Здравствуйте! Я умный ассистент ${tenant.name}. Вы можете спросить меня: "Какие у вас услуги?" или "Как записаться?"`;
    }

    res.status(200).json({ method: "sendMessage", chat_id: message.chat?.id, text: replyText });
  } catch (error) { res.status(500).json({ ok: false }); }
});

// Public Booking Routes
router.get("/public/tenant/:id/info", async (req, res) => {
  const tenant = await (storage as any).getTenant(req.params.id);
  if (!tenant) return res.status(404).json({ message: "Tenant not found" });

  const services = await storage.getServices(tenant.id);
  const employees = await storage.getEmployees(tenant.id);
  res.json({ tenant: { name: tenant.name, businessType: tenant.businessType }, services, employees });
});

router.post("/public/appointments", async (req, res) => {
  try {
    const { tenantId, name, phone, serviceId, employeeId, appointmentDate } = req.body;
    if (!tenantId || !name || !phone || !serviceId || !employeeId || !appointmentDate) return res.status(400).json({ message: "Missing required fields" });

    const clients = await storage.getClients(tenantId);
    let client = clients.find(c => c.phone === phone);
    if (!client) client = await storage.createClient(tenantId, { name, phone });

    const aptData = { clientId: client.id, serviceId, employeeId, branchId: "default", appointmentDate: new Date(appointmentDate), status: "scheduled", notes: "Online booking" };
    const appointment = await storage.createAppointment(tenantId, aptData as any);
    res.status(201).json(appointment);
  } catch (err) { res.status(400).json({ message: "Failed to book online" }); }
});

export default router;
