export function formatCurrency(value, currency = "GBP", locale = "en-GB") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
