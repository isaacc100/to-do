import { db } from "@/lib/db";
import { tasks, categories } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getTaskById(id: string) {
  return db.query.tasks.findFirst({
    where: and(eq(tasks.id, id), eq(tasks.isDeleted, false)),
  });
}

export async function getTasksByOwner(userId: string) {
  return db.query.tasks.findMany({
    where: and(eq(tasks.ownerUserId, userId), eq(tasks.isDeleted, false)),
    orderBy: [desc(tasks.createdAt)],
  });
}

export async function getAllTasks(limit = 100, offset = 0) {
  return db.query.tasks.findMany({
    where: eq(tasks.isDeleted, false),
    orderBy: [desc(tasks.createdAt)],
    limit,
    offset,
  });
}

export async function updateTaskSyncStatus(
  id: string,
  status: "pending" | "synced" | "failed",
  extra?: Partial<{ lastSyncError: string | null; lastSyncSuccessAt: Date }>
) {
  return db.update(tasks)
    .set({ syncStatus: status, updatedAt: new Date(), ...extra })
    .where(eq(tasks.id, id));
}
