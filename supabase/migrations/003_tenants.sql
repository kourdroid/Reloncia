-- Migration 003: Tenants

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  ice TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  default_payment_delay_days INTEGER NOT NULL DEFAULT 60,
  locale TEXT NOT NULL DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenants_ice ON public.tenants (ice);
CREATE INDEX IF NOT EXISTS idx_tenants_email ON public.tenants (email);
