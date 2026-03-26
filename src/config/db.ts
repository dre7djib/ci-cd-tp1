import "dotenv/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables"
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

/** Lightweight round-trip to PostgREST (no row body) for readiness probes. */
export async function pingSupabase(): Promise<boolean> {
  const { error } = await supabase
    .from("product")
    .select("id", { head: true });
  return !error;
}
