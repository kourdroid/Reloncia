"use server";

import { createClient } from "../../supabase/server";
import { reminderSchema } from "../../validation/ar-recovery";
import { dispatchReminder } from "../../services/n8n-dispatcher.service";
import { logReminderEvent } from "../../services/reminder.service";

export async function sendReminderAction(formData: FormData) {
  const supabase = await createClient();
  
  // Dummy data extraction for MVP
  const rawData = {
    invoiceIds: formData.getAll("invoiceIds"),
    channel: formData.get("channel"),
    messageTemplate: formData.get("messageTemplate"),
  };

  const parsed = reminderSchema.parse(rawData);

  // In real app, fetch tenantId from session
  const tenantId = "dummy-tenant";

  await dispatchReminder({
    tenantId,
    ...parsed,
  });

  // Log events
  for (const id of parsed.invoiceIds) {
    await logReminderEvent(supabase, {
      tenantId,
      invoiceId: id,
      channel: parsed.channel,
      recipient: "Client",
      content: parsed.messageTemplate
    });
  }

  return { success: true };
}
