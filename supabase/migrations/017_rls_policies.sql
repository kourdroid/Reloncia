-- Migration 017: RLS Policies

-- Enable RLS on all tables
ALTER TABLE public.cabinets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabinet_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabinet_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_rows ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- SuperAdmin can read all profiles
CREATE POLICY "SuperAdmins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND platform_role = 'SuperAdmin'
    )
  );

-- Tenants: Tenant members can read their own tenants
CREATE POLICY "Tenant members can read own tenant" ON public.tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenant_members WHERE tenant_id = tenants.id AND profile_id = auth.uid()
    )
  );

-- Tenants: Delegated cabinet members can read tenants
CREATE POLICY "Delegated cabinet members can read tenants" ON public.tenants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.cabinet_companies cc
      JOIN public.cabinet_members cm ON cc.cabinet_id = cm.cabinet_id
      WHERE cc.tenant_id = tenants.id AND cm.profile_id = auth.uid() AND cc.status = 'active'
    )
  );

-- General Policy Template for Tenant-Scoped tables (clients, invoices, etc.)
-- This requires the tenant_id column to exist.
-- (Will be applied to clients, invoices, invoice_lines, reminders, reminder_events, payments, import_jobs, import_rows, audit_logs)

CREATE OR REPLACE FUNCTION public.user_has_tenant_access(target_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tenant_members 
    WHERE tenant_id = target_tenant_id AND profile_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.cabinet_companies cc
    JOIN public.cabinet_members cm ON cc.cabinet_id = cm.cabinet_id
    WHERE cc.tenant_id = target_tenant_id AND cm.profile_id = auth.uid() AND cc.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to tenant-scoped tables
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN SELECT unnest(ARRAY[
    'clients', 'invoices', 'invoice_lines', 'reminders', 'reminder_events', 
    'payments', 'audit_logs', 'import_jobs', 'import_rows'
  ])
  LOOP
    EXECUTE format('
      CREATE POLICY "Users with tenant access can read %1$s" ON public.%1$s
        FOR SELECT USING (public.user_has_tenant_access(tenant_id));
      
      -- We add a simplified ALL policy for non-read-only operations. 
      -- A full implementation would check specific roles (TenantAdmin, etc.)
      CREATE POLICY "Users with tenant access can modify %1$s" ON public.%1$s
        FOR ALL USING (public.user_has_tenant_access(tenant_id));
    ', table_name);
  END LOOP;
END;
$$;
