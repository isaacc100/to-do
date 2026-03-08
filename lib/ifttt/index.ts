import { db } from "@/lib/db";
import { tasks, syncEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const IFTTT_WEBHOOK_KEY = process.env.IFTTT_WEBHOOK_KEY;
const IFTTT_EVENT_NAME = process.env.IFTTT_EVENT_NAME ?? "add_reminder";

export function formatReminderTitle(task: {
  categoryNameSnapshot?: string | null;
  title: string;
}): string {
  if (task.categoryNameSnapshot) {
    return `[${task.categoryNameSnapshot}] ${task.title}`;
  }
  return task.title;
}

export function formatReminderNotes(task: {
  submittedName?: string | null;
  creatorIp: string;
  createdAt: Date;
  dueAt?: Date | null;
  notes?: string | null;
  id: string;
}): string {
  const lines = [
    `Added by: ${task.submittedName || "Anonymous"}`,
    `IP: ${task.creatorIp}`,
    `Created: ${task.createdAt.toISOString()}`,
  ];
  if (task.dueAt) lines.push(`Due: ${task.dueAt.toISOString()}`);
  if (task.notes) lines.push(`Notes: ${task.notes}`);
  lines.push(`Task ID: ${task.id}`);
  return lines.join("\n");
}

export interface SyncResult {
  success: boolean;
  status?: number;
  body?: string;
  error?: string;
}

export async function syncToIfttt(task: {
  id: string;
  title: string;
  notes?: string | null;
  categoryNameSnapshot?: string | null;
  submittedName?: string | null;
  creatorIp: string;
  createdAt: Date;
  dueAt?: Date | null;
}): Promise<SyncResult> {
  if (!IFTTT_WEBHOOK_KEY || !IFTTT_EVENT_NAME) {
    return { success: false, error: "IFTTT not configured" };
  }

  const url = `https://maker.ifttt.com/trigger/${IFTTT_EVENT_NAME}/with/key/${IFTTT_WEBHOOK_KEY}`;
  const payload = {
    value1: formatReminderTitle(task),
    value2: formatReminderNotes(task),
    value3: task.dueAt ? task.dueAt.toISOString() : "",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.text();
    return { success: response.ok, status: response.status, body };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function syncTaskToIfttt(taskId: string): Promise<SyncResult> {
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });

  if (!task) {
    return { success: false, error: "Task not found" };
  }

  const attemptNumber = (task.syncAttempts ?? 0) + 1;
  const requestPayload = {
    value1: formatReminderTitle(task),
    value2: formatReminderNotes({
      ...task,
      createdAt: task.createdAt ?? new Date(),
    }),
    value3: task.dueAt ? task.dueAt.toISOString() : "",
  };

  await db.update(tasks)
    .set({
      syncAttempts: attemptNumber,
      lastSyncAttemptAt: new Date(),
      syncStatus: "pending",
    })
    .where(eq(tasks.id, taskId));

  const result = await syncToIfttt({
    ...task,
    createdAt: task.createdAt ?? new Date(),
  });

  await db.insert(syncEvents).values({
    taskId,
    attemptNumber,
    status: result.success ? "success" : "failed",
    requestPayload,
    responseStatus: result.status ?? null,
    responseBody: result.body ?? null,
    errorMessage: result.error ?? null,
  });

  await db.update(tasks)
    .set({
      syncStatus: result.success ? "synced" : "failed",
      lastSyncAttemptAt: new Date(),
      lastSyncSuccessAt: result.success ? new Date() : task.lastSyncSuccessAt,
      lastSyncError: result.success ? null : (result.error ?? result.body ?? "Unknown error"),
    })
    .where(eq(tasks.id, taskId));

  return result;
}
