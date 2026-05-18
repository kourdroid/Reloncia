export async function dispatchReminder(payload: {
  tenantId: string;
  invoiceIds: string[];
  channel: string;
  messageTemplate: string;
}) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("N8N_WEBHOOK_URL not configured. Skipping actual dispatch.");
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to dispatch to n8n");
  }
}
