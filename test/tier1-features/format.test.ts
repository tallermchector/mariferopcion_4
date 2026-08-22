import { describe, it, expect } from 'vitest';
import { formatPriceUYU, formatInstallments, calculateInstallmentsUYU } from '@/lib/format';

describe('Tier 1: format.ts Utilities', () => {
  describe('formatPriceUYU', () => {
    it('formats round prices in UYU currency format with dollar sign and period thousands separator', () => {
      expect(formatPriceUYU(1290)).toBe('$ 1.290');
      expect(formatPriceUYU(3490)).toBe('$ 3.490');
      expect(formatPriceUYU(125000)).toBe('$ 125.000');
    });

    it('formats 0 amount correctly', () => {
      expect(formatPriceUYU(0)).toBe('$ 0');
    });

    it('rounds decimal prices correctly', () => {
      expect(formatPriceUYU(1290.4)).toBe('$ 1.290');
      expect(formatPriceUYU(1290.6)).toBe('$ 1.291');
    });
  });

  describe('formatInstallments', () => {
    it('calculates 6 installments by default with standard text', () => {
      // 3490 / 6 = 581.666 -> 582
      expect(formatInstallments(3490)).toBe('6 cuotas sin recargo de $ 582');
    });

    it('supports custom number of installments', () => {
      // 1200 / 3 = 400
      expect(formatInstallments(1200, 3)).toBe('3 cuotas sin recargo de $ 400');
    });
  });

  describe('calculateInstallmentsUYU', () => {
    it('returns structured breakdown object for installments', () => {
      const result = calculateInstallmentsUYU(3490, 6);
      expect(result).toEqual({
        cuotas: 6,
        installmentAmount: 582,
        installmentText: '$ 582',
        fullText: '6 cuotas sin recargo de $ 582',
      });
    });

    it('handles 0 total correctly', () => {
      const result = calculateInstallmentsUYU(0, 6);
      expect(result).toEqual({
        cuotas: 6,
        installmentAmount: 0,
        installmentText: '$ 0',
        fullText: '6 cuotas sin recargo de $ 0',
      });
    });
  });
});
