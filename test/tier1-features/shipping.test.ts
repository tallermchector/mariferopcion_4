import { describe, it, expect } from 'vitest';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/shipping';

describe('Tier 1: shipping.ts Constants & Contracts', () => {
  it('defines the canonical FREE_SHIPPING_THRESHOLD as 3500 UYU', () => {
    expect(FREE_SHIPPING_THRESHOLD).toBe(3500);
  });

  it('defines the canonical SHIPPING_COST as 220 UYU', () => {
    expect(SHIPPING_COST).toBe(220);
  });
});
