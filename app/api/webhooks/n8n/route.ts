import { NextResponse } from "next/server";
import { z } from "zod";

// ─── Webhook Secret Guard ──────────────────────────────────────────────────
function verifySecret(request: Request): boolean {
  const secret = request.headers.get("x-n8n-secret");
  const expected = process.env.N8N_WEBHOOK_SECRET;
  if (!expected) {
    console.error("N8N_WEBHOOK_SECRET is not configured");
    return false;
  }
  return secret === expected;
}

// ─── Event Schemas ─────────────────────────────────────────────────────────
const ReminderSentSchema = z.object({
  event: z.literal("reminder_sent"),
  invoiceId: z.string().uuid(),
  channel: z.enum(["email", "whatsapp"]),
  status: z.enum(["delivered", "failed", "bounced"]),
  deliveredAt: z.string().optional(),
  errorMessage: z.string().optional(),
});

const DeadlineAlertSchema = z.object({
  event: z.literal("deadline_alert"),
  invoiceId: z.string().uuid(),
  status: z.enum(["notified", "failed"]),
});

const ReminderFailedSchema = z.object({
  event: z.literal("reminder_failed"),
  invoiceId: z.string().uuid(),
  channel: z.enum(["email", "whatsapp"]),
  errorMessage: z.string(),
});

const WebhookEventSchema = z.discriminatedUnion("event", [
  ReminderSentSchema,
  DeadlineAlertSchema,
  ReminderFailedSchema,
]);

type WebhookEvent = z.infer<typeof WebhookEventSchema>;

// ─── Event Handlers ────────────────────────────────────────────────────────
async function handleReminderSent(event: z.infer<typeof ReminderSentSchema>) {
  // Log the delivery outcome. In a full implementation, this would:
  // 1. Update the reminder_events row with delivered_at or error
  // 2. Potentially trigger a follow-up reminder if bounced
  console.log(`[n8n] reminder_sent for invoice ${event.invoiceId}: ${event.status}`);
}

async function handleDeadlineAlert(event: z.infer<typeof DeadlineAlertSchema>) {
  // Record that the deadline alert was dispatched.
  // In a full implementation: update invoice metadata or create an audit_log entry.
  console.log(`[n8n] deadline_alert for invoice ${event.invoiceId}: ${event.status}`);
}

async function handleReminderFailed(event: z.infer<typeof ReminderFailedSchema>) {
  // Record the failure for manual follow-up.
  console.warn(
    `[n8n] reminder_failed for invoice ${event.invoiceId} via ${event.channel}: ${event.errorMessage}`
  );
}

// ─── Route Handler ─────────────────────────────────────────────────────────
export async function POST(request: Request) {
  // 1. Authenticate webhook call
  if (!verifySecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 3. Validate event shape
  const parsed = WebhookEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Unknown or malformed event", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const event = parsed.data as WebhookEvent;

  // 4. Dispatch to typed handler
  try {
    switch (event.event) {
      case "reminder_sent":
        await handleReminderSent(event);
        break;
      case "deadline_alert":
        await handleDeadlineAlert(event);
        break;
      case "reminder_failed":
        await handleReminderFailed(event);
        break;
    }
  } catch (err) {
    console.error("[n8n] Webhook handler error:", err);
    return NextResponse.json({ error: "Internal handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true, event: event.event });
}
