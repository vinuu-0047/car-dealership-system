import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: string | number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(price));
};

export const getStockBadge = (quantity: number): { label: string; variant: 'success' | 'warning' | 'danger' } => {
  if (quantity === 0) return { label: 'Out of Stock', variant: 'danger' };
  if (quantity <= 2) return { label: `${quantity} Left`, variant: 'warning' };
  return { label: `${quantity} In Stock`, variant: 'success' };
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Sedan: '🚗', SUV: '🚙', Truck: '🛻', Sports: '🏎️', Electric: '⚡', Hybrid: '♻️',
  };
  return icons[category] || '🚘';
};
