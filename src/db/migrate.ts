import postgres from "postgres";

async function migrate() {
  const sql = postgres(process.env.DATABASE_URL!);

  console.log("Running database migrations...");

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now() NOT NULL
    )
  `;

  await sql`
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

  await sql`
    CREATE TABLE IF NOT EXISTS list_members (
      list_id UUID NOT NULL REFERENCES lists(id),
      profile_id UUID NOT NULL REFERENCES profiles(id),
      joined_at TIMESTAMP DEFAULT now() NOT NULL,
      PRIMARY KEY (list_id, profile_id)
    )
  `;

  await sql`
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

  await sql`
    CREATE TABLE IF NOT EXISTS activity_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      list_id UUID NOT NULL REFERENCES lists(id),
      profile_id UUID NOT NULL REFERENCES profiles(id),
      action TEXT NOT NULL,
      details JSONB,
      created_at TIMESTAMP DEFAULT now() NOT NULL
    )
  `;

  console.log("Database migrations complete!");
  await sql.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
