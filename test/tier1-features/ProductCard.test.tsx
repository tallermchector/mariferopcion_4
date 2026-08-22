import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { mockProduct1, mockProduct2, mockOutOfStockProduct, renderWithCart } from '../test-utils';

describe('Tier 1: ProductCard Component', () => {
  it('renders product information, formatted prices, and category label', () => {
    renderWithCart(<ProductCard product={mockProduct1} />);

    expect(screen.getByText('Vestido Lino Lucía')).toBeInTheDocument();
    expect(screen.getByText('$ 3.890')).toBeInTheDocument();
    expect(screen.getByText('Vestidos')).toBeInTheDocument();
  });

  it('renders discount badge when compareAtPrice is higher than price', () => {
    renderWithCart(<ProductCard product={mockProduct1} />);

    // ((4890 - 3890) / 4890) * 100 = 20.44% -> -20%
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('$ 4.890')).toBeInTheDocument();
  });

  it('renders free shipping badge for product >= $3500 when no discount is active', () => {
    const freeShippingProd = {
      ...mockProduct2,
      price: 3600,
    };
    renderWithCart(<ProductCard product={freeShippingProd} />);

    expect(screen.getByText('Envío gratis')).toBeInTheDocument();
  });

  it('disables add to cart button when stock is 0', () => {
    renderWithCart(<ProductCard product={mockOutOfStockProduct} />);

    const btn = screen.getByRole('button', { name: /agregar falda agotada/i });
    expect(btn).toBeDisabled();
  });

  it('adds product to cart when button is clicked and shows confirmation', async () => {
    const user = userEvent.setup();
    renderWithCart(<ProductCard product={mockProduct2} />);

    const btn = screen.getByRole('button', { name: /agregar blusa seda ana/i });
    expect(btn).toBeEnabled();
    expect(screen.getByText('Sumar')).toBeInTheDocument();

    await user.click(btn);

    expect(screen.getByText('Listo')).toBeInTheDocument();
  });
});
