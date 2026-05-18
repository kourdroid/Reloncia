import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "../../../../src/supabase/server";
import { generateMonthlyReport } from "../../../../src/services/monthly-report.service";
import { createAuditLog } from "../../../../src/services/audit.service";

/**
 * GET /api/export/[companyId]?month=5&year=2026
 *
 * Generates a monthly AR report for a company and returns a 1-hour signed URL.
 *
 * Auth: Requires authenticated session. Authorization enforced by generateMonthlyReport.
 * Audit: Creates an audit log entry on successful generation.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { companyId: string } }
) {
  const { companyId } = params;
  const searchParams = request.nextUrl.searchParams;

  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  // Validate parameters
  if (!monthParam || !yearParam) {
    return NextResponse.json(
      { error: "Missing required query parameters: month, year" },
      { status: 400 }
    );
  }

  const month = parseInt(monthParam, 10);
  const year = parseInt(yearParam, 10);

  if (isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "Invalid month (must be 1-12)" }, { status: 422 });
  }

  if (isNaN(year) || year < 2000) {
    return NextResponse.json({ error: "Invalid year" }, { status: 422 });
  }

  // Get authenticated user
  const supabase = await createServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // generateMonthlyReport enforces authorization internally
    const result = await generateMonthlyReport({
      companyId,
      month,
      year,
      requestingUserId: user.id,
    });

    // Audit log: record report generation
    await createAuditLog({
      action: "report_generated",
      entity: "report",
      entityId: `${companyId}/${year}-${month}`,
      userId: user.id,
      metadata: { companyId, month, year, expiresAt: result.expiresAt },
    });

    return NextResponse.json({
      signedUrl: result.signedUrl,
      expiresAt: result.expiresAt,
      summary: {
        totalUnpaid: result.reportData.unpaidSummary.totalAmount,
        invoiceCount: result.reportData.unpaidSummary.invoiceCount,
        legalRiskCount: result.reportData.legalRiskInvoices.length,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    // Distinguish auth errors from system errors
    if (message.includes("Unauthorized") || message.includes("Forbidden")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    console.error("[Report Generation] Error:", err);
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
