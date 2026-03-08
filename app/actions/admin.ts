"use server";

import { db } from "@/lib/db";
import { systemConfig, blockedIps, tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SystemLockSchema, BlockIpSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { requireAdmin } from "@/lib/permissions";
import { getClientIp } from "@/lib/request";
import type { ActionResult } from "./tasks";

export async function lockSystem(formData: unknown): Promise<ActionResult> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  const parsed = SystemLockSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  const { isLocked, lockReason } = parsed.data;

  await db.insert(systemConfig).values({
    id: 1,
    isLocked,
    lockReason: lockReason ?? null,
    updatedByUserId: currentUser.id,
  }).onConflictDoUpdate({
    target: systemConfig.id,
    set: { isLocked, lockReason: lockReason ?? null, updatedAt: new Date(), updatedByUserId: currentUser.id },
  });

  await writeAuditLog({
    eventType: isLocked ? "SYSTEM_LOCKED" : "SYSTEM_UNLOCKED",
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: isLocked ? `System locked: ${lockReason ?? "No reason given"}` : "System unlocked",
  });

  return { success: true, data: undefined };
}

export async function blockIp(formData: unknown): Promise<ActionResult> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  const parsed = BlockIpSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  await db.insert(blockedIps).values({
    ipAddress: parsed.data.ipAddress,
    reason: parsed.data.reason ?? null,
    createdByUserId: currentUser.id,
  });

  await writeAuditLog({
    eventType: "IP_BLOCKED",
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `IP blocked: ${parsed.data.ipAddress}`,
  });

  return { success: true, data: undefined };
}

export async function unblockIp(blockedIpId: string): Promise<ActionResult> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  await db.update(blockedIps).set({
    isActive: false,
    removedAt: new Date(),
    removedByUserId: currentUser.id,
  }).where(eq(blockedIps.id, blockedIpId));

  await writeAuditLog({
    eventType: "IP_UNBLOCKED",
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `IP unblocked: ${blockedIpId}`,
  });

  return { success: true, data: undefined };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  await db.update(tasks).set({ isDeleted: true, updatedAt: new Date() }).where(eq(tasks.id, taskId));

  await writeAuditLog({
    eventType: "TASK_DELETED",
    entityType: "task",
    entityId: taskId,
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `Task deleted: ${taskId}`,
  });

  return { success: true, data: undefined };
}
