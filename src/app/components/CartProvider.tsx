'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Product, finalPrice } from '@/lib/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (p: Product, qty?: number) => void;
  setQuantity: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'sweetice_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Load saved cart once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartCtx>(() => ({
    items,
    count: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + finalPrice(i.product) * i.quantity, 0),
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addToCart: (product, qty = 1) => {
      setItems(prev => {
        const found = prev.find(i => i.product.id === product.id);
        if (found) {
          return prev.map(i => (i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i));
        }
        return [...prev, { product, quantity: qty }];
      });
      setIsOpen(true);
    },
    setQuantity: (id, qty) =>
      setItems(prev =>
        qty <= 0 ? prev.filter(i => i.product.id !== id) : prev.map(i => (i.product.id === id ? { ...i, quantity: qty } : i))
      ),
    removeFromCart: id => setItems(prev => prev.filter(i => i.product.id !== id)),
  }), [items, isOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}