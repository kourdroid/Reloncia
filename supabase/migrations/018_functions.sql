-- Migration 018: Functions and Triggers

-- Function to safely insert an audit log
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_tenant_id UUID,
  p_actor_profile_id UUID,
  p_action TEXT,
  p_target_table TEXT,
  p_target_id UUID,
  p_before_json JSONB DEFAULT NULL,
  p_after_json JSONB DEFAULT NULL,
  p_metadata_json JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    tenant_id, actor_profile_id, action, target_table, target_id, before_json, after_json, metadata_json
  )
  VALUES (
    p_tenant_id, p_actor_profile_id, p_action, p_target_table, p_target_id, p_before_json, p_after_json, p_metadata_json
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check law 69-21 legal risk threshold
CREATE OR REPLACE FUNCTION public.update_invoice_law_69_21_flag()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('Nouvelle', 'En cours', 'Litige') AND (NEW.legal_threshold_date - CURRENT_DATE) <= 10 THEN
    NEW.law_69_21_flag = TRUE;
  ELSE
    NEW.law_69_21_flag = FALSE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_law_69_21
BEFORE INSERT OR UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_invoice_law_69_21_flag();
