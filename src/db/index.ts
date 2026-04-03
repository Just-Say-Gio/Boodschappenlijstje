import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// Run migrations on first use
let migrated = false;
export async function ensureMigrated() {
  if (migrated) return;
  migrated = true;
  try {
    await client`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        emoji TEXT NOT NULL,
        color TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        share_code TEXT UNIQUE NOT NULL,
        is_archived BOOLEAN DEFAULT false NOT NULL,
        created_by UUID REFERENCES profiles(id),
        created_at TIMESTAMP DEFAULT now() NOT NULL,
        updated_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS list_members (
        list_id UUID NOT NULL REFERENCES lists(id),
        profile_id UUID NOT NULL REFERENCES profiles(id),
        joined_at TIMESTAMP DEFAULT now() NOT NULL,
        PRIMARY KEY (list_id, profile_id)
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        list_id UUID NOT NULL REFERENCES lists(id),
        name TEXT NOT NULL,
        quantity TEXT,
        category TEXT,
        checked BOOLEAN DEFAULT false NOT NULL,
        checked_by UUID REFERENCES profiles(id),
        added_by UUID NOT NULL REFERENCES profiles(id),
        sort_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL,
        updated_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `;
    await client`
      CREATE TABLE IF NOT EXISTS activity_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        list_id UUID NOT NULL REFERENCES lists(id),
        profile_id UUID NOT NULL REFERENCES profiles(id),
        action TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `;
    console.log("Database tables ensured");
  } catch (err) {
    console.error("Migration error:", err);
    migrated = false;
  }
}
