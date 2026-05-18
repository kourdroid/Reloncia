-- Migration 012: Reminder Events

CREATE TYPE public.reminder_outcome AS ENUM ('pending', 'sent', 'failed', 'delivered', 'opened', 'responded');

CREATE TABLE IF NOT EXISTS public.reminder_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  channel public.reminder_channel NOT NULL,
  outcome public.reminder_outcome NOT NULL DEFAULT 'pending',
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reminder_events_tenant_invoice ON public.reminder_events (tenant_id, invoice_id);
CREATE INDEX IF NOT EXISTS idx_reminder_events_tenant_created ON public.reminder_events (tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reminder_events_provider_msg ON public.reminder_events (provider_message_id) WHERE provider_message_id IS NOT NULL;
