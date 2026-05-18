import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Json } from "../types/supabase";

export type CreateAuditLogParams = {
  tenantId: string;
  actorProfileId: string;
  action: string;
  targetTable: string;
  targetId: string;
  beforeJson?: Json;
  afterJson?: Json;
  metadataJson?: Json;
};

export async function insertAuditLog(client: SupabaseClient<Database>, params: CreateAuditLogParams) {
  const { error } = await client.rpc("create_audit_log", {
    p_tenant_id: params.tenantId,
    p_actor_profile_id: params.actorProfileId,
    p_action: params.action,
    p_target_table: params.targetTable,
    p_target_id: params.targetId,
    p_before_json: params.beforeJson,
    p_after_json: params.afterJson,
    p_metadata_json: params.metadataJson,
  });

  if (error) throw new Error("Failed to insert audit log");
}
