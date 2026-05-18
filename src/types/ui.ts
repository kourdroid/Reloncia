export type MoneyAmount = number;

export type InvoiceStatus = 'Nouvelle' | 'En cours' | 'Payée' | 'Litige' | 'Clôturée' | 'Avoir';

export type AgingBucket = 'Current' | '1-30 Days' | '31-60 Days' | '61-90 Days' | '90+ Days';

export interface DashboardKpi {
  totalUnpaid: MoneyAmount;
  overdue30Count: number;
  legalRiskCount: number;
}

export interface CompanyRiskRow {
  id: string;
  name: string;
  unpaidTotal: MoneyAmount;
  overdueCount: number;
  legalRiskCount: number;
  lastReminder: string | null;
  status: 'active' | 'inactive';
}

export interface InvoiceTableRow {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amountMAD: MoneyAmount;
  issueDate: string;
  dueDate: string;
  age: number;
  status: InvoiceStatus;
  reminderCount: number;
  legalRisk: boolean;
}

export interface ClientRiskRow {
  id: string;
  clientName: string;
  unpaidTotal: MoneyAmount;
  averageDelay: number;
  overdueCount: number;
  preferredChannel: 'email' | 'whatsapp' | 'none';
  lastReminder: string | null;
}

export interface ReminderHistoryRow {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  channel: 'email' | 'whatsapp';
  outcome: 'delivered' | 'failed' | 'bounced' | 'pending';
  sentAt: string;
}

export interface ImportReviewRow {
  id: string;
  originalRow: Record<string, string>;
  mappedData: Partial<InvoiceTableRow>;
  isValid: boolean;
  isDuplicate: boolean;
  errors: string[];
}

export interface ReportHistoryRow {
  id: string;
  month: number;
  year: number;
  generatedAt: string;
  downloadUrl: string;
}
