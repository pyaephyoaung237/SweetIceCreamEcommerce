'use client';

import { useState } from 'react';
import Link from 'next/link';
import Welcome from './components/Welcome';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import { useStore } from '@/lib/useStores';

export default function Home() {
  const { products, categories, loading, error } = useStore({ limit: 24 });
  const [selected, setSelected] = useState<number | 'all'>('all');

  const filtered = selected === 'all' ? products : products.filter(p => p.category_id === selected);
  const featured = filtered.slice(0, 8);

  return (
    <div className="w-full pt-20 sm:pt-28 pb-12">
      {/* Welcome banner (full width) */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <Welcome />
      </section>

      {/* Featured products */}
      <section className="w-full px-4 sm:px-6 lg:px-10 mt-8 sm:mt-10">
        <div className="flex items-end justify-between gap-4 mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">Fresh from the freezer</h2>
          <Link href="/products" className="text-sm font-semibold text-pink-600 hover:text-pink-700 whitespace-nowrap">View all</Link>
        </div>

        <div className="mb-5">
          <CategoryTabs categories={categories} selected={selected} onSelect={setSelected} />
        </div>

        <ProductGrid products={featured} loading={loading} error={error} />
      </section>
    </div>
  );
}