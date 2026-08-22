import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartDrawer } from '@/components/CartDrawer';
import { CartPageContent } from '@/components/CartPageContent';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton';
import { useCart } from '@/context/CartContext';
import { mockProduct1, mockProduct2, renderWithCart } from '../test-utils';

function DrawerOpener() {
  const { setIsOpen } = useCart();
  return <button onClick={() => setIsOpen(true)}>Open Drawer</button>;
}

describe('Tier 3: Cross-Feature Combinations & State Integration', () => {
  it('ProductCard quick-add adds item and triggers CartDrawer to open with item details', async () => {
    const user = userEvent.setup();
    renderWithCart(
      <div>
        <ProductCard product={mockProduct1} />
        <CartDrawer />
      </div>
    );

    const addBtn = screen.getByRole('button', { name: /agregar vestido lino lucía a la bolsa/i });
    await user.click(addBtn);

    // CartDrawer should now be visible and contain the product
    expect(screen.getByRole('dialog', { name: /tu bolsa/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tu bolsa' })).toBeInTheDocument();
    expect(screen.getByText(/prenda/i)).toBeInTheDocument();
    expect(screen.getAllByText('$ 3.890').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Tenés envío gratis en este pedido')).toBeInTheDocument();
  });

  it('PDP AddToCartButton adds multiple units and opens CartDrawer', async () => {
    const user = userEvent.setup();
    renderWithCart(
      <div>
        <AddToCartButton product={mockProduct2} />
        <CartDrawer />
      </div>
    );

    // Increase quantity to 2
    const plusBtn = screen.getByRole('button', { name: /sumar una unidad/i });
    await user.click(plusBtn);

    const addBtn = screen.getByRole('button', { name: /agregar a la bolsa/i });
    await user.click(addBtn);

    // Wait for the button timeout to open drawer
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /tu bolsa/i })).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(/prendas/i)).toBeInTheDocument();
    // 2490 * 2 = 4980
    expect(screen.getAllByText('$ 4.980').length).toBeGreaterThanOrEqual(1);
  });

  it('CartDrawer allows modifying item quantity, and decreasing to 0 removes item', async () => {
    const user = userEvent.setup();

    renderWithCart(
      <div>
        <DrawerOpener />
        <CartDrawer />
      </div>,
      {
        initialCart: [{ product: mockProduct2, quantity: 1 }],
      }
    );

    await user.click(screen.getByText('Open Drawer'));

    expect(screen.getByText('Blusa Seda Ana')).toBeInTheDocument();
    expect(screen.getByText(/prenda/i)).toBeInTheDocument();

    // Click decrease button to reduce to 0
    const decreaseBtn = screen.getByRole('button', { name: 'Quitar prenda' });
    await user.click(decreaseBtn);

    // Cart is now empty
    expect(screen.getByText('Tu bolsa está vacía')).toBeInTheDocument();
  });

  it('Promo code application in CartPageContent updates discount and installment calculation', async () => {
    const user = userEvent.setup();
    renderWithCart(<CartPageContent />, {
      initialCart: [{ product: mockProduct1, quantity: 1 }],
    });

    // Subtotal prendas should be visible
    expect(screen.getByText('Subtotal prendas')).toBeInTheDocument();

    const promoInput = screen.getByLabelText(/cupón de descuento/i);
    const applyBtn = screen.getByRole('button', { name: 'Aplicar' });

    // Invalid promo code
    await user.type(promoInput, 'INVALIDO');
    await user.click(applyBtn);

    expect(screen.getByRole('alert')).toHaveTextContent('Ese cupón no es válido. Probá con MARIFER10.');

    // Valid promo code
    await user.clear(promoInput);
    await user.type(promoInput, 'MARIFER10');
    await user.click(applyBtn);

    // 10% discount on 3890 = 389 -> finalTotal = 3890 - 389 = 3501
    expect(screen.getByText(/descuento \(10%\)/i)).toBeInTheDocument();
    expect(screen.getByText('-$ 389')).toBeInTheDocument();
    expect(screen.getByText('$ 3.501')).toBeInTheDocument();
  });
});
