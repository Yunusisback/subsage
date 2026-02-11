import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
 
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);
};


export function formatCurrency(amount, options = {}) {
  const { decimals = 2, symbol = true } = options;

  
  const numericAmount = parseFloat(amount) || 0;

  return new Intl.NumberFormat('tr-TR', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'TRY',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericAmount);
}


export const formatMoneyClean = (amount) => {
  return new Intl.NumberFormat('tr-TR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
  }).format(amount);
};