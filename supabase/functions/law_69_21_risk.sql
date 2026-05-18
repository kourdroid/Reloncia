-- Law 69-21 Legal-Risk Database Functions
-- Scheduled escalation: called by a daily n8n cron trigger (not a Supabase cron).
-- n8n is STRICTLY READ-ONLY here — it calls this function via RPC, never writes directly.

-- Function: get_law_69_21_risk_invoices
-- Returns all invoices approaching or past the legal threshold,
-- used by the daily_deadline_scan n8n workflow.
CREATE OR REPLACE FUNCTION public.get_law_69_21_risk_invoices()
RETURNS TABLE (
  id UUID,
  tenant_id UUID,
  invoice_number TEXT,
  amount_ttc NUMERIC,
  legal_threshold_date DATE,
  days_remaining INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.tenant_id,
    i.invoice_number,
    i.amount_ttc,
    i.legal_threshold_date,
    (i.legal_threshold_date - CURRENT_DATE)::INTEGER AS days_remaining,
    i.status::TEXT
  FROM public.invoices i
  WHERE
    i.status IN ('Nouvelle', 'En cours', 'Litige')
    AND i.legal_threshold_date IS NOT NULL
    AND (i.legal_threshold_date - CURRENT_DATE) <= 10
  ORDER BY i.legal_threshold_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant read-only access to authenticated role (used by n8n via service key with anon restrictions)
COMMENT ON FUNCTION public.get_law_69_21_risk_invoices() IS
  'Returns invoices within 10 days of their Law 69-21 legal threshold date. Called by n8n daily_deadline_scan workflow. Read-only — n8n must never mutate data directly.';

-- Function: get_responsible_users_for_tenant
-- Returns the TenantAdmin and delegated CabinetMember profiles for a given tenant.
-- Used to build the alert recipient list.
CREATE OR REPLACE FUNCTION public.get_responsible_users_for_tenant(p_tenant_id UUID)
RETURNS TABLE (
  profile_id UUID,
  email TEXT,
  role TEXT,
  source TEXT
) AS $$
BEGIN
  -- Tenant admins
  RETURN QUERY
  SELECT
    tm.profile_id,
    p.email,
    tm.role::TEXT,
    'tenant'::TEXT AS source
  FROM public.tenant_members tm
  JOIN public.profiles p ON p.id = tm.profile_id
  WHERE tm.tenant_id = p_tenant_id
    AND tm.role IN ('TenantAdmin', 'TenantManager');

  -- Delegated cabinet members with active access
  RETURN QUERY
  SELECT
    cm.profile_id,
    p.email,
    cm.role::TEXT,
    'cabinet'::TEXT AS source
  FROM public.cabinet_companies cc
  JOIN public.cabinet_members cm ON cm.cabinet_id = cc.cabinet_id
  JOIN public.profiles p ON p.id = cm.profile_id
  WHERE cc.tenant_id = p_tenant_id
    AND cc.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_responsible_users_for_tenant(UUID) IS
  'Returns all responsible users (TenantAdmin, TenantManager, delegated CabinetMembers) for a tenant. Used to build alert recipient lists.';
