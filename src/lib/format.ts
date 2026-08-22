// ./src/lib/format.ts

/**
 * Helper para formatear montos en Pesos Uruguayos (UYU)
 * Formato estándar: "$ 3.490"
 */
export function formatPriceUYU(amount: number): string {
  const formatted = new Intl.NumberFormat('es-UY', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));

  return `$ ${formatted}`;
}

/**
 * Calcula la cuota para 6 cuotas sin recargo
 */
export function formatInstallments(amount: number, cuotas = 6): string {
  const cuota = Math.round(amount / cuotas);
  return `${cuotas} cuotas sin recargo de ${formatPriceUYU(cuota)}`;
}

/**
 * Retorna desglose de cuotas en UYU
 */
export function calculateInstallmentsUYU(amount: number, cuotas = 6) {
  const installmentValue = Math.round(amount / cuotas);
  return {
    cuotas,
    installmentAmount: installmentValue,
    installmentText: `${formatPriceUYU(installmentValue)}`,
    fullText: `${cuotas} cuotas sin recargo de ${formatPriceUYU(installmentValue)}`,
  };
}
