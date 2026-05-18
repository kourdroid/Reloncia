import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { insertAuditLog, CreateAuditLogParams } from "../repositories/audit.repository";
import { DomainError, ErrorCodes } from "./errors";

export async function logAuditAction(client: SupabaseClient<Database>, params: CreateAuditLogParams) {
  try {
    await insertAuditLog(client, params);
  } catch (err) {
    // Fail-closed behavior: if we cannot audit, we should throw an error to fail the mutation.
    throw new DomainError(ErrorCodes.INTERNAL_ERROR, "Audit log failed", err);
  }
}
