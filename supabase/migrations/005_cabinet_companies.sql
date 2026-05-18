-- Migration 005: Cabinet Companies

CREATE TABLE IF NOT EXISTS public.cabinet_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cabinet_id UUID NOT NULL REFERENCES public.cabinets(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_status CHECK (status IN ('active', 'inactive'))
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_cabinet_companies_active 
  ON public.cabinet_companies (cabinet_id, tenant_id) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_cabinet_companies_tenant_id ON public.cabinet_companies (tenant_id);
CREATE INDEX IF NOT EXISTS idx_cabinet_companies_cabinet_id ON public.cabinet_companies (cabinet_id);
