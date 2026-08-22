// ./src/components/CartPageContent.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, CheckCircle2, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartControl from './CartControl';
import { formatPriceUYU, calculateInstallmentsUYU } from '@/lib/format';

const VALID_PROMOS = ['MARIFER10', 'URUGUAY10', 'DESCUENTO10'];

export function CartPageContent() {
  const { items, totalItems, subtotal, shipping, total, freeShippingThreshold, clearCart } = useCart();
  const reduceMotion = useReducedMotion();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (VALID_PROMOS.includes(code)) {
      setAppliedPromo(code);
      setPromoError(false);
    } else {
      setPromoError(true);
    }
  };

  const discountAmount = appliedPromo ? subtotal * 0.1 : 0;
  const finalTotal = Math.max(0, total - discountAmount);
  const installmentInfo = calculateInstallmentsUYU(finalTotal, 6);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    const newOrderId = `MF-UY-${Date.now().toString(36).toUpperCase()}`;
    setTimeout(() => {
      setOrderId(newOrderId);
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto space-y-6" role="status">
        <div className="h-20 w-20 rounded-full bg-[#f2e6f4] text-[#146043] flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
        </div>
        <h2 className="font-display font-black text-3xl text-[#241230] tracking-tight">
          Pedido confirmado
        </h2>
        <p className="text-[15px] text-[#403945] font-body leading-relaxed">
          Gracias por elegir Marifer. Estamos preparando tu paquete en Montevideo.
        </p>
        <dl className="p-5 bg-white border border-[#e8e3ec] rounded-[20px] shadow-marifer-sm text-[14px] text-[#403945] text-left space-y-2">
          <div className="flex gap-2">
            <dt className="font-bold text-[#241230]">Código de seguimiento:</dt>
            <dd className="font-mono-tabular text-[#452453]">{orderId}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold text-[#241230]">Medio de pago:</dt>
            <dd>Tarjeta de crédito (6 cuotas sin recargo)</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold text-[#241230]">Plazo estimado:</dt>
            <dd>24 a 48 h hábiles en Montevideo · 72 h en Interior</dd>
          </div>
        </dl>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#452453] text-white text-[14px] font-semibold hover:bg-[#241230] transition-colors shadow-marifer-btn"
          >
            <span>Seguir viendo el catálogo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6">
        <div className="h-20 w-20 rounded-full bg-[#f2e6f4] text-[#452453] flex items-center justify-center mx-auto">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-[#241230]">
            Tu bolsa está vacía
          </h2>
          <p className="text-[15px] text-[#403945] font-body mt-2">
            Todavía no sumaste prendas. Empezá por los vestidos de lino o los esenciales de temporada.
          </p>
        </div>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#452453] text-white text-[14px] font-semibold hover:bg-[#241230] transition-colors shadow-marifer-btn"
          >
            <span>Ver el catálogo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {/* Lista de prendas */}
      <div className="lg:col-span-8 space-y-6">
        <div className="p-4 rounded-[20px] bg-white border border-[#e8e3ec] shadow-marifer-sm space-y-2">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-[#241230] flex items-center gap-1.5 font-body">
              <Truck className="h-4 w-4 text-[#452453]" aria-hidden="true" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Sumá <strong className="text-[#452453] font-mono-tabular">{formatPriceUYU(remainingForFreeShipping)}</strong> más y el envío es gratis
                </span>
              ) : (
                <span className="text-[#146043] font-bold">Tenés envío gratis a todo Uruguay</span>
              )}
            </span>
            <span className="font-mono-tabular text-[#7d7384] font-semibold">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div
            className="h-2 w-full bg-[#f2e6f4] rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progressToFreeShipping)}
            aria-label="Progreso hacia envío gratis"
          >
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressToFreeShipping >= 100 ? 'bg-[#1f8a5f]' : 'bg-[#452453]'
              }`}
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        <div className="rounded-[24px] bg-white border border-[#e8e3ec] p-6 sm:p-8 shadow-marifer-sm">
          <div className="pb-4 flex justify-between items-center border-b border-[#e8e3ec]">
            <h2 className="font-display text-base font-bold text-[#241230]">
              Prendas seleccionadas ({totalItems})
            </h2>
            <button
              type="button"
              onClick={clearCart}
              className="h-11 px-3 -mr-3 rounded-full text-[13px] text-[#7d7384] hover:text-[#c23b64] transition-colors cursor-pointer"
            >
              Vaciar bolsa
            </button>
          </div>

          <div className="divide-y divide-[#e8e3ec]">
            {items.map((item) => (
              <CartControl key={item.product.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-[24px] bg-white border border-[#e8e3ec] p-6 shadow-marifer-sm space-y-6 sticky top-24">
          <h2 className="font-display text-base font-bold text-[#241230] border-b border-[#e8e3ec] pb-3">
            Resumen de compra
          </h2>

          {/* Cupón */}
          <form onSubmit={handleApplyPromo} className="space-y-2" noValidate>
            <label htmlFor="promo-code" className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#7d7384] flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#452453]" aria-hidden="true" />
              <span>Cupón de descuento</span>
            </label>
            <div className="flex gap-2">
              <input
                id="promo-code"
                type="text"
                placeholder="Ej: MARIFER10"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  if (promoError) setPromoError(false);
                }}
                aria-invalid={promoError ? true : undefined}
                aria-describedby={promoError ? 'promo-error' : appliedPromo ? 'promo-ok' : undefined}
                className="flex-1 min-w-0 h-11 rounded-full border border-[#d3ccd8] px-4 text-[14px] uppercase placeholder:normal-case placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#452453]/25 aria-[invalid=true]:border-[#c23b64]"
              />
              <button
                type="submit"
                className="h-11 px-5 rounded-full bg-[#f2e6f4] border border-[#e3cde8] hover:bg-[#452453] hover:text-white hover:border-[#452453] text-[13px] font-semibold text-[#241230] transition-colors cursor-pointer"
              >
                Aplicar
              </button>
            </div>
            {appliedPromo && (
              <p id="promo-ok" role="status" className="text-[13px] text-[#146043] font-medium">
                Cupón {appliedPromo} aplicado: 10% de descuento
              </p>
            )}
            {promoError && (
              <p id="promo-error" role="alert" className="text-[13px] text-[#c23b64] font-medium">
                Ese cupón no es válido. Probá con MARIFER10.
              </p>
            )}
          </form>

          {/* Desglose */}
          <div className="space-y-3 text-[13px] border-t border-[#e8e3ec] pt-4 font-body">
            <div className="flex justify-between text-[#7d7384]">
              <span>Subtotal prendas</span>
              <span className="font-mono-tabular font-bold text-[#241230]">{formatPriceUYU(subtotal)}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-[#146043] font-medium">
                <span>Descuento (10%)</span>
                <span className="font-mono-tabular font-bold">-{formatPriceUYU(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#7d7384]">
              <span>Envío en Uruguay</span>
              {shipping === 0 ? (
                <span className="font-bold text-[#146043]">Gratis</span>
              ) : (
                <span className="font-mono-tabular font-bold text-[#241230]">{formatPriceUYU(shipping)}</span>
              )}
            </div>

            <div className="flex justify-between text-[#7d7384]">
              <span>IVA 22%</span>
              <span>Incluido</span>
            </div>

            <div className="border-t border-[#e8e3ec] pt-4 space-y-1">
              <div className="flex justify-between items-baseline text-base font-bold text-[#241230]">
                <span className="font-display">Total</span>
                <span className="font-mono-tabular text-2xl">{formatPriceUYU(finalTotal)}</span>
              </div>
              <p className="text-[12px] text-[#452453] font-semibold text-right">
                O 6 cuotas sin recargo de {installmentInfo.installmentText}
              </p>
            </div>
          </div>

          <motion.button
            id="checkout-order-btn"
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            whileTap={reduceMotion ? undefined : { scale: 0.98, y: 1 }}
            className="w-full flex items-center justify-center gap-2 h-[52px] rounded-full bg-[#452453] text-white text-[15px] font-bold hover:bg-[#241230] transition-colors shadow-marifer-btn cursor-pointer disabled:bg-[#f2e6f4] disabled:text-[#7d7384] disabled:shadow-none disabled:cursor-wait"
          >
            {isCheckingOut ? (
              <span>Procesando tu compra…</span>
            ) : (
              <>
                <span>Confirmar y pagar</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </motion.button>

          <div className="space-y-2 pt-2 border-t border-[#e8e3ec] text-center">
            <div className="flex items-center justify-center gap-2 text-[12px] text-[#7d7384]">
              <ShieldCheck className="h-4 w-4 text-[#146043]" aria-hidden="true" />
              <span>Pago cifrado y protegido</span>
            </div>
            <p className="text-[12px] text-[#7d7384]">
              Aceptamos OCA, Visa, MasterCard, Abitab y Redpagos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPageContent;
