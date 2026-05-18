import { InvoiceStatus } from '../types/ui';

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateFr(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return '-';
  }
}

export function formatInvoiceStatus(status: InvoiceStatus): string {
  // In a real app with next-intl, we would probably pass the translation directly or translate at the component level
  // But providing a default fallback string representation is useful.
  return status;
}
