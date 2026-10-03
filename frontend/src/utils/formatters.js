export function formatCurrency(amount, currency = 'USD') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function formatNumber(num, compact = false) {
  const n = Number(num) || 0;
  if (compact && Math.abs(n) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(n);
  }
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatDate(dateStr, includeYear = false) {
  if (!dateStr) return '';
  let d = new Date(dateStr);
  if (isNaN(d.getTime())) {
    d = new Date(String(dateStr).replace(' ', 'T'));
  }
  if (isNaN(d.getTime())) {
    d = new Date(String(dateStr).replace(' ', 'T') + 'Z');
  }
  if (isNaN(d.getTime())) return String(dateStr).slice(0, 10);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {})
  });
}
