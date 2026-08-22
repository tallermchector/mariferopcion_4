// ./src/components/CartPageContent.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, CheckCircle2, Tag, CreditCard, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartControl from './CartControl';
import { formatPriceUYU, calculateInstallmentsUYU } from '@/lib/format';

export function CartPageContent() {
  const { items, totalItems, subtotal, shipping, total, freeShippingThreshold, clearCart } = useCart();
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
    if (promoCode.trim().toUpperCase() === 'MARIFER10' || promoCode.trim().toUpperCase() === 'URUGUAY10' || promoCode.trim().toUpperCase() === 'DESCUENTO10') {
      setAppliedPromo(promoCode.trim().toUpperCase());
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
      <div className="py-16 text-center max-w-lg mx-auto space-y-6">
        <div className="h-20 w-20 rounded-full bg-[#EBF5EE] text-[#3D8B5A] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="font-display font-black text-3xl text-[#1A161D] tracking-tight">
          ¡Pedido Confirmado con Éxito!
        </h2>
        <p className="text-sm text-[#6B6368] font-body leading-relaxed">
          Muchas gracias por elegir Marifer. Estamos preparando tu paquete en nuestra boutique de Montevideo para despacho seguro.
        </p>
        <div className="p-5 bg-white border border-[rgba(26,22,29,0.08)] rounded-[20px] shadow-diffused text-xs text-[#6B6368] text-left space-y-2">
          <p><span className="font-bold text-[#1A161D]">Código de Seguimiento:</span> <span className="font-mono-tabular text-[#C84B6B]">{orderId}</span></p>
          <p><span className="font-bold text-[#1A161D]">Medio de Pago:</span> Tarjeta de Crédito (6 cuotas sin recargo)</p>
          <p><span className="font-bold text-[#1A161D]">Plazo Estimado:</span> 24 a 48 h hábiles en Montevideo / 72 h en Interior</p>
        </div>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A161D] text-white text-xs font-semibold hover:bg-[#C84B6B] transition-all shadow-md"
          >
            <span>Seguir Explorando la Colección</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-6">
        <div className="h-20 w-20 rounded-full bg-[#FAF9F7] border border-[rgba(26,22,29,0.08)] text-[#6B6368] flex items-center justify-center mx-auto">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-[#1A161D]">
            Tu bolsa está vacía
          </h2>
          <p className="text-xs text-[#6B6368] font-body mt-2">
            No has agregado ninguna prenda todavía. Descubrí nuestros vestidos de lino y prendas esenciales de temporada.
          </p>
        </div>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A161D] text-white text-xs font-semibold hover:bg-[#C84B6B] transition-all shadow-md"
          >
            <span>Ver Colección 2026</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      {/* Columna Izquierda: Lista de Productos */}
      <div className="lg:col-span-8 space-y-6">
        {/* Barra de progreso de envío gratis */}
        <div className="p-4 rounded-[20px] bg-white border border-[rgba(26,22,29,0.08)] shadow-diffused space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1A161D] flex items-center gap-1.5 font-body">
              <Truck className="h-4 w-4 text-[#C84B6B]" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  Sumá <strong className="text-[#C84B6B] font-mono-tabular">{formatPriceUYU(remainingForFreeShipping)}</strong> para obtener <strong className="text-[#3D8B5A]">Envío Gratis</strong>
                </span>
              ) : (
                <span className="text-[#3D8B5A] font-bold">¡Genial! Tenés Envío Gratis en todo Uruguay</span>
              )}
            </span>
            <span className="font-mono-tabular text-[#6B6368] font-semibold">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="h-2 w-full bg-[#FAF9F7] rounded-full overflow-hidden border border-[rgba(26,22,29,0.05)]">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressToFreeShipping >= 100 ? 'bg-[#3D8B5A]' : 'bg-[#C84B6B]'
              }`}
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Lista de Items */}
        <div className="rounded-[24px] bg-white border border-[rgba(26,22,29,0.08)] p-6 sm:p-8 shadow-diffused divide-y divide-[rgba(26,22,29,0.06)]">
          <div className="pb-4 flex justify-between items-center">
            <h2 className="text-base font-bold text-[#1A161D]">
              Prendas seleccionadas ({totalItems})
            </h2>
            <button
              onClick={clearCart}
              className="text-xs text-[#9A9196] hover:text-[#C84B6B] transition-colors cursor-pointer"
            >
              Vaciar bolsa
            </button>
          </div>

          <div className="divide-y divide-[rgba(26,22,29,0.06)]">
            {items.map((item) => (
              <CartControl key={item.product.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Desglose de Totales & Checkout */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-[24px] bg-white border border-[rgba(26,22,29,0.08)] p-6 shadow-diffused space-y-6 sticky top-24">
          <h2 className="text-base font-bold text-[#1A161D] border-b border-[rgba(26,22,29,0.06)] pb-3">
            Resumen de Compra
          </h2>

          {/* Formulario Cupón de Descuento */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B6368] flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#C84B6B]" />
              <span>Cupón de Descuento</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: MARIFER10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 rounded-full border border-[rgba(26,22,29,0.12)] px-4 py-2 text-xs uppercase placeholder:normal-case focus:border-[#C84B6B] focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#FAF9F7] border border-[rgba(26,22,29,0.12)] hover:bg-[#1A161D] hover:text-white text-xs font-semibold text-[#1A161D] transition-colors cursor-pointer"
              >
                Aplicar
              </button>
            </div>
            {appliedPromo && (
              <p className="text-[11px] text-[#3D8B5A] font-medium">
                ✓ Cupón &quot;{appliedPromo}&quot; aplicado (-10%)
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-[#C84B6B] font-medium">
                Cupón no válido. Probá con &quot;MARIFER10&quot;
              </p>
            )}
          </form>

          {/* Desglose de Precios */}
          <div className="space-y-3 text-xs border-t border-[rgba(26,22,29,0.06)] pt-4 font-body">
            <div className="flex justify-between text-[#6B6368]">
              <span>Subtotal prendas</span>
              <span className="font-mono-tabular font-bold text-[#1A161D]">{formatPriceUYU(subtotal)}</span>
            </div>

            {appliedPromo && (
              <div className="flex justify-between text-[#3D8B5A] font-medium">
                <span>Descuento aplicado (10%)</span>
                <span className="font-mono-tabular font-bold">-{formatPriceUYU(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-[#6B6368]">
              <span>Costo de envío en Uruguay</span>
              <span>
                {shipping === 0 ? (
                  <span className="font-bold text-[#3D8B5A]">Gratis</span>
                ) : (
                  <span className="font-mono-tabular font-bold text-[#1A161D]">{formatPriceUYU(shipping)}</span>
                )}
              </span>
            </div>

            <div className="flex justify-between text-[#6B6368]">
              <span>Impuestos (IVA 22% incluido)</span>
              <span className="font-mono-tabular text-[#9A9196]">$ 0</span>
            </div>

            <div className="border-t border-[rgba(26,22,29,0.08)] pt-4 space-y-1">
              <div className="flex justify-between items-baseline text-base font-bold text-[#1A161D]">
                <span>Total final</span>
                <span className="font-mono-tabular text-2xl text-[#1A161D]">{formatPriceUYU(finalTotal)}</span>
              </div>
              <p className="text-[11px] text-[#C84B6B] font-semibold text-right">
                O hasta 6 cuotas de {installmentInfo.installmentText} sin recargo
              </p>
            </div>
          </div>

          {/* Botón de Checkout con animación táctil */}
          <motion.button
            id="checkout-order-btn"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            whileTap={{ scale: 0.98, y: 1 }}
            className="w-full flex items-center justify-center gap-2 h-[52px] rounded-full bg-[#C84B6B] text-white text-xs font-bold hover:bg-[#B03D5C] transition-all shadow-sm cursor-pointer disabled:bg-neutral-300"
          >
            {isCheckingOut ? (
              <span>Procesando compra segura...</span>
            ) : (
              <>
                <span>Confirmar y Pagar</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>

          {/* Sellos de Seguridad & Tarjetas Uruguayas */}
          <div className="space-y-2 pt-2 border-t border-[rgba(26,22,29,0.06)] text-center">
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B6368]">
              <ShieldCheck className="h-4 w-4 text-[#3D8B5A]" />
              <span>Transacción cifrada y protegida</span>
            </div>
            <p className="text-[10px] text-[#9A9196]">
              Aceptamos OCA, Visa, MasterCard, Abitab y Redpagos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPageContent;

