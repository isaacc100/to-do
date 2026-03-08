import { db } from "@/lib/db";
import { auditLog } from "@/lib/db/schema";

export type AuditEventType =
  | "TASK_CREATED" | "TASK_EDITED" | "TASK_DELETED"
  | "TASK_SYNC_ATTEMPTED" | "TASK_SYNC_SUCCEEDED" | "TASK_SYNC_FAILED"
  | "CATEGORY_CREATED" | "CATEGORY_UPDATED" | "CATEGORY_DELETED"
  | "LOGIN_SUCCEEDED" | "SYSTEM_LOCKED" | "SYSTEM_UNLOCKED"
  | "IP_BLOCKED" | "IP_UNBLOCKED" | "BLOCKED_REQUEST_DENIED"
  | "SYSTEM_LOCK_DENIED_REQUEST";

export async function writeAuditLog(params: {
  eventType: AuditEventType;
  entityType?: string;
  entityId?: string;
  actorUserId?: string;
  actorIp?: string;
  actorUserAgent?: string;
  eventSummary: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(auditLog).values({
      eventType: params.eventType,
      entityType: params.entityType ?? null,
      entityId: params.entityId ?? null,
      actorUserId: params.actorUserId ?? null,
      actorIp: params.actorIp ?? null,
      actorUserAgent: params.actorUserAgent ?? null,
      eventSummary: params.eventSummary,
      metadata: params.metadata ?? null,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}
