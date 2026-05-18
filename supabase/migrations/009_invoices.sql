-- Migration 009: Invoices

CREATE TYPE public.invoice_status AS ENUM ('Nouvelle', 'En cours', 'Payée', 'Litige', 'Clôturée', 'Avoir');

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'Nouvelle',
  amount_ht NUMERIC(15, 2) NOT NULL,
  tax_amount NUMERIC(15, 2) NOT NULL,
  amount_ttc NUMERIC(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  legal_threshold_date DATE NOT NULL,
  law_69_21_flag BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_count INTEGER NOT NULL DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  linked_avoir_invoice_id UUID REFERENCES public.invoices(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  
  CONSTRAINT chk_positive_amounts CHECK (
    (status != 'Avoir' AND amount_ttc >= 0) OR
    (status = 'Avoir')
  )
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_tenant_number ON public.invoices (tenant_id, invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_status ON public.invoices (tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_due_date ON public.invoices (tenant_id, due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_law_69_21 ON public.invoices (tenant_id, law_69_21_flag);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON public.invoices (client_id);
