-- Storage Policies for Reports Bucket
-- The 'reports' bucket must be PRIVATE (not public).
-- Create the bucket manually in Supabase Studio or via seed:
--   INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false);

-- POLICY: Tenant members can read only their own company reports
-- Path format: reports/{companyId}/{year}-{month}.pdf

/*
CREATE POLICY "Tenant members can read own reports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'reports'
  AND (storage.foldername(name))[1] IN (
    SELECT t.id::TEXT
    FROM public.tenant_members tm
    JOIN public.tenants t ON t.id = tm.tenant_id
    WHERE tm.profile_id = auth.uid()
  )
);

CREATE POLICY "Cabinet members can read delegated company reports"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'reports'
  AND (storage.foldername(name))[1] IN (
    SELECT cc.tenant_id::TEXT
    FROM public.cabinet_companies cc
    JOIN public.cabinet_members cm ON cm.cabinet_id = cc.cabinet_id
    WHERE cm.profile_id = auth.uid()
      AND cc.status = 'active'
  )
);

-- Only service role (server-side) can insert reports
-- Application code uses adminClient (service key) for uploads
*/

-- Note: Apply these policies after creating the bucket in Supabase Studio.
