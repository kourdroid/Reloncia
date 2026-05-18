-- Migration 010: Invoice Lines

CREATE TABLE IF NOT EXISTS public.invoice_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL,
  unit_price NUMERIC(15, 4) NOT NULL,
  tax_rate NUMERIC(5, 2) NOT NULL,
  line_total NUMERIC(15, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invoice_lines_invoice_id ON public.invoice_lines (invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_lines_tenant_invoice ON public.invoice_lines (tenant_id, invoice_id);
