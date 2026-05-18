-- Migration 008: Clients

CREATE TYPE public.preferred_channel AS ENUM ('email', 'whatsapp');

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  ice TEXT,
  address TEXT,
  preferred_channel public.preferred_channel,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_tenant_id ON public.clients (tenant_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_tenant_email ON public.clients (tenant_id, email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_tenant_ice ON public.clients (tenant_id, ice) WHERE ice IS NOT NULL;

-- Trigram index for name matching
CREATE INDEX IF NOT EXISTS idx_clients_name_trgm ON public.clients USING gin (name gin_trgm_ops);
