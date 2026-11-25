import { Currency } from "./types";

export function formatAmount(amount: number, currency: Currency): string {
  if (currency === "GHS") {
    return `₵${amount.toLocaleString()}`;
  }
  return `$${amount.toLocaleString()}`;
}

export function currencyLabel(currency: Currency): string {
  return currency === "GHS" ? "GHS ₵" : "USD $";
}
