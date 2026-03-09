import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getEnabledCategories() {
  return db.query.categories.findMany({
    where: eq(categories.isEnabled, true),
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
}

export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: [asc(categories.sortOrder), asc(categories.name)],
  });
}

export async function getCategoryById(id: string) {
  return db.query.categories.findFirst({
    where: eq(categories.id, id),
  });
}
