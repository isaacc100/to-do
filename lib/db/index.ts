import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// During `next build`, DATABASE_URL may not be available. All routes that
// query the database are marked `export const dynamic = "force-dynamic"` so
// they are never evaluated at build time. A placeholder URL is used only to
// allow module-level initialisation to succeed; any actual DB call without a
// real DATABASE_URL will fail at runtime with a clear network error.
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost/placeholder";
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
