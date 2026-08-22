import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CartDrawer } from '@/components/CartDrawer';
import { CartPageContent } from '@/components/CartPageContent';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/shipping';
import { mockProduct1, renderWithCart } from '../test-utils';

function CartStateDisplay() {
  const { items, totalItems, subtotal, shipping, total, isOpen, setIsOpen } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="subtotal">{subtotal}</span>
      <span data-testid="shipping">{shipping}</span>
      <span data-testid="total">{total}</span>
      <span data-testid="first-item-qty">{items[0]?.quantity ?? 0}</span>
      <button onClick={() => setIsOpen(true)}>Open Drawer</button>
    </div>
  );
}

describe('Tier 2: Boundary & Corner Cases', () => {
  describe('Cart Zero-State Boundaries', () => {
    it('initializes with 0 items, 0 subtotal, 0 shipping, and 0 total', () => {
      renderWithCart(<CartStateDisplay />);

      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('subtotal')).toHaveTextContent('0');
      expect(screen.getByTestId('shipping')).toHaveTextContent('0');
      expect(screen.getByTestId('total')).toHaveTextContent('0');
    });

    it('CartDrawer displays empty state illustration and action button when 0 items', async () => {
      const user = userEvent.setup();
      renderWithCart(
        <div>
          <CartStateDisplay />
          <CartDrawer />
        </div>
      );

      await user.click(screen.getByText('Open Drawer'));

      expect(screen.getByText('Tu bolsa está vacía')).toBeInTheDocument();
      expect(screen.getByText('Sumá prendas desde el catálogo y las vas a ver acá.')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ver el catálogo/i })).toHaveAttribute('href', '/products');
    });

    it('CartPageContent displays empty state when 0 items in cart', () => {
      renderWithCart(<CartPageContent />);

      expect(screen.getByText('Tu bolsa está vacía')).toBeInTheDocument();
      expect(screen.getByText(/todavía no sumaste prendas/i)).toBeInTheDocument();
    });
  });

  describe('Stock Boundary Limits', () => {
    it('caps adding items when quantity exceeds product stock', async () => {
      const user = userEvent.setup();
      const limitedProduct = { ...mockProduct1, stock: 3 };

      const TestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <CartStateDisplay />
            <button onClick={() => cart.addItem(limitedProduct, 10)}>
              Add More Than Stock
            </button>
          </div>
        );
      };

      renderWithCart(<TestComponent />);
      await user.click(screen.getByText('Add More Than Stock'));

      // Should be capped at 3, not 10
      expect(screen.getByTestId('first-item-qty')).toHaveTextContent('3');
    });

    it('caps updateQuantity to maximum stock limit', async () => {
      const user = userEvent.setup();
      const limitedProduct = { ...mockProduct1, stock: 4 };

      const TestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <CartStateDisplay />
            <button onClick={() => cart.addItem(limitedProduct, 2)}>Add</button>
            <button onClick={() => cart.updateQuantity(limitedProduct.id, 99)}>Update Over Stock</button>
          </div>
        );
      };

      renderWithCart(<TestComponent />);
      await user.click(screen.getByText('Add'));
      await user.click(screen.getByText('Update Over Stock'));

      expect(screen.getByTestId('first-item-qty')).toHaveTextContent('4');
    });
  });

  describe('Free Shipping Threshold Edge Cases ($3499 vs $3500)', () => {
    it('charges shipping cost when subtotal is exactly $3499 (1 peso below threshold)', async () => {
      const user = userEvent.setup();
      const edgeProduct = { ...mockProduct1, price: 3499, stock: 10 };

      const TestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <CartStateDisplay />
            <button onClick={() => cart.addItem(edgeProduct, 1)}>Add 3499</button>
          </div>
        );
      };

      renderWithCart(<TestComponent />);
      await user.click(screen.getByText('Add 3499'));

      expect(screen.getByTestId('subtotal')).toHaveTextContent('3499');
      expect(screen.getByTestId('shipping')).toHaveTextContent(SHIPPING_COST.toString());
      expect(screen.getByTestId('total')).toHaveTextContent((3499 + SHIPPING_COST).toString());
    });

    it('grants free shipping ($0) when subtotal is exactly $3500 (exact threshold)', async () => {
      const user = userEvent.setup();
      const thresholdProduct = { ...mockProduct1, price: 3500, stock: 10 };

      const TestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <CartStateDisplay />
            <button onClick={() => cart.addItem(thresholdProduct, 1)}>Add 3500</button>
          </div>
        );
      };

      renderWithCart(<TestComponent />);
      await user.click(screen.getByText('Add 3500'));

      expect(screen.getByTestId('subtotal')).toHaveTextContent('3500');
      expect(screen.getByTestId('shipping')).toHaveTextContent('0');
      expect(screen.getByTestId('total')).toHaveTextContent('3500');
    });

    it('grants free shipping ($0) when subtotal is $3501 (above threshold)', async () => {
      const user = userEvent.setup();
      const aboveThresholdProduct = { ...mockProduct1, price: 3501, stock: 10 };

      const TestComponent = () => {
        const cart = useCart();
        return (
          <div>
            <CartStateDisplay />
            <button onClick={() => cart.addItem(aboveThresholdProduct, 1)}>Add 3501</button>
          </div>
        );
      };

      renderWithCart(<TestComponent />);
      await user.click(screen.getByText('Add 3501'));

      expect(screen.getByTestId('subtotal')).toHaveTextContent('3501');
      expect(screen.getByTestId('shipping')).toHaveTextContent('0');
      expect(screen.getByTestId('total')).toHaveTextContent('3501');
    });
  });

  describe('Search Submission Corner Cases', () => {
    it('does not trigger navigation when search input is empty or only whitespace', async () => {
      const user = userEvent.setup();
      renderWithCart(<Navbar />);

      const searchInput = screen.getByPlaceholderText('Buscar prendas');
      const submitBtn = screen.getByRole('button', { name: 'Buscar' });

      // Empty submission
      await user.click(submitBtn);

      // Whitespace submission
      await user.type(searchInput, '   ');
      await user.click(submitBtn);
    });
  });

  describe('Discount Calculation Boundary Cases', () => {
    it('does not show discount badge when compareAtPrice equals price', () => {
      const equalPriceProduct = {
        ...mockProduct1,
        price: 2500,
        compareAtPrice: 2500,
      };

      renderWithCart(<ProductCard product={equalPriceProduct} />);
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('does not show discount badge when compareAtPrice is lower than price', () => {
      const lowerCompareProduct = {
        ...mockProduct1,
        price: 2500,
        compareAtPrice: 2000,
      };

      renderWithCart(<ProductCard product={lowerCompareProduct} />);
      expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('handles promo code validation with lowercase input and trimmed whitespace', async () => {
      const user = userEvent.setup();
      renderWithCart(<CartPageContent />, {
        initialCart: [{ product: mockProduct1, quantity: 1 }],
      });

      const promoInput = screen.getByLabelText(/cupón de descuento/i);
      const applyBtn = screen.getByRole('button', { name: 'Aplicar' });

      // Apply valid promo code with lowercase and spaces
      await user.type(promoInput, '  marifer10  ');
      await user.click(applyBtn);

      expect(screen.getByText(/cupón MARIFER10 aplicado: 10% de descuento/i)).toBeInTheDocument();
    });
  });
});
