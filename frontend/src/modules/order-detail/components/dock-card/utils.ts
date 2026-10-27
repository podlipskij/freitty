export function dockNumber(dock: string): number | null {
  const match = /dock\s*(\d+)/i.exec(dock);
  return match ? Number(match[1]) : null;
}
