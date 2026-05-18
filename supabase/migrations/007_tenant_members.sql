-- Migration 007: Tenant Members

CREATE TYPE public.tenant_role AS ENUM ('TenantAdmin', 'TenantUser', 'ReadOnly');

CREATE TABLE IF NOT EXISTS public.tenant_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.tenant_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_members_tenant_profile ON public.tenant_members (tenant_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_profile_id ON public.tenant_members (profile_id);
