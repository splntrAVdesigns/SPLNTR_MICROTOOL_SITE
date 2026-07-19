import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client (service role).
 *
 * SERVER ONLY — the service role key bypasses Row Level Security and must
 * never reach the browser. The `server-only` import makes any accidental
 * client-side import a build error.
 *
 * Returns null when env vars aren't configured yet so the app still runs
 * locally before Supabase is set up (the waitlist route falls back to logging).
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
