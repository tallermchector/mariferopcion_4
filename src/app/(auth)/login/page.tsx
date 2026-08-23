// ./src/app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';

type FieldErrors = { email?: string; password?: string };

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = 'Escribí tu correo electrónico.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ese correo no parece válido. Revisalo, por ejemplo: nombre@correo.com';
  if (!password) errors.password = 'Escribí tu contraseña.';
  else if (password.length < 8) errors.password = 'La contraseña tiene al menos 8 caracteres.';
  return errors;
}

const inputClass =
  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]';

export default function LoginPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const runValidation = (nextEmail = email, nextPassword = password) => {
    const next = validate(nextEmail, nextPassword);
    setErrors(next);
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const next = runValidation();
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ email: data.error || 'Credenciales inválidas.' });
        setLoading(false);
        return;
      }
      setLoading(false);
      setSuccess(true);
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || (data.user?.role === 'ADMIN' ? '/admin' : '/');
      setTimeout(() => {
        router.push(redirect);
        router.refresh();
      }, 800);
    } catch {
      setErrors({ email: 'Hubo un problema de conexión. Intentalo de nuevo.' });
      setLoading(false);
    }
  };

  const showEmailError = touched.email && errors.email;
  const showPasswordError = touched.password && errors.password;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.4 }}
        className="w-full max-w-md bg-white rounded-[28px] border border-[#e8e3ec] p-8 shadow-marifer-hover space-y-6"
      >
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group mx-auto">
            <div className="relative h-11 w-32 mx-auto transition-transform group-hover:scale-105 duration-200">
              <Image
                src="/logo_marifer_1.png"
                alt="MARIFER"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="font-display text-2xl font-extrabold text-[#241230] tracking-tight">
            Iniciá sesión
          </h1>
          <p className="text-[14px] text-[#7d7384]">
            Seguí tus pedidos y guardá tus prendas favoritas.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3" role="status">
            <div className="h-12 w-12 rounded-full bg-[#f2e6f4] text-[#146043] flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-base font-bold text-[#241230]">Sesión iniciada</h2>
            <p className="text-[14px] text-[#7d7384]">Te llevamos a la tienda…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-[13px] font-semibold text-[#241230] block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-[#7d7384] absolute left-4 top-4" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) runValidation(e.target.value, password);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, email: true }));
                    runValidation();
                  }}
                  placeholder="nombre@correo.com"
                  aria-invalid={showEmailError ? true : undefined}
                  aria-describedby={showEmailError ? 'login-email-error' : undefined}
                  className={inputClass}
                />
              </div>
              {showEmailError && (
                <p id="login-email-error" role="alert" className="text-[13px] text-[#c23b64] font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="login-password" className="text-[13px] font-semibold text-[#241230]">
                  Contraseña
                </label>
                <Link href="#" className="text-[13px] text-[#452453] hover:underline">
                  ¿La olvidaste?
                </Link>
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-[#7d7384] absolute left-4 top-4" aria-hidden="true" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) runValidation(email, e.target.value);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, password: true }));
                    runValidation();
                  }}
                  placeholder="••••••••"
                  aria-invalid={showPasswordError ? true : undefined}
                  aria-describedby={showPasswordError ? 'login-password-error' : undefined}
                  className={inputClass}
                />
              </div>
              {showPasswordError && (
                <p id="login-password-error" role="alert" className="text-[13px] text-[#c23b64] font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-[#452453] text-white text-[15px] font-bold hover:bg-[#241230] transition-colors shadow-marifer-btn cursor-pointer disabled:bg-[#f2e6f4] disabled:text-[#7d7384] disabled:shadow-none disabled:cursor-wait mt-2"
            >
              {loading ? (
                <span>Verificando…</span>
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#e8e3ec]">
          <p className="text-[14px] text-[#7d7384]">
            ¿Todavía no tenés cuenta?{' '}
            <Link href="/register" className="font-semibold text-[#452453] hover:underline">
              Creá una
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
