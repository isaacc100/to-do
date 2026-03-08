import type { InferSelectModel } from "drizzle-orm";
import type {
  users, tasks, categories, auditLog, blockedIps, systemConfig
} from "@/lib/db/schema";

export type User = InferSelectModel<typeof users>;
export type Task = InferSelectModel<typeof tasks>;
export type Category = InferSelectModel<typeof categories>;
export type AuditLogEntry = InferSelectModel<typeof auditLog>;
export type BlockedIp = InferSelectModel<typeof blockedIps>;
export type SystemConfig = InferSelectModel<typeof systemConfig>;

export type SyncStatus = "pending" | "synced" | "failed";
export type UserRole = "user" | "admin";
