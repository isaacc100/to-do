"use server";

import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { TaskSubmissionSchema, TaskEditSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { syncTaskToIfttt } from "@/lib/ifttt";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getCurrentUser, requireAuth } from "@/lib/permissions";
import { isIpBlocked } from "@/lib/db/queries/blockedIps";
import { isSystemLocked } from "@/lib/db/queries/systemConfig";
import { getCategoryById } from "@/lib/db/queries/categories";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitTask(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const ip = await getClientIp();
  const userAgent = await getUserAgent();
  const currentUser = await getCurrentUser();

  const locked = await isSystemLocked();
  if (locked) {
    await writeAuditLog({
      eventType: "SYSTEM_LOCK_DENIED_REQUEST",
      actorIp: ip,
      actorUserAgent: userAgent ?? undefined,
      eventSummary: "Task submission denied - system is locked",
    });
    return { success: false, error: "The system is currently locked. Please try again later." };
  }

  const blocked = await isIpBlocked(ip);
  if (blocked) {
    await writeAuditLog({
      eventType: "BLOCKED_REQUEST_DENIED",
      actorIp: ip,
      actorUserAgent: userAgent ?? undefined,
      eventSummary: `Task submission denied - IP blocked: ${ip}`,
    });
    return { success: false, error: "Your IP address has been blocked." };
  }

  const parsed = TaskSubmissionSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { title, notes, categoryId, submittedName, dueAt } = parsed.data;

  let categoryNameSnapshot: string | null = null;
  if (categoryId) {
    const category = await getCategoryById(categoryId);
    if (category?.isEnabled) {
      categoryNameSnapshot = category.name;
    }
  }

  const [task] = await db.insert(tasks).values({
    title,
    notes: notes ?? null,
    categoryId: categoryId ?? null,
    categoryNameSnapshot,
    submittedName: submittedName ?? null,
    createdByUserId: currentUser?.id ?? null,
    ownerUserId: currentUser?.id ?? null,
    creatorIp: ip,
    creatorUserAgent: userAgent ?? null,
    dueAt: dueAt ? new Date(dueAt) : null,
  }).returning({ id: tasks.id });

  await writeAuditLog({
    eventType: "TASK_CREATED",
    entityType: "task",
    entityId: task.id,
    actorUserId: currentUser?.id,
    actorIp: ip,
    actorUserAgent: userAgent ?? undefined,
    eventSummary: `Task created: "${title}"`,
    metadata: { categoryId, submittedName },
  });

  const syncResult = await syncTaskToIfttt(task.id);

  if (syncResult.success) {
    await writeAuditLog({
      eventType: "TASK_SYNC_SUCCEEDED",
      entityType: "task",
      entityId: task.id,
      actorIp: ip,
      eventSummary: `Task synced to IFTTT: "${title}"`,
    });
  } else {
    await writeAuditLog({
      eventType: "TASK_SYNC_FAILED",
      entityType: "task",
      entityId: task.id,
      actorIp: ip,
      eventSummary: `Task sync failed: "${title}" - ${syncResult.error ?? syncResult.body}`,
    });
  }

  return { success: true, data: { id: task.id } };
}

export async function editTask(taskId: string, formData: unknown): Promise<ActionResult> {
  const currentUser = await requireAuth();
  const ip = await getClientIp();

  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, taskId) });
  if (!task || task.isDeleted) {
    return { success: false, error: "Task not found" };
  }

  const isOwner = task.ownerUserId === currentUser.id;
  const isAdminUser = currentUser.role === "admin";
  if (!isOwner && !isAdminUser) {
    return { success: false, error: "You do not have permission to edit this task" };
  }

  const parsed = TaskEditSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { title, notes, dueAt } = parsed.data;

  await db.update(tasks).set({
    title,
    notes: notes ?? null,
    dueAt: dueAt ? new Date(dueAt) : null,
    updatedAt: new Date(),
  }).where(eq(tasks.id, taskId));

  await writeAuditLog({
    eventType: "TASK_EDITED",
    entityType: "task",
    entityId: taskId,
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `Task edited: "${title}"`,
  });

  return { success: true, data: undefined };
}

export async function retryTaskSync(taskId: string): Promise<ActionResult> {
  const currentUser = await requireAuth();
  if (currentUser.role !== "admin") {
    return { success: false, error: "Forbidden" };
  }

  const result = await syncTaskToIfttt(taskId);
  if (result.success) {
    return { success: true, data: undefined };
  }
  return { success: false, error: result.error ?? "Sync failed" };
}
