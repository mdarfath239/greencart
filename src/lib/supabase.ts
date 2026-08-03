import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database.types";

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }

  return { url, anonKey };
}

/** Browser-safe client for public reads and Clerk JWT-scoped requests. */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = getPublicSupabaseConfig();

  return createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Alias for server components that only need public access. */
export const createSupabasePublicClient = createSupabaseBrowserClient;
