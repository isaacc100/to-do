import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// A placeholder URL is used at build time to allow module initialization without a real DB.
// All pages/routes that query the DB use `export const dynamic = "force-dynamic"` to ensure
// queries only run at request time when DATABASE_URL is available.
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://build:build@localhost/build";
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
