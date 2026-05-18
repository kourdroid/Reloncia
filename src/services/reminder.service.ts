import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function logReminderEvent(client: SupabaseClient<Database>, payload: {
  tenantId: string;
  invoiceId: string;
  channel: string;
  recipient: string;
  content: string;
}) {
  const { data, error } = await client
    .from("reminder_events")
    .insert({
      tenant_id: payload.tenantId,
      invoice_id: payload.invoiceId,
      event_type: "sent",
      channel: payload.channel,
      actor_system: "User",
      description: `Sent via ${payload.channel} to ${payload.recipient}`,
      metadata: { content: payload.content }
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
