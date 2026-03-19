import { config } from "dotenv";
config();
import { createDb } from "../server/db";
import { users, tenants } from "../shared/schema";
import { eq, isNull, and } from "drizzle-orm";

async function seedDemoTenant() {
  const db = createDb();
  console.log("🌱 Start seeding Demo Tenant...");

  let demoTenantId: string;
  const existingTenants = await db.select().from(tenants).where(eq(tenants.name, "Демо Салон")).limit(1);
  if (existingTenants.length === 0) {
    console.log("Creating new tenant...");
    const [insertedTenant] = await db.insert(tenants).values({
      name: "Демо Салон",
      businessType: "salon",
    }).returning();
    demoTenantId = insertedTenant.id;
  } else {
    demoTenantId = existingTenants[0].id;
    console.log("Found existing tenant:", demoTenantId);
  }

  console.log("Updating admin users with missing tenantId...");
  const updateResult = await db.update(users)
    .set({ tenantId: demoTenantId })
    .where(and(eq(users.role, "admin"), isNull(users.tenantId)))
    .returning();

  console.log(`✅ Updated ${updateResult.length} admin users.`);
  console.log("Success! Demo tenant is configured.");
  process.exit(0);
}

seedDemoTenant().catch((err) => {
  console.error("Error seeding tenant:", err);
  process.exit(1);
});
