'use client';

import { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Navbar from './components/Navbar';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  category_name?: string;
  status: string;
  image_url?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products and categories for the user store view
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch products (using public endpoint or admin endpoint as configured)
        const resProd = await fetch('/api/admin/products'); 
        const contentTypeProd = resProd.headers.get("content-type");
        
        if (!contentTypeProd || !contentTypeProd.includes("application/json")) {
          throw new Error("API endpoint for products did not return JSON. Check if route.ts exists.");
        }
        
        const dataProd = await resProd.json();
        if (dataProd.success) {
          const availableProducts = (dataProd.products || []).filter(
            (p: Product) => p.status === 'available'
          );
          setProducts(availableProducts);
        }

        // Fetch categories
        const resCat = await fetch('/api/categories'); 
        const contentTypeCat = resCat.headers.get("content-type");
        if (contentTypeCat && contentTypeCat.includes("application/json")) {
          const dataCat = await resCat.json();
          if (dataCat.success) {
            setCategories(dataCat.categories || []);
          }
        }
      } catch (err: any) {
        console.error('Failed to load store data:', err);
        setError(err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/60 via-slate-50 to-pink-50/30 text-slate-800 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Floating Navbar */}
      <Navbar 
        cartCount={totalCartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* Full-Width Welcome Banner Section */}
      <div className="w-full px-4 md:px-8 pt-28 pb-4 max-w-7xl mx-auto">
        <Welcome />
      </div>

      {/* Main Container for Catalog, Filters & Cart */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 gap-6 pb-12">
        <main className="flex-1 w-full">
          
          {/* Category Filter Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition whitespace-nowrap shadow-sm cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-pink-600 text-white shadow-pink-500/20 shadow-md'
                  : 'bg-white/85 backdrop-blur-md text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
              }`}
            >
              All Collection
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition whitespace-nowrap shadow-sm cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-pink-600 text-white shadow-pink-500/20 shadow-md'
                    : 'bg-white/85 backdrop-blur-md text-slate-600 hover:bg-pink-50 hover:text-pink-600 border border-pink-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs mb-6 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20 text-pink-600 font-medium text-sm">
              Loading delicious items... 🍨
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-sm bg-white/50 rounded-3xl border border-pink-100">
              No available products found in this category.
            </div>
          ) : (
            /* Product Card Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden border border-pink-100/80 shadow-lg shadow-pink-500/5 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 flex flex-col group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-pink-50 overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <span className="text-4xl">🍦</span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
                        {product.category_name || 'General'}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 tracking-tight mt-2">{product.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{product.description || 'No description provided.'}</p>
                      
                      <div className="mt-3">
                        <span className="text-pink-600 font-extrabold text-base">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-2xl font-bold text-xs transition shadow-md shadow-pink-600/20 flex items-center justify-center cursor-pointer"
                      >
                        Add to Cart 🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Cart Sidebar / Drawer */}
        {isCartOpen && (
          <aside className="w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pink-500/15 border border-pink-100 p-6 flex flex-col h-[calc(100vh-9rem)] sticky top-28 animate-in fade-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-pink-100">
              <h2 className="font-bold text-base text-slate-900">Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-pink-50 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-slate-400 py-12 text-sm">Your cart is empty 🍨</p>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-3 items-center bg-pink-50/40 p-2.5 rounded-2xl border border-pink-100/50">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>🍦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-slate-800 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-xs text-pink-600 shrink-0">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-pink-100">
                <div className="flex justify-between mb-4 font-bold text-sm">
                  <span>Subtotal:</span>
                  <span className="text-pink-600">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/25 transition cursor-pointer">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}