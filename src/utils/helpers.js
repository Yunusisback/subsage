import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";



export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Para birimi formatlamak için hazır fonksiyon 
export function formatCurrency(amount, options = {}) {
  const { decimals = 2, symbol = true } = options;

  return new Intl.NumberFormat('tr-TR', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'TRY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}