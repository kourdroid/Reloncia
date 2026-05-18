export type RiskLevel = 'critical' | 'warning' | 'stable'

export type CabinetCompanySummary = {
  id: string
  name: string
  unpaidMad: number
  overdueInvoices: number
  legalRiskInvoices: number
  lastReminderAt: string
  riskLevel: RiskLevel
}

export type AgingBucket = {
  label: string
  amount: number
  invoices: number
  fill: string
}

export type LateClient = {
  name: string
  company: string
  amount: number
  invoices: number
  averageDelayDays: number
  riskLevel: RiskLevel
}

export type LegalRiskInvoice = {
  invoiceNumber: string
  company: string
  client: string
  amount: number
  thresholdDate: string
  daysLeft: number
}

export type DashboardActivity = {
  id: string
  label: string
  company: string
  timestamp: string
  status: 'sent' | 'paid' | 'risk' | 'imported'
}

export const formatMAD = (amount: number) =>
  new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(amount)

export const formatDateFr = (date: string) =>
  new Intl.DateTimeFormat('fr-MA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))

export const cabinetDashboardDemo = {
  kpis: {
    totalUnpaidMad: 1_284_500,
    overdueInvoices: 84,
    legalRiskInvoices: 19,
    remindersDueToday: 31,
  },
  companies: [
    {
      id: 'atlascorp',
      name: 'Atlas Distribution',
      unpaidMad: 428_900,
      overdueInvoices: 24,
      legalRiskInvoices: 8,
      lastReminderAt: '2026-05-17',
      riskLevel: 'critical',
    },
    {
      id: 'medilog',
      name: 'Medilog Services',
      unpaidMad: 302_450,
      overdueInvoices: 17,
      legalRiskInvoices: 5,
      lastReminderAt: '2026-05-16',
      riskLevel: 'warning',
    },
    {
      id: 'northbuild',
      name: 'NorthBuild SARL',
      unpaidMad: 221_700,
      overdueInvoices: 11,
      legalRiskInvoices: 3,
      lastReminderAt: '2026-05-14',
      riskLevel: 'warning',
    },
    {
      id: 'rivacom',
      name: 'Rivacom Digital',
      unpaidMad: 96_300,
      overdueInvoices: 4,
      legalRiskInvoices: 0,
      lastReminderAt: '2026-05-10',
      riskLevel: 'stable',
    },
  ] satisfies CabinetCompanySummary[],
  agingBalance: [
    { label: '0-30 jours', amount: 352_000, invoices: 43, fill: 'var(--chart-1)' },
    { label: '30-60 jours', amount: 487_500, invoices: 58, fill: 'var(--chart-2)' },
    { label: '60+ jours', amount: 445_000, invoices: 37, fill: 'var(--chart-5)' },
  ] satisfies AgingBucket[],
  topLateClients: [
    {
      name: 'Société Horizon',
      company: 'Atlas Distribution',
      amount: 182_400,
      invoices: 7,
      averageDelayDays: 71,
      riskLevel: 'critical',
    },
    {
      name: 'Clinique Anfa',
      company: 'Medilog Services',
      amount: 96_800,
      invoices: 4,
      averageDelayDays: 54,
      riskLevel: 'warning',
    },
    {
      name: 'BTP Maroc Nord',
      company: 'NorthBuild SARL',
      amount: 74_500,
      invoices: 3,
      averageDelayDays: 48,
      riskLevel: 'warning',
    },
    {
      name: 'Retail Pro Casablanca',
      company: 'Atlas Distribution',
      amount: 39_700,
      invoices: 2,
      averageDelayDays: 22,
      riskLevel: 'stable',
    },
  ] satisfies LateClient[],
  legalRiskAlerts: [
    {
      invoiceNumber: 'FAC-2026-1182',
      company: 'Atlas Distribution',
      client: 'Société Horizon',
      amount: 58_000,
      thresholdDate: '2026-05-24',
      daysLeft: 6,
    },
    {
      invoiceNumber: 'FAC-2026-0934',
      company: 'Medilog Services',
      client: 'Clinique Anfa',
      amount: 42_800,
      thresholdDate: '2026-05-27',
      daysLeft: 9,
    },
    {
      invoiceNumber: 'FAC-2026-0771',
      company: 'NorthBuild SARL',
      client: 'BTP Maroc Nord',
      amount: 31_500,
      thresholdDate: '2026-05-28',
      daysLeft: 10,
    },
  ] satisfies LegalRiskInvoice[],
  recentActivity: [
    {
      id: 'act-1',
      label: 'Relance email envoyée',
      company: 'Atlas Distribution',
      timestamp: 'Aujourd’hui, 09:12',
      status: 'sent',
    },
    {
      id: 'act-2',
      label: 'Facture marquée payée',
      company: 'Rivacom Digital',
      timestamp: 'Aujourd’hui, 08:44',
      status: 'paid',
    },
    {
      id: 'act-3',
      label: 'Seuil 69-21 détecté',
      company: 'Medilog Services',
      timestamp: 'Hier, 17:30',
      status: 'risk',
    },
    {
      id: 'act-4',
      label: 'Import Excel validé',
      company: 'NorthBuild SARL',
      timestamp: 'Hier, 15:05',
      status: 'imported',
    },
  ] satisfies DashboardActivity[],
}
