// ./src/app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Lock, Mail, User, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
            Crear Cuenta
          </h1>
          <p className="text-xs text-neutral-500">
            Únete y disfruta de descuentos exclusivos y seguimiento de envíos.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">¡Cuenta Creada con Éxito!</h3>
            <p className="text-xs text-neutral-500">Iniciando sesión automáticamente...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lucas Pulliese"
                  className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </div>

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
                  placeholder="lucas@ejemplo.com"
                  className="w-full rounded-xl border border-neutral-200 pl-10 pr-4 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-neutral-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
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
                <span>Creando cuenta...</span>
              ) : (
                <>
                  <span>Registrarme</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
