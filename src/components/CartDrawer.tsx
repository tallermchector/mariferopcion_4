// ./src/components/CartDrawer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Truck, Sparkles, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartControl from './CartControl';
import { formatPriceUYU, calculateInstallmentsUYU } from '@/lib/format';

export function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    totalItems,
    subtotal,
    shipping,
    freeShippingThreshold,
    total,
    clearCart,
  } = useCart();

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const installmentInfo = calculateInstallmentsUYU(total, 6);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#1A161D]/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="w-screen max-w-md bg-[#FAF9F7] shadow-2xl flex flex-col h-full border-l border-[rgba(26,22,29,0.08)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-white border-b border-[rgba(26,22,29,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAF9F7] border border-[rgba(26,22,29,0.08)] flex items-center justify-center text-[#C84B6B]">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#1A161D]">Bolsa de Compras</h2>
                    <p className="text-xs text-[#6B6368] font-body">
                      {totalItems} {totalItems === 1 ? 'prenda seleccionada' : 'prendas seleccionadas'}
                    </p>
                  </div>
                </div>

                <button
                  id="close-cart-drawer"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-[#6B6368] hover:bg-[#FAF9F7] hover:text-[#1A161D] transition-colors cursor-pointer"
                  aria-label="Cerrar carrito"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {items.length > 0 && (
                <div className="bg-white px-6 py-3 border-b border-[rgba(26,22,29,0.06)]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-[#1A161D] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#3D8B5A]" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-[#3D8B5A] font-bold">¡Tenés Envío Gratis en este pedido!</span>
                      ) : (
                        <span>
                          Faltan <strong className="font-mono-tabular text-[#1A161D]">{formatPriceUYU(remainingForFreeShipping)}</strong> para envío gratis
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] font-mono-tabular text-[#6B6368]">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#FAF9F7] h-1.5 rounded-full overflow-hidden border border-[rgba(26,22,29,0.06)]">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        remainingForFreeShipping === 0 ? 'bg-[#3D8B5A]' : 'bg-[#C84B6B]'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="h-16 w-16 rounded-full bg-white border border-[rgba(26,22,29,0.08)] flex items-center justify-center text-[#9A9196] mb-4 shadow-xs">
                      <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#1A161D]">Tu bolsa está vacía</h3>
                    <p className="text-xs text-[#6B6368] mt-1 max-w-xs font-body leading-relaxed">
                      Descubrí nuestros esenciales diarios diseñados con fibras naturales.
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C84B6B] text-white text-xs font-semibold hover:bg-[#B03D5C] transition-all cursor-pointer shadow-xs"
                    >
                      <span>Explorar Catálogo</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[rgba(26,22,29,0.06)]">
                    {items.map((item) => (
                      <CartControl key={item.product.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Resumen */}
              {items.length > 0 && (
                <div className="border-t border-[rgba(26,22,29,0.08)] px-6 py-5 bg-white space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#6B6368]">
                      <span>Subtotal</span>
                      <span className="font-mono-tabular font-bold text-[#1A161D]">
                        {formatPriceUYU(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#6B6368]">
                      <span>Envío</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="font-bold text-[#3D8B5A] bg-[#FAF9F7] px-2 py-0.5 rounded-full border border-[rgba(61,139,90,0.2)]">
                            Gratis a todo el país
                          </span>
                        ) : (
                          <span className="font-mono-tabular font-semibold text-[#1A161D]">
                            {formatPriceUYU(shipping)}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Installments Breakdown */}
                    <div className="pt-2 border-t border-[rgba(26,22,29,0.06)] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#6B6368]">
                        <CreditCard className="w-3.5 h-3.5 text-[#C84B6B]" />
                        <span>Hasta 6 cuotas de</span>
                      </div>
                      <span className="font-mono-tabular font-bold text-[#C84B6B]">
                        {installmentInfo.installmentText} sin recargo
                      </span>
                    </div>

                    <div className="border-t border-[rgba(26,22,29,0.08)] pt-2.5 flex justify-between text-base font-bold text-[#1A161D]">
                      <span className="font-display">Total</span>
                      <span className="font-mono-tabular text-lg text-[#1A161D]">
                        {formatPriceUYU(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#C84B6B] text-white text-xs font-semibold hover:bg-[#B03D5C] transition-all shadow-sm text-center cursor-pointer active:scale-[0.99]"
                    >
                      <span>Iniciar Compra</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={clearCart}
                      className="text-center text-[11px] text-[#9A9196] hover:text-[#6B6368] transition-colors py-1 cursor-pointer"
                    >
                      Vaciar bolsa
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;

