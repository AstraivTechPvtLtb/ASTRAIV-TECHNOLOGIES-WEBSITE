/**
 * General purpose helper utilities.
 */

/**
 * Formats a numeric value into a USD currency string.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * Formats a date string or Date object into a readable representation.
 * Example: "Jan 1, 2026"
 */
export function formatDate(dateString: string | Date): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// test workflow A

