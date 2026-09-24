'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';
import { finalPrice, formatMMK } from '@/lib/types';

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQuantity, removeFromCart, subtotal, count } = useCart();

  // Lock page scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel: full width on phones, 24rem on larger screens */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
          <h2 className="font-bold text-lg text-slate-900">Your Cart {count > 0 && <span className="text-pink-600">({count})</span>}</h2>
          <button onClick={closeCart} aria-label="Close cart" className="h-9 w-9 rounded-full text-slate-500 hover:bg-pink-50 hover:text-slate-800 transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-slate-400 py-20 text-sm">Your cart is empty 🍨<br />Add something sweet!</div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-center bg-pink-50/50 p-3 rounded-2xl border border-pink-100">
                <div className="h-14 w-14 rounded-xl bg-pink-100 overflow-hidden flex items-center justify-center shrink-0">
                  {product.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                  ) : <span>🍦</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h4>
                  <p className="text-xs text-pink-600 font-bold">{formatMMK(finalPrice(product) * quantity)}</p>
                  <div className="mt-1 inline-flex items-center rounded-lg border border-pink-200 bg-white text-xs">
                    <button onClick={() => setQuantity(product.id, quantity - 1)} className="px-2.5 py-1 hover:bg-pink-50" aria-label="Decrease">−</button>
                    <span className="px-2 font-bold">{quantity}</span>
                    <button onClick={() => setQuantity(product.id, quantity + 1)} className="px-2.5 py-1 hover:bg-pink-50" aria-label="Increase">+</button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(product.id)} className="text-slate-300 hover:text-red-500 text-sm p-1" aria-label="Remove">🗑</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-pink-100 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between font-bold text-sm mb-3">
              <span>Subtotal</span>
              <span className="text-pink-600">{formatMMK(subtotal)}</span>
            </div>
            <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-pink-600/25 transition">
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}