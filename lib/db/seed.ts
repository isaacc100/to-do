import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "@/lib/db";
import { categories, systemConfig } from "@/lib/db/schema";

async function seed() {
  console.log("Seeding database...");

  const defaultCategories = [
    { name: "Work", slug: "work", description: "Work-related tasks", sortOrder: 1 },
    { name: "Personal", slug: "personal", description: "Personal tasks", sortOrder: 2 },
    { name: "Shopping", slug: "shopping", description: "Shopping lists", sortOrder: 3 },
    { name: "Health", slug: "health", description: "Health and wellness", sortOrder: 4 },
    { name: "Other", slug: "other", description: "Miscellaneous tasks", sortOrder: 5 },
  ];

  for (const cat of defaultCategories) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  await db.insert(systemConfig).values({ id: 1, isLocked: false }).onConflictDoNothing();

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
