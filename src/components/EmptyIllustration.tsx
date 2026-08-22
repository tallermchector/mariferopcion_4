// ./src/components/EmptyIllustration.tsx
// Ilustración para estados vacíos (DESIGN.md §4): percha con prenda, en la paleta Marifer.
// Server-safe (sin hooks); decorativa → aria-hidden.

interface EmptyIllustrationProps {
  className?: string;
}

export function EmptyIllustration({ className = 'h-28 w-40' }: EmptyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 112"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Fondo lila suave */}
      <ellipse cx="80" cy="60" rx="72" ry="46" fill="#f2e6f4" />
      {/* Gancho */}
      <path
        d="M80 14c-6 0-10 4-10 9h6c0-2 2-4 4-4s4 2 4 4c0 3-4 4-4 9v3"
        stroke="#452453"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Percha */}
      <path
        d="M80 35 26 62h108L80 35Z"
        stroke="#452453"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="#ffffff"
      />
      {/* Prenda colgada */}
      <path
        d="M56 62c0 0 2 7 24 7s24-7 24-7l7 36H49l7-36Z"
        fill="#ffffff"
        stroke="#452453"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Detalle del cuello */}
      <path d="M70 62c3 3 7 4 10 4s7-1 10-4" stroke="#caa8d3" strokeWidth="3" strokeLinecap="round" />
      {/* Etiqueta sale */}
      <rect x="100" y="78" width="22" height="12" rx="6" fill="#d94f78" />
      <circle cx="104" cy="84" r="2" fill="#ffffff" />
    </svg>
  );
}

export default EmptyIllustration;
