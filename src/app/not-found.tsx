// ./src/app/not-found.tsx
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import EmptyIllustration from "@/components/EmptyIllustration";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center space-y-6">
        <EmptyIllustration className="mx-auto h-28 w-40" />
        <div className="space-y-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#452453] block">
            Error 404
          </span>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#241230] tracking-tight">
            Esta página no existe
          </h1>
          <p className="text-[15px] text-[#403945] font-body leading-relaxed">
            Puede que la prenda se haya agotado o que el enlace esté mal escrito. El catálogo completo sigue acá.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#452453] text-white text-[15px] font-bold hover:bg-[#241230] transition-colors shadow-marifer-btn"
          >
            <span>Ver el catálogo</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center h-12 px-7 rounded-full border border-[#e3cde8] text-[#452453] text-[15px] font-medium hover:bg-[#f2e6f4] transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
