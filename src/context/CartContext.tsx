// ./src/context/CartContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import type { ProductType } from '@/lib/types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/shipping';

const STORAGE_KEY = 'marifer_ecommerce_cart';

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  } catch (e) {
    console.error('Error loading initial cart:', e);
    return [];
  }
}

const subscribeNoop = () => () => {};

export interface CartItem {
  product: ProductType;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: ProductType, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  freeShippingThreshold: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [storedItems, setItems] = useState<CartItem[]>(readStoredCart);
  const [isOpen, setIsOpen] = useState(false);
  // Hasta que el cliente hidrata se expone el carrito vacío, igual que en el HTML del servidor,
  // para evitar mismatch de hidratación con el badge del Navbar.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const items = hydrated ? storedItems : [];

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [storedItems, hydrated]);

  const addItem = (product: ProductType, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock || 99) }];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const max = item.product.stock || 99;
          return { ...item, quantity: Math.min(quantity, max) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        freeShippingThreshold,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

