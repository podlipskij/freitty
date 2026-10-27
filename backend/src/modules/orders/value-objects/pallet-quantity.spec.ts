import { PalletQuantity } from './pallet-quantity';

describe('PalletQuantity', () => {
  it('parses a mixed quantity and round-trips through toString', () => {
    const quantity = PalletQuantity.fromString('15 × Std + 3 x XL');

    expect(quantity.standard).toBe(15);
    expect(quantity.xl).toBe(3);
    expect(quantity.total).toBe(18);
    expect(PalletQuantity.fromString(quantity.toString())).toEqual(quantity);
  });

  it('rejects unknown units and negative counts', () => {
    expect(() => PalletQuantity.fromString('4 × Euro')).toThrow('Invalid pallet quantity');
    expect(() => new PalletQuantity(-1, 0)).toThrow('cannot be negative');
  });
});
