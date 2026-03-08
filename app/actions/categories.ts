"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CategorySchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { requireAdmin } from "@/lib/permissions";
import { getClientIp } from "@/lib/request";
import type { ActionResult } from "./tasks";

export async function createCategory(formData: unknown): Promise<ActionResult<{ id: string }>> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  const parsed = CategorySchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const [cat] = await db.insert(categories).values({
    ...parsed.data,
    createdByUserId: currentUser.id,
    updatedByUserId: currentUser.id,
  }).returning({ id: categories.id });

  await writeAuditLog({
    eventType: "CATEGORY_CREATED",
    entityType: "category",
    entityId: cat.id,
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `Category created: ${parsed.data.name}`,
  });

  return { success: true, data: { id: cat.id } };
}

export async function updateCategory(categoryId: string, formData: unknown): Promise<ActionResult> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  const parsed = CategorySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Validation failed" };
  }

  await db.update(categories).set({
    ...parsed.data,
    updatedAt: new Date(),
    updatedByUserId: currentUser.id,
  }).where(eq(categories.id, categoryId));

  await writeAuditLog({
    eventType: "CATEGORY_UPDATED",
    entityType: "category",
    entityId: categoryId,
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `Category updated: ${parsed.data.name}`,
  });

  return { success: true, data: undefined };
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  const currentUser = await requireAdmin();
  const ip = await getClientIp();

  await db.delete(categories).where(eq(categories.id, categoryId));

  await writeAuditLog({
    eventType: "CATEGORY_DELETED",
    entityType: "category",
    entityId: categoryId,
    actorUserId: currentUser.id,
    actorIp: ip,
    eventSummary: `Category deleted: ${categoryId}`,
  });

  return { success: true, data: undefined };
}
