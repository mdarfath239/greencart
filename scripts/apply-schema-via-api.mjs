/**
 * Applies GreenCart schema via Supabase's built-in pg_execute or direct raw query
 * using the service role key through supabase-js.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env.local
try {
  const envContent = readFileSync(join(root, ".env.local"), "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
} catch { /* ignore */ }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Split the SQL into individual statements and run each one
const sqlPath = join(root, "supabase", "migrations", "001_initial_schema.sql");
const fullSql = readFileSync(sqlPath, "utf8");

// Split on semicolons, filter empty
const statements = fullSql
  .split(";")
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith("--"));

console.log(`Found ${statements.length} SQL statements to execute...\n`);

let success = 0;
let skipped = 0;

for (const stmt of statements) {
  // Use supabase.rpc to run raw SQL if pg_execute exists, otherwise try via REST
  // Actually use the /rest/v1/rpc/exec_sql approach - but that function may not exist.
  // Instead, use supabase-js to query directly by wrapping in a function call.
  
  const label = stmt.slice(0, 60).replace(/\n/g, " ");
  
  // Try using supabase.schema().select() to test, and rpc for execution
  const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" }).single();
  
  if (error) {
    if (error.code === "PGRST202") {
      // exec_sql function doesn't exist — need to create it first
      console.log("ℹ️  exec_sql RPC not found. Attempting to create it...");
      
      // Use the admin REST endpoint directly to create the function
      const createFnSql = `
        create or replace function exec_sql(sql text) returns void
        language plpgsql security definer as $$
        begin execute sql; end; $$;
      `;
      
      const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": serviceKey,
          "Authorization": `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ sql: stmt + ";" }),
      });
      
      if (!resp.ok) {
        console.log(`\n❌ Cannot run DDL through PostgREST directly.`);
        console.log("PostgREST only supports DML (SELECT/INSERT/UPDATE/DELETE), not DDL (CREATE TABLE).");
        console.log("\n── You need ONE of these to apply the schema ──────────────────────");
        console.log("Option A: Add DATABASE_URL to .env.local (direct Postgres connection)");
        console.log(`  Go to: https://supabase.com/dashboard/project/lpufnssategukzjcfrby/settings/database`);
        console.log("  Copy: Connection string → URI → Transaction pooler");
        console.log("  Add to .env.local: DATABASE_URL=postgresql://...");
        console.log("  Then run: node scripts/setup-database.mjs\n");
        console.log("Option B: Paste the SQL in the Supabase SQL Editor");
        console.log(`  Go to: https://supabase.com/dashboard/project/lpufnssategukzjcfrby/sql/new`);
        console.log(`  Copy the SQL from: supabase/migrations/001_initial_schema.sql`);
        console.log("  Click Run\n");
        process.exit(1);
      }
      skipped++;
    } else if (error.message?.includes("already exists")) {
      console.log(`  ⚠️  Already exists (skipping): ${label}`);
      skipped++;
    } else {
      console.log(`  ❌ Error on: ${label}`);
      console.log(`     ${error.message}`);
    }
  } else {
    console.log(`  ✅ ${label}`);
    success++;
  }
}

console.log(`\nDone. ${success} applied, ${skipped} skipped.`);
