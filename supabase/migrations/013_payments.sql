-- Migration 013: Payments

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  payment_date DATE NOT NULL,
  method TEXT,
  reference TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_tenant_invoice ON public.payments (tenant_id, invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_date ON public.payments (tenant_id, payment_date);
