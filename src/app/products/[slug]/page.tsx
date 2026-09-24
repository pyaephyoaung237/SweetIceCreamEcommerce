'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product, finalPrice, formatMMK } from './lib/types';
import { useCart } from './app/components/CartProvider';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/products?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!data.success) throw new Error(data.error || 'Product not found');
        setProduct(data.product);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const toggleFavorite = () => {
    // TODO: POST /api/user/favourites { product_id } once that route exists
    setIsFavorite(v => !v);
  };

  if (loading) {
    return <div className="w-full pt-32 pb-12 px-4 sm:px-6 lg:px-10"><div className="h-96 rounded-3xl bg-pink-50 animate-pulse" /></div>;
  }

  if (error || !product) {
    return (
      <div className="w-full pt-32 pb-16 px-4 text-center">
        <p className="text-slate-500">{error || 'Product not found.'}</p>
        <Link href="/products" className="inline-block mt-4 rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white">Back to products</Link>
      </div>
    );
  }

  const hasDiscount = product.discount_percent > 0;

  return (
    <div className="w-full pt-24 sm:pt-32 pb-28 lg:pb-12 px-4 sm:px-6 lg:px-10">
      <Link href="/products" className="text-sm font-semibold text-pink-600 hover:text-pink-700">← All products</Link>

      <div className="mt-4 w-full bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square lg:aspect-auto lg:min-h-[32rem] bg-pink-50">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-8xl">🍦</span>
          )}
          <button
            onClick={toggleFavorite}
            aria-label="Save to favourites"
            aria-pressed={isFavorite}
            className={`absolute top-4 right-4 h-11 w-11 rounded-full backdrop-blur-md shadow-md transition ${isFavorite ? 'bg-pink-600 text-white' : 'bg-white/85 text-slate-700 hover:bg-white'}`}
          >
            ♥
          </button>
        </div>

        {/* Info */}
        <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-between gap-8">
          <div>
            <span className="text-xs font-semibold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">{product.category_name || 'General'}</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 font-display">{product.name}</h1>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-prose">{product.description || 'A sweet treat made fresh for you.'}</p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-pink-600">{formatMMK(finalPrice(product))}</span>
              {hasDiscount && (
                <>
                  <span className="text-slate-400 line-through">{formatMMK(Number(product.price))}</span>
                  <span className="text-xs font-bold text-white bg-pink-600 rounded-full px-2.5 py-1">-{product.discount_percent}%</span>
                </>
              )}
            </div>
          </div>

          {/* Actions: sticky bar on phones, inline on desktop */}
          <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-pink-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3 lg:static lg:bg-transparent lg:border-0 lg:p-0 lg:backdrop-blur-none">
            <div className="flex items-center border border-pink-200 rounded-2xl overflow-hidden bg-white shrink-0">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="h-12 w-11 text-lg font-bold text-slate-600 hover:bg-pink-50" aria-label="Decrease quantity">−</button>
              <span className="w-8 text-center font-bold text-slate-800">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="h-12 w-11 text-lg font-bold text-slate-600 hover:bg-pink-50" aria-label="Increase quantity">+</button>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white rounded-2xl font-bold shadow-lg shadow-pink-600/25 transition"
            >
              Add to Cart · {formatMMK(finalPrice(product) * quantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}