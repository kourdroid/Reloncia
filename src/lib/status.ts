import { InvoiceStatus } from '../types/ui';

export function getStatusBadgeVariant(status: InvoiceStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'Payée':
      return 'default'; // Or custom 'success' variant if added to Badge
    case 'Nouvelle':
    case 'En cours':
      return 'secondary';
    case 'Litige':
      return 'destructive';
    case 'Clôturée':
    case 'Avoir':
      return 'outline';
    default:
      return 'default';
  }
}
