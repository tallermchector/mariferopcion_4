import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Lock, Mail, User, CheckCircle2 } from 'lucide-react';

type FieldErrors = { name?: string; email?: string; password?: string };

function validate(name: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = 'Escribí tu nombre.';
  if (!email.trim()) errors.email = 'Escribí tu correo electrónico.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ese correo no parece válido. Revisalo, por ejemplo: nombre@correo.com';
  if (!password) errors.password = 'Elegí una contraseña.';
  else if (password.length < 8) errors.password = 'Usá al menos 8 caracteres.';
  return errors;
}

const inputClass =
  'w-full h-12 rounded-full border border-[#d3ccd8] bg-white pl-11 pr-4 text-[15px] text-[#241230] placeholder:text-[#7d7384] focus:outline-none focus:border-[#452453] focus:ring-2 focus:ring-[#caa8d3] focus:ring-offset-2 transition-shadow aria-[invalid=true]:border-[#c23b64]';

export default function RegisterPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const runValidation = (n = name, e = email, p = password) => {
    const next = validate(n, e, p);
    setErrors(next);
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    const next = runValidation();
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push('/'), 1000);
    }, 1200);
  };

  const fieldError = (key: keyof FieldErrors) => (touched[key] ? errors[key] : undefined);

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
            Creá tu cuenta
          </h1>
          <p className="text-[14px] text-[#7d7384]">
            Descuentos para clientas y seguimiento de tus envíos.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3" role="status">
            <div className="h-12 w-12 rounded-full bg-[#f2e6f4] text-[#146043] flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="font-display text-base font-bold text-[#241230]">Cuenta creada</h2>
            <p className="text-[14px] text-[#7d7384]">Iniciando sesión…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-[13px] font-semibold text-[#241230] block">
                Nombre
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-[#7d7384] absolute left-4 top-4" aria-hidden="true" />
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (touched.name) runValidation(e.target.value, email, password);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, name: true }));
                    runValidation();
                  }}
                  placeholder="Mariana Silva"
                  aria-invalid={fieldError('name') ? true : undefined}
                  aria-describedby={fieldError('name') ? 'register-name-error' : undefined}
                  className={inputClass}
                />
              </div>
              {fieldError('name') && (
                <p id="register-name-error" role="alert" className="text-[13px] text-[#c23b64] font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-[13px] font-semibold text-[#241230] block">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-[#7d7384] absolute left-4 top-4" aria-hidden="true" />
                <input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) runValidation(name, e.target.value, password);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, email: true }));
                    runValidation();
                  }}
                  placeholder="nombre@correo.com"
                  aria-invalid={fieldError('email') ? true : undefined}
                  aria-describedby={fieldError('email') ? 'register-email-error' : undefined}
                  className={inputClass}
                />
              </div>
              {fieldError('email') && (
                <p id="register-email-error" role="alert" className="text-[13px] text-[#c23b64] font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-[13px] font-semibold text-[#241230] block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-[#7d7384] absolute left-4 top-4" aria-hidden="true" />
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) runValidation(name, email, e.target.value);
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, password: true }));
                    runValidation();
                  }}
                  placeholder="Mínimo 8 caracteres"
                  aria-invalid={fieldError('password') ? true : undefined}
                  aria-describedby={fieldError('password') ? 'register-password-error' : 'register-password-help'}
                  className={inputClass}
                />
              </div>
              {fieldError('password') ? (
                <p id="register-password-error" role="alert" className="text-[13px] text-[#c23b64] font-medium">
                  {errors.password}
                </p>
              ) : (
                <p id="register-password-help" className="text-[13px] text-[#7d7384]">
                  Al menos 8 caracteres.
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
                <span>Creando tu cuenta…</span>
              ) : (
                <>
                  <span>Crear cuenta</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-[#e8e3ec]">
          <p className="text-[14px] text-[#7d7384]">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="font-semibold text-[#452453] hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
