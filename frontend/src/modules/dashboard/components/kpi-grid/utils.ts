export function completedTrend(value: number, previous: number): { text: string; direction: 'up' | 'down' | 'flat' } {
  const diff = value - previous;
  if (diff > 0) return { text: `▲ ${diff} vs previous 30 d`, direction: 'up' };
  if (diff < 0) return { text: `▼ ${-diff} vs previous 30 d`, direction: 'down' };
  return { text: '⟶ same as previous 30 d', direction: 'flat' };
}
