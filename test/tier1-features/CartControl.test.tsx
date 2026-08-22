import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartControl } from '@/components/CartControl';
import { mockProduct1, renderWithCart } from '../test-utils';

describe('Tier 1: CartControl Component', () => {
  it('renders item details, unit price, and subtotal', () => {
    const item = { product: mockProduct1, quantity: 2 };
    renderWithCart(<CartControl item={item} />);

    expect(screen.getByText('Vestido Lino Lucía')).toBeInTheDocument();
    expect(screen.getByText('$ 3.890 c/u')).toBeInTheDocument();
    // 3890 * 2 = 7780
    expect(screen.getByText('$ 7.780')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders stepper controls with 44px min tap targets and trash button', () => {
    const item = { product: mockProduct1, quantity: 1 };
    renderWithCart(<CartControl item={item} />);

    expect(screen.getByRole('button', { name: /quitar prenda/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sumar una unidad/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /quitar vestido lino lucía/i })).toBeInTheDocument();
  });

  it('disables increase button when quantity reaches product stock', () => {
    const item = { product: { ...mockProduct1, stock: 2 }, quantity: 2 };
    renderWithCart(<CartControl item={item} />);

    const plusBtn = screen.getByRole('button', { name: /sumar una unidad/i });
    expect(plusBtn).toBeDisabled();
  });
});
