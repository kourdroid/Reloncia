import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function createImportJobRecord(client: SupabaseClient<Database>, payload: any) {
  // Mock logic
  return { id: "mock-job-id" };
}
