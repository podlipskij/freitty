import { OrderNumber } from './order-number';

describe('OrderNumber', () => {
  it('parses a public number and renders it back zero-padded', () => {
    const number = OrderNumber.fromString(' fr1383 ');

    expect(number.value).toBe(1383);
    expect(number.toString()).toBe('FR001383');
    expect(number.subOrderId(2)).toBe('FR001383-2');
  });

  it('rejects malformed input', () => {
    expect(OrderNumber.tryFromString('ORD-1383')).toBeNull();
    expect(OrderNumber.tryFromString('FR')).toBeNull();
    expect(() => OrderNumber.fromNumber(0)).toThrow('Invalid order number');
  });
});
