import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, error }: { products: Product[]; loading: boolean; error: string | null }) {
  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm font-medium">⚠️ {error}</div>;
  }
  if (loading) {
    return (
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white border border-pink-100 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-pink-50" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-20 bg-pink-50 rounded" />
              <div className="h-4 w-3/4 bg-pink-50 rounded" />
              <div className="h-3 w-full bg-pink-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (products.length === 0) {
    return <div className="text-center py-20 text-slate-400 text-sm bg-white/60 rounded-3xl border border-pink-100">No products found here yet. Try another category.</div>;
  }
  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}