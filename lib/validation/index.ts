import { z } from "zod";

export const TaskSubmissionSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title too long"),
  notes: z.string().max(5000, "Notes too long").optional(),
  categoryId: z.string().uuid("Invalid category").optional(),
  submittedName: z.string().max(200, "Name too long").optional(),
  dueAt: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).default(0),
  isEnabled: z.boolean().default(true),
});

export const BlockIpSchema = z.object({
  ipAddress: z.string().min(1, "IP address is required").max(45),
  reason: z.string().max(500).optional(),
});

export const SystemLockSchema = z.object({
  isLocked: z.boolean(),
  lockReason: z.string().max(500).optional(),
});

export const TaskEditSchema = z.object({
  title: z.string().min(1).max(500),
  notes: z.string().max(5000).optional(),
  dueAt: z.string().optional().nullable(),
});
