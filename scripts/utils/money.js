export function formatCurrency(PriceInCents) {
  return (Math.round(PriceInCents) / 100).toFixed(2)
}
