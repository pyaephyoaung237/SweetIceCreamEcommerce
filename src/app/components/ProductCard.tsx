'use client';

import Link from 'next/link';
import { Product, finalPrice, formatMMK } from '@/lib/types';
import { useCart } from './CartProvider';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.discount_percent > 0;

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-md shadow-pink-500/5 hover:shadow-xl hover:shadow-pink-500/10 transition-shadow flex flex-col group">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-pink-50 overflow-hidden">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-5xl">🍦</span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            -{product.discount_percent}%
          </span>
        )}
      </Link>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="self-start text-[11px] font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
          {product.category_name || 'General'}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-slate-900 mt-2 leading-snug hover:text-pink-600 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description || 'A sweet treat made fresh for you.'}</p>

        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div className="leading-tight">
            <div className="text-pink-600 font-extrabold">{formatMMK(finalPrice(product))}</div>
            {hasDiscount && <div className="text-xs text-slate-400 line-through">{formatMMK(Number(product.price))}</div>}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-pink-600/20 transition"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}