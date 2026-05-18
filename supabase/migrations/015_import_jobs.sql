-- Migration 015: Import Jobs

CREATE TYPE public.import_job_status AS ENUM ('pending', 'mapping', 'validated', 'importing', 'complete', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS public.import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  status public.import_job_status NOT NULL DEFAULT 'pending',
  mapping_json JSONB,
  total_rows INTEGER DEFAULT 0,
  accepted_rows INTEGER DEFAULT 0,
  rejected_rows INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_import_jobs_tenant_created ON public.import_jobs (tenant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_import_jobs_status ON public.import_jobs (status);
