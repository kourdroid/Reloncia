import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { getUserRoleInTenant, getUserRoleInCabinet } from "../repositories/access.repository";
import { DomainError, ErrorCodes } from "./errors";

export async function requireTenantAccess(client: SupabaseClient<Database>, tenantId: string, profileId: string) {
  const role = await getUserRoleInTenant(client, tenantId, profileId);
  
  if (!role) {
    // Check if cabinet has access
    const { data: cabinetAccess } = await client
      .from("cabinet_companies")
      .select("cabinet_id")
      .eq("tenant_id", tenantId)
      .eq("status", "active");

    if (cabinetAccess && cabinetAccess.length > 0) {
      for (const c of cabinetAccess) {
        const cabRole = await getUserRoleInCabinet(client, c.cabinet_id, profileId);
        if (cabRole) return { type: "cabinet", role: cabRole };
      }
    }

    throw new DomainError(ErrorCodes.FORBIDDEN, "Access denied to tenant");
  }

  return { type: "tenant", role };
}
