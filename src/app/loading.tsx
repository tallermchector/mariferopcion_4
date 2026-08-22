// ./src/app/loading.tsx
// Skeleton genérico: reserva el espacio de una grilla de prendas para evitar saltos de layout.
export default function Loading() {
  return (
    <div
      className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Cargando prendas…</span>
      <div className="space-y-3">
        <div className="skeleton h-3 w-40 rounded-full" />
        <div className="skeleton h-10 w-72 max-w-full rounded-[12px]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[14px] bg-white p-3 border border-[#e8e3ec] shadow-marifer-sm space-y-3"
          >
            <div className="skeleton aspect-[3/4] w-full rounded-[10px]" />
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-4 w-3/4 rounded-full" />
            <div className="skeleton h-5 w-24 rounded-full" />
            <div className="flex items-center justify-between pt-2 border-t border-[#e8e3ec]">
              <div className="skeleton h-3 w-16 rounded-full" />
              <div className="skeleton h-11 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
