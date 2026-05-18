export type FeatureFlag = "IMPORT_EXCEL" | "SEND_REMINDER" | "GENERATE_REPORT";

export type Entitlement = {
  maxInvoices: number | null; // null means unlimited
  maxUsers: number | null;
  features: FeatureFlag[];
};

export const defaultEntitlements: Entitlement = {
  maxInvoices: null,
  maxUsers: null,
  features: ["IMPORT_EXCEL", "SEND_REMINDER", "GENERATE_REPORT"],
};

export async function getTenantEntitlements(tenantId: string): Promise<Entitlement> {
  // In Phase 1 MVP, all tenants get default entitlements (ungated).
  // Future phases will fetch plan details from the database.
  return defaultEntitlements;
}

export async function checkFeatureFlag(tenantId: string, feature: FeatureFlag): Promise<boolean> {
  const entitlements = await getTenantEntitlements(tenantId);
  return entitlements.features.includes(feature);
}
