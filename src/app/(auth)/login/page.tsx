// ./src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('cliente@next-ecommerce.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl border border-neutral-200/80 p-8 shadow-xl space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-neutral-500">
            Accede para gestionar tus pedidos y guardar tus artículos favoritos.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">¡Sesión Iniciada!</h3>
            <p className="text-xs text-neutral-500">Redirigiendo a la tienda...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-neutral-700">
                  Contraseña
                </label>
                <a href="#" className="text-[11px] text-indigo-600 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-md cursor-pointer disabled:bg-neutral-400 mt-2"
            >
              {loading ? (
                <span>Verificando credenciales...</span>
              ) : (
                <>
                  <span>Ingresar a mi Cuenta</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            ¿Aún no tienes una cuenta?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
              Crear cuenta nueva
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
