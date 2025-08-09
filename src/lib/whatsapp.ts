export function waPrefillText(payload: Record<string, string | number | undefined>) {
  const lines = [
    'Ride request:',
    `From: ${payload.from_city ?? ''}`,
    `To: ${payload.to_city ?? ''}`,
    `Date/Time: ${payload.date ?? ''} ${payload.time ?? ''}`,
    `Pax/Bags: ${payload.pax ?? ''}/${payload.bags ?? ''}`,
    `Notes: ${payload.notes ?? ''}`
  ];
  return encodeURIComponent(lines.join('\n'));
}