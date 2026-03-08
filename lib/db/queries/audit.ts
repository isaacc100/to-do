import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function getAuditLog(limit = 100, offset = 0) {
  return db.query.auditLog.findMany({
    orderBy: [desc(auditLog.eventTimestamp)],
    limit,
    offset,
  });
}
