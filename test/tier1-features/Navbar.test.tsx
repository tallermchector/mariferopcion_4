import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { mockProduct1, renderWithCart } from '../test-utils';

describe('Tier 1: Navbar Component', () => {
  it('renders brand logo linking to home', () => {
    renderWithCart(<Navbar />);

    const logo = screen.getByRole('link', { name: /marifer, ir al inicio/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('href', '/');
  });

  it('renders desktop navigation links', () => {
    renderWithCart(<Navbar />);

    expect(screen.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Novedades' })).toHaveAttribute('href', '/products?sort=newest');
    expect(screen.getByRole('link', { name: 'Rebajas' })).toHaveAttribute('href', '/products?sort=sale');
  });

  it('renders announce bar with free shipping threshold', () => {
    renderWithCart(<Navbar />);

    expect(screen.getByText(/envío gratis en compras desde \$ 3\.500/i)).toBeInTheDocument();
  });

  it('renders search input and account link', () => {
    renderWithCart(<Navbar />);

    expect(screen.getByPlaceholderText('Buscar prendas')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /mi cuenta/i })).toHaveAttribute('href', '/login');
  });

  it('shows badge with item count when cart has items', () => {
    renderWithCart(<Navbar />, {
      initialCart: [{ product: mockProduct1, quantity: 3 }],
    });

    const cartBtn = screen.getByRole('button', { name: /abrir bolsa, 3 prendas/i });
    expect(cartBtn).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('toggles mobile menu on mobile button click', async () => {
    const user = userEvent.setup();
    renderWithCart(<Navbar />);

    const menuToggle = screen.getByRole('button', { name: /abrir menú/i });
    expect(menuToggle).toBeInTheDocument();

    await user.click(menuToggle);
    expect(screen.getByRole('button', { name: /cerrar menú/i })).toBeInTheDocument();
  });
});
