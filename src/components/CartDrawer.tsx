// ./src/components/CartDrawer.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ShoppingBag, ArrowRight, Truck, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartControl from './CartControl';
import EmptyIllustration from "./EmptyIllustration";
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

  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Cerrar con Escape y llevar el foco al botón de cerrar al abrir
  useEffect(() => {
    if (!isOpen) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, setIsOpen]);

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
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#241230]/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-drawer-title"
              initial={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 260 }}
              className="w-screen max-w-md bg-[#fffcff] shadow-marifer-hover flex flex-col h-full border-l border-[#e8e3ec]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pl-6 pr-4 py-4 bg-white border-b border-[#e8e3ec]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f2e6f4] flex items-center justify-center text-[#452453]">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 id="cart-drawer-title" className="font-display text-base font-bold text-[#241230]">
                      Tu bolsa
                    </h2>
                    <p className="text-[13px] text-[#7d7384] font-body">
                      <span className="font-mono-tabular font-semibold">{totalItems}</span> {totalItems === 1 ? 'prenda' : 'prendas'}
                    </p>
                  </div>
                </div>

                <button
                  ref={closeButtonRef}
                  id="close-cart-drawer"
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[#7d7384] hover:bg-[#f2e6f4] hover:text-[#241230] transition-colors cursor-pointer"
                  aria-label="Cerrar bolsa"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Progreso hacia envío gratis */}
              {items.length > 0 && (
                <div className="bg-white px-6 py-3 border-b border-[#e8e3ec]">
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-medium text-[#241230] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#146043]" aria-hidden="true" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-[#146043] font-bold">Tenés envío gratis en este pedido</span>
                      ) : (
                        <span>
                          Te faltan{' '}
                          <strong className="font-mono-tabular text-[#241230]">
                            {formatPriceUYU(remainingForFreeShipping)}
                          </strong>{' '}
                          para envío gratis
                        </span>
                      )}
                    </span>
                    <span className="text-[12px] font-mono-tabular text-[#7d7384]">
                      {Math.round(freeShippingProgress)}%
                    </span>
                  </div>
                  <div
                    className="w-full bg-[#f2e6f4] h-1.5 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(freeShippingProgress)}
                    aria-label="Progreso hacia envío gratis"
                  >
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        remainingForFreeShipping === 0 ? 'bg-[#1f8a5f]' : 'bg-[#452453]'
                      }`}
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lista de prendas */}
              <div className="flex-1 overflow-y-auto px-6 py-2">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <EmptyIllustration className="mb-4 h-24 w-36" />
                    <h3 className="font-display text-lg font-bold text-[#241230]">Tu bolsa está vacía</h3>
                    <p className="text-[13px] text-[#7d7384] mt-1 max-w-xs font-body leading-relaxed">
                      Sumá prendas desde el catálogo y las vas a ver acá.
                    </p>
                    <Link
                      href="/products"
                      onClick={() => setIsOpen(false)}
                      className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#452453] text-white text-[13px] font-semibold hover:bg-[#241230] transition-colors cursor-pointer shadow-marifer-btn"
                    >
                      <span>Ver el catálogo</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#e8e3ec]">
                    {items.map((item) => (
                      <CartControl key={item.product.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Resumen */}
              {items.length > 0 && (
                <div className="border-t border-[#e8e3ec] px-6 py-5 bg-white space-y-4">
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between text-[#7d7384]">
                      <span>Subtotal</span>
                      <span className="font-mono-tabular font-bold text-[#241230]">
                        {formatPriceUYU(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#7d7384]">
                      <span>Envío</span>
                      {shipping === 0 ? (
                        <span className="font-bold text-[#146043] bg-[#f2e6f4] px-2 py-0.5 rounded-full text-[12px]">
                          Gratis a todo el país
                        </span>
                      ) : (
                        <span className="font-mono-tabular font-semibold text-[#241230]">
                          {formatPriceUYU(shipping)}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#e8e3ec] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#7d7384]">
                        <CreditCard className="w-3.5 h-3.5 text-[#452453]" aria-hidden="true" />
                        <span>6 cuotas sin recargo de</span>
                      </div>
                      <span className="font-mono-tabular font-bold text-[#452453]">
                        {installmentInfo.installmentText}
                      </span>
                    </div>

                    <div className="border-t border-[#e8e3ec] pt-2.5 flex justify-between text-base font-bold text-[#241230]">
                      <span className="font-display">Total</span>
                      <span className="font-mono-tabular text-lg">{formatPriceUYU(total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-1">
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-[#452453] text-white text-[14px] font-semibold hover:bg-[#241230] transition-colors shadow-marifer-btn cursor-pointer active:scale-[0.99]"
                    >
                      <span>Iniciar compra</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="h-11 text-center text-[12px] text-[#7d7384] hover:text-[#241230] transition-colors cursor-pointer rounded-full"
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
