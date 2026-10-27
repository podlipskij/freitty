const PART = /^(\d+)\s*[×x]\s*(Std|Standard|XL)$/i;

export class PalletQuantity {
  constructor(
    readonly standard: number,
    readonly xl: number,
  ) {
    if (standard < 0 || xl < 0) throw new Error('Pallet quantity cannot be negative');
  }

  static fromString(raw: string): PalletQuantity {
    let standard = 0;
    let xl = 0;

    for (const part of raw
      .split('+')
      .map((p) => p.trim())
      .filter(Boolean)) {
      const match = PART.exec(part);
      if (!match) throw new Error(`Invalid pallet quantity: ${raw}`);
      const count = Number(match[1]);
      if (match[2].toUpperCase() === 'XL') xl += count;
      else standard += count;
    }

    return new PalletQuantity(standard, xl);
  }

  get total(): number {
    return this.standard + this.xl;
  }

  toString(): string {
    const parts: string[] = [];
    if (this.standard) parts.push(`${this.standard} × Std`);
    if (this.xl) parts.push(`${this.xl} × XL`);
    return parts.join(' + ') || '—';
  }
}
