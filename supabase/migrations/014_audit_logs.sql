-- Migration 014: Audit Logs

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  actor_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  before_json JSONB,
  after_json JSONB,
  metadata_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_created ON public.audit_logs (tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs (actor_profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs (target_table, target_id);
