import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env.local if DATABASE_URL is not already set
if (!process.env.DATABASE_URL && !process.env.SUPABASE_DB_URL) {
  try {
    const envPath = join(root, ".env.local");
    const envContent = readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local not found; will rely on environment variable
  }
}

const sqlPath = join(root, "supabase", "migrations", "001_initial_schema.sql");
const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL. Add your Supabase Postgres connection string to .env.local:\n" +
      "DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres",
  );
  process.exit(1);
}

const { default: pg } = await import("pg");
const sql = readFileSync(sqlPath, "utf8");
const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("Database schema applied successfully.");
} catch (error) {
  console.error("Failed to apply schema:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
