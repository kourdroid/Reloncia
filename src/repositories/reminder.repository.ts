import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function createReminderRecord(client: SupabaseClient<Database>, payload: any) {
  // Mock logic
  return { id: "mock-reminder-id" };
}
