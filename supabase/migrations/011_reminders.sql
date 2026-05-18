-- Migration 011: Reminders

CREATE TYPE public.reminder_channel AS ENUM ('email', 'whatsapp');

CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  channel public.reminder_channel NOT NULL,
  message_template TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reminders_tenant_id ON public.reminders (tenant_id);
CREATE INDEX IF NOT EXISTS idx_reminders_created_by ON public.reminders (created_by);
CREATE INDEX IF NOT EXISTS idx_reminders_created_at ON public.reminders (created_at);
