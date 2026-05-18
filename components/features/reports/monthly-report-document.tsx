import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { MonthlyReportData } from "../../../src/repositories/report.repository";

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    color: "#1a1a2e",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1e40af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  label: { color: "#6b7280" },
  value: { fontWeight: "bold" },
  kpiGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    padding: 10,
  },
  kpiLabel: {
    fontSize: 8,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginTop: 4,
  },
  riskBadge: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontSize: 9,
    padding: 3,
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function formatMAD(amount: number) {
  return `${amount.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} MAD`;
}

// ─── Component ─────────────────────────────────────────────────────────────
type Props = { data: MonthlyReportData; companyName?: string };

export function MonthlyReportDocument({ data, companyName = "Entreprise" }: Props) {
  const monthLabel = MONTHS_FR[data.month - 1];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rapport Mensuel de Recouvrement</Text>
          <Text style={styles.subtitle}>
            {companyName} — {monthLabel} {data.year}
          </Text>
        </View>

        {/* KPI Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synthèse</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total Impayé</Text>
              <Text style={styles.kpiValue}>
                {formatMAD(data.unpaidSummary.totalAmount)}
              </Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Factures Impayées</Text>
              <Text style={styles.kpiValue}>{data.unpaidSummary.invoiceCount}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Risque Légal</Text>
              <Text style={[styles.kpiValue, { color: "#dc2626" }]}>
                {data.legalRiskInvoices.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Aging Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance Âgée</Text>
          {Object.entries({
            "0-30 jours": data.agingBreakdown.bucket0to30,
            "31-60 jours": data.agingBreakdown.bucket31to60,
            "61-90 jours": data.agingBreakdown.bucket61to90,
            "90+ jours": data.agingBreakdown.bucket90plus,
          }).map(([bucket, amount]) => (
            <View key={bucket} style={styles.row}>
              <Text style={styles.label}>{bucket}</Text>
              <Text style={styles.value}>{formatMAD(amount)}</Text>
            </View>
          ))}
        </View>

        {/* Legal Risk Invoices */}
        {data.legalRiskInvoices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Factures à Risque Légal (Loi 69-21)</Text>
            {data.legalRiskInvoices.map((inv) => (
              <View key={inv.invoiceId} style={styles.row}>
                <Text style={styles.label}>{inv.invoiceNumber}</Text>
                <Text>{formatMAD(inv.amount)}</Text>
                <Text
                  style={inv.daysRemaining <= 0 ? styles.riskBadge : styles.value}
                >
                  {inv.daysRemaining <= 0 ? "DÉPASSÉ" : `J-${inv.daysRemaining}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          eFacturation — Rapport généré le {new Date().toLocaleDateString("fr-MA")} — Confidentiel
        </Text>
      </Page>
    </Document>
  );
}
