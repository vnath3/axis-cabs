export interface PricingBand {
  from: number;
  to: number;
}

export function priceRange(bands: PricingBand[]): { low: number; high: number } {
  if (!bands.length) return { low: 0, high: 0 };
  const froms = bands.map(b => b.from);
  const tos = bands.map(b => b.to);
  return { low: Math.min(...froms), high: Math.max(...tos) };
}

export function formatINR(value: number): string {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `₹${value.toLocaleString('en-IN')}`;
  }
}
