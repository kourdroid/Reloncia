-- Migration 002: Cabinets

CREATE TABLE IF NOT EXISTS public.cabinets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  ice TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_cabinets_name ON public.cabinets (name);
CREATE INDEX IF NOT EXISTS idx_cabinets_email ON public.cabinets (email);
