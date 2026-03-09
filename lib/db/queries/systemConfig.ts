import { db } from "@/lib/db";
import { systemConfig } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getSystemConfig() {
  return db.query.systemConfig.findFirst({
    where: eq(systemConfig.id, 1),
  });
}

export async function isSystemLocked(): Promise<boolean> {
  const config = await getSystemConfig();
  return config?.isLocked ?? false;
}
