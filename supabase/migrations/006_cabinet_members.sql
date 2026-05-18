-- Migration 006: Cabinet Members

CREATE TYPE public.cabinet_role AS ENUM ('CabinetAdmin', 'CabinetMember', 'ReadOnly');

CREATE TABLE IF NOT EXISTS public.cabinet_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cabinet_id UUID NOT NULL REFERENCES public.cabinets(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.cabinet_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_cabinet_members_cabinet_profile ON public.cabinet_members (cabinet_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_cabinet_members_profile_id ON public.cabinet_members (profile_id);
