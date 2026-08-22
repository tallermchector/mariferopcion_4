import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { CartDrawer } from '@/components/CartDrawer';
import { CartControl } from '@/components/CartControl';
import { AddToCartButton } from '@/components/AddToCartButton';
import { CartPageContent } from '@/components/CartPageContent';
import { useCart } from '@/context/CartContext';
import { mockProduct1, mockProduct2, renderWithCart } from '../test-utils';

function OpenDrawerOnMount() {
  const { setIsOpen } = useCart();
  React.useEffect(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  return <CartDrawer />;
}

describe('Tier 4: Real-World Applications & Accessibility Scenarios', () => {
  describe('Full Shopping Journey Simulation', () => {
    it('executes a complete end-to-end checkout journey', async () => {
      const user = userEvent.setup();

      // Full app container simulating user session
      const App = () => {
        return (
          <div>
            <Navbar />
            <ProductCard product={mockProduct1} />
            <CartDrawer />
            <CartPageContent />
          </div>
        );
      };

      renderWithCart(<App />);

      // Step 1: User sees empty cart initially in page content
      expect(screen.getByText('Tu bolsa está vacía')).toBeInTheDocument();

      // Step 2: User adds product from ProductCard
      const addBtn = screen.getByRole('button', { name: /agregar vestido lino lucía a la bolsa/i });
      await user.click(addBtn);

      // Step 3: CartDrawer opens and displays product & free shipping
      expect(screen.getByRole('dialog', { name: /tu bolsa/i })).toBeInTheDocument();
      expect(screen.getByText('Tenés envío gratis en este pedido')).toBeInTheDocument();

      // Step 4: User applies promo code in CartPageContent
      const promoInput = screen.getByLabelText(/cupón de descuento/i);
      const applyPromoBtn = screen.getByRole('button', { name: 'Aplicar' });

      await user.type(promoInput, 'MARIFER10');
      await user.click(applyPromoBtn);

      expect(screen.getByText(/cupón MARIFER10 aplicado/i)).toBeInTheDocument();

      // Step 5: User clicks "Confirmar y pagar"
      const checkoutBtn = screen.getByRole('button', { name: /confirmar y pagar/i });
      await user.click(checkoutBtn);

      // Step 6: Shows order confirmation and generated tracking ID
      await waitFor(() => {
        expect(screen.getByText('Pedido confirmado')).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByText(/código de seguimiento:/i)).toBeInTheDocument();
      expect(screen.getByText(/MF-UY-/)).toBeInTheDocument();
    }, 15000);
  });

  describe('WCAG 2.2 Accessibility Audits (Axe)', () => {
    it('ProductCard passes axe a11y audit', async () => {
      const { container } = renderWithCart(<ProductCard product={mockProduct1} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('CartControl passes axe a11y audit', async () => {
      const { container } = renderWithCart(
        <CartControl item={{ product: mockProduct1, quantity: 2 }} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('AddToCartButton passes axe a11y audit', async () => {
      const { container } = renderWithCart(<AddToCartButton product={mockProduct1} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('CartDrawer passes axe a11y audit when open with items', async () => {
      const { container } = renderWithCart(<OpenDrawerOnMount />, {
        initialCart: [{ product: mockProduct1, quantity: 1 }],
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('CartPageContent passes axe a11y audit', async () => {
      const { container } = renderWithCart(<CartPageContent />, {
        initialCart: [{ product: mockProduct2, quantity: 1 }],
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Keyboard Navigation & Focus Management', () => {
    it('closes CartDrawer when Escape key is pressed', async () => {
      renderWithCart(<OpenDrawerOnMount />, {
        initialCart: [{ product: mockProduct1, quantity: 1 }],
      });

      expect(screen.getByRole('dialog', { name: /tu bolsa/i })).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /tu bolsa/i })).not.toBeInTheDocument();
      });
    });
  });
});
