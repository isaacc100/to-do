import {
  pgTable, uuid, text, timestamp, boolean, integer, jsonb, primaryKey
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const accounts = pgTable("accounts", {
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (t) => [primaryKey({ columns: [t.identifier, t.token] })]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  isEnabled: boolean("isEnabled").notNull().default(true),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  createdByUserId: uuid("createdByUserId").references(() => users.id),
  updatedByUserId: uuid("updatedByUserId").references(() => users.id),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  notes: text("notes"),
  categoryId: uuid("categoryId").references(() => categories.id),
  categoryNameSnapshot: text("categoryNameSnapshot"),
  submittedName: text("submittedName"),
  createdByUserId: uuid("createdByUserId").references(() => users.id),
  ownerUserId: uuid("ownerUserId").references(() => users.id),
  creatorIp: text("creatorIp").notNull(),
  creatorUserAgent: text("creatorUserAgent"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  dueAt: timestamp("dueAt", { mode: "date" }),
  syncStatus: text("syncStatus").notNull().default("pending"),
  syncAttempts: integer("syncAttempts").notNull().default(0),
  lastSyncAttemptAt: timestamp("lastSyncAttemptAt", { mode: "date" }),
  lastSyncSuccessAt: timestamp("lastSyncSuccessAt", { mode: "date" }),
  lastSyncError: text("lastSyncError"),
  externalSyncReference: text("externalSyncReference"),
  isDeleted: boolean("isDeleted").notNull().default(false),
});

export const auditLog = pgTable("auditLog", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventType: text("eventType").notNull(),
  entityType: text("entityType"),
  entityId: text("entityId"),
  actorUserId: uuid("actorUserId").references(() => users.id),
  actorIp: text("actorIp"),
  actorUserAgent: text("actorUserAgent"),
  eventTimestamp: timestamp("eventTimestamp", { mode: "date" }).notNull().defaultNow(),
  eventSummary: text("eventSummary").notNull(),
  metadata: jsonb("metadata"),
});

export const blockedIps = pgTable("blockedIps", {
  id: uuid("id").primaryKey().defaultRandom(),
  ipAddress: text("ipAddress").notNull(),
  reason: text("reason"),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  createdByUserId: uuid("createdByUserId").references(() => users.id),
  removedAt: timestamp("removedAt", { mode: "date" }),
  removedByUserId: uuid("removedByUserId").references(() => users.id),
});

export const systemConfig = pgTable("systemConfig", {
  id: integer("id").primaryKey().default(1),
  isLocked: boolean("isLocked").notNull().default(false),
  lockReason: text("lockReason"),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  updatedByUserId: uuid("updatedByUserId").references(() => users.id),
});

export const syncEvents = pgTable("syncEvents", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("taskId").notNull().references(() => tasks.id),
  attemptNumber: integer("attemptNumber").notNull(),
  attemptedAt: timestamp("attemptedAt", { mode: "date" }).notNull().defaultNow(),
  status: text("status").notNull(),
  requestPayload: jsonb("requestPayload"),
  responseStatus: integer("responseStatus"),
  responseBody: text("responseBody"),
  errorMessage: text("errorMessage"),
});
