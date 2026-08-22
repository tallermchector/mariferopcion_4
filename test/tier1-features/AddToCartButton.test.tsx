import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AddToCartButton } from '@/components/AddToCartButton';
import { mockProduct1, mockOutOfStockProduct, renderWithCart } from '../test-utils';

describe('Tier 1: AddToCartButton Component', () => {
  it('renders quantity selector initialized to 1', () => {
    renderWithCart(<AddToCartButton product={mockProduct1} />);

    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar a la bolsa/i })).toBeEnabled();
  });

  it('allows increasing and decreasing quantity within stock bounds', async () => {
    const user = userEvent.setup();
    renderWithCart(<AddToCartButton product={{ ...mockProduct1, stock: 3 }} />);

    const minusBtn = screen.getByRole('button', { name: /restar una unidad/i });
    const plusBtn = screen.getByRole('button', { name: /sumar una unidad/i });

    // Initial 1: minus should be disabled
    expect(minusBtn).toBeDisabled();

    // Increment to 2
    await user.click(plusBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(minusBtn).toBeEnabled();

    // Increment to 3 (max stock)
    await user.click(plusBtn);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(plusBtn).toBeDisabled();

    // Decrement back to 2
    await user.click(minusBtn);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(plusBtn).toBeEnabled();
  });

  it('disables add button when product is out of stock', () => {
    renderWithCart(<AddToCartButton product={mockOutOfStockProduct} />);

    const btn = screen.getByRole('button', { name: /prenda agotada/i });
    expect(btn).toBeDisabled();
  });

  it('clicking add button triggers confirmation state', async () => {
    const user = userEvent.setup();
    renderWithCart(<AddToCartButton product={mockProduct1} />);

    const addBtn = screen.getByRole('button', { name: /agregar a la bolsa/i });
    await user.click(addBtn);

    expect(screen.getByText('Agregado a tu bolsa')).toBeInTheDocument();
  });
});
