import { Priority, Status } from '../types';

export function formatDateID(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function isOverdue(deadline: string, status: Status): boolean {
  if (status === 'done') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = deadline.split('-');
  if (parts.length !== 3) return false;
  const dDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  dDate.setHours(0, 0, 0, 0);

  return dDate.getTime() < today.getTime();
}

export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 'low':
      return 'Rendah';
    case 'medium':
      return 'Sedang';
    case 'high':
      return 'Tinggi';
    default:
      return priority;
  }
}

export function getPriorityBadgeClass(priority: Priority): string {
  switch (priority) {
    case 'low':
      return 'bg-canvas-soft text-muted border border-hairline';
    case 'medium':
      return 'bg-amber-500/10 text-amber-700 border border-amber-500/20';
    case 'high':
      return 'bg-red-500/10 text-red-700 border border-red-500/20';
    default:
      return 'bg-canvas-soft text-muted';
  }
}

export function formatDomainUrl(domain: string): string {
  if (!domain) return '#';
  if (/^https?:\/\//i.test(domain)) {
    return domain;
  }
  return `https://${domain}`;
}

export function getDefaultDeadline(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
