'use client';

import { useEffect, useState } from 'react';
import { Category, Product } from './types';

// Loads products + categories from the user APIs.
export function useStore(opts: { limit?: number } = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [pRes, cRes] = await Promise.all([
          fetch(`/api/user/products${opts.limit ? `?limit=${opts.limit}` : ''}`),
          fetch('/api/user/categories'),
        ]);
        const pData = await pRes.json();
        const cData = await cRes.json();
        if (cancelled) return;
        if (!pData.success) throw new Error(pData.error || 'Failed to load products.');
        setProducts(pData.products || []);
        setCategories(cData.success ? cData.categories || [] : []);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load products.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [opts.limit]);

  return { products, categories, loading, error };
}