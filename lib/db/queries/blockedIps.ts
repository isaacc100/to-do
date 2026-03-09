import { db } from "@/lib/db";
import { blockedIps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function isIpBlocked(ip: string): Promise<boolean> {
  const result = await db.query.blockedIps.findFirst({
    where: eq(blockedIps.ipAddress, ip),
  });
  return result?.isActive ?? false;
}

export async function getBlockedIps() {
  return db.query.blockedIps.findMany({
    where: eq(blockedIps.isActive, true),
  });
}

export async function getAllBlockedIps() {
  return db.query.blockedIps.findMany();
}
