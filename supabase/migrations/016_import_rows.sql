-- Migration 016: Import Rows

CREATE TYPE public.import_row_status AS ENUM ('mapped', 'duplicate', 'error', 'imported', 'skipped');

CREATE TABLE IF NOT EXISTS public.import_rows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  import_job_id UUID NOT NULL REFERENCES public.import_jobs(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  raw_json JSONB NOT NULL,
  mapped_json JSONB,
  status public.import_row_status NOT NULL DEFAULT 'mapped',
  errors_json JSONB,
  matched_client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_import_rows_job_id ON public.import_rows (import_job_id);
CREATE INDEX IF NOT EXISTS idx_import_rows_tenant_status ON public.import_rows (tenant_id, status);
