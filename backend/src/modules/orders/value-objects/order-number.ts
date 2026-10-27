const PREFIX = 'FR';
const DIGITS = 6;
const PATTERN = /^FR(\d{1,9})$/i;

export class OrderNumber {
  private constructor(readonly value: number) {}

  static fromNumber(value: number): OrderNumber {
    if (!Number.isInteger(value) || value <= 0) throw new Error(`Invalid order number: ${value}`);
    return new OrderNumber(value);
  }

  static fromString(raw: string): OrderNumber {
    const match = PATTERN.exec(raw.trim());
    if (!match) throw new Error(`Invalid order number: ${raw}`);
    return OrderNumber.fromNumber(Number(match[1]));
  }

  static tryFromString(raw: string): OrderNumber | null {
    try {
      return OrderNumber.fromString(raw);
    } catch {
      return null;
    }
  }

  subOrderId(position: number): string {
    return `${this.toString()}-${position}`;
  }

  toString(): string {
    return `${PREFIX}${String(this.value).padStart(DIGITS, '0')}`;
  }
}
