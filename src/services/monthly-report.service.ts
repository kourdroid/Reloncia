import { createAdminClient } from "../supabase/admin";
import {
  fetchMonthlyReportData,
  type MonthlyReportData,
} from "../repositories/report.repository";
import { requireTenantAccess } from "./access.service";

export type GenerateReportInput = {
  companyId: string;
  month: number;
  year: number;
  requestingUserId: string;
};

export type GenerateReportResult = {
  reportData: MonthlyReportData;
  signedUrl: string;
  expiresAt: string;
};

/**
 * Orchestrates monthly report generation for a company.
 *
 * Security model:
 * 1. Requires tenant access (enforced by requireTenantAccess)
 * 2. Fetches all data read-only via fetchMonthlyReportData
 * 3. Uploads PDF to private 'reports' bucket
 * 4. Returns a 1-hour signed URL — never a public URL
 */
export async function generateMonthlyReport(
  input: GenerateReportInput
): Promise<GenerateReportResult> {
  const adminClient = createAdminClient();

  // 1. Authorization check
  await requireTenantAccess(adminClient, input.requestingUserId, input.companyId);

  // 2. Aggregate report data
  const reportData = await fetchMonthlyReportData(
    adminClient,
    input.companyId,
    input.month,
    input.year
  );

  // 3. Generate storage path with tenant isolation
  // Path: reports/{companyId}/{year}-{month:02d}.pdf
  const storagePath = `reports/${input.companyId}/${input.year}-${String(input.month).padStart(2, "0")}.pdf`;

  // 4. In production: generate PDF bytes with React PDF, upload to 'reports' bucket
  // For scaffold: create a placeholder upload
  const { error: uploadError } = await adminClient.storage
    .from("reports")
    .upload(storagePath, new Blob(["PDF placeholder"]), {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError && !uploadError.message.includes("already exists")) {
    throw new Error(`Report upload failed: ${uploadError.message}`);
  }

  // 5. Create 1-hour signed URL
  const { data: signedData, error: signedError } = await adminClient.storage
    .from("reports")
    .createSignedUrl(storagePath, 3600);

  if (signedError || !signedData?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${signedError?.message}`);
  }

  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

  return {
    reportData,
    signedUrl: signedData.signedUrl,
    expiresAt,
  };
}
