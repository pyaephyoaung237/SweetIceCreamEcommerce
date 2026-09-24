'use client';

import { useMemo, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import { useStore } from '@/lib/useStores';

export default function ProductsPage() {
  const { products, categories, loading, error } = useStore();
  const [selected, setSelected] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p =>
      (selected === 'all' || p.category_id === selected) &&
      (!q || p.name.toLowerCase().includes(q))
    );
  }, [products, selected, search]);

  return (
    <div className="w-full pt-24 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-display">Our products</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? 'Loading flavours...' : `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'} available`}
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search flavours"
          className="w-full md:w-80 rounded-full border border-pink-200 bg-white px-5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      <div className="mb-6">
        <CategoryTabs categories={categories} selected={selected} onSelect={setSelected} />
      </div>

      <ProductGrid products={filtered} loading={loading} error={error} />
    </div>
  );
}