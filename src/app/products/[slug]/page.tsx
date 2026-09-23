'use client';

import { useState } from 'react';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  // Mock logged-in state and favorite state linked to user_id / product_id schema
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Mock product fetch using slug
  const product = {
    id: 2,
    name: 'Belgian Dark Chocolate',
    description: 'Rich, intense dark chocolate churned slowly with fresh cream and imported cocoa beans. Perfect for true chocolate connoisseurs.',
    price: 5200.00,
    discount_percent: 10,
    image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    status: 'available',
  };

  const toggleFavorite = () => {
    if (!isLoggedIn) {
      alert('Please log in to add items to your favourites!');
      return;
    }
    setIsFavorite(!isFavorite);
    // API call placeholder: POST /api/favourites { user_id, product_id }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative h-80 md:h-full bg-slate-200">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          {/* Favourite Button (maps to favourites table) */}
          <button 
            onClick={toggleFavorite}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition shadow-md ${
              isFavorite ? 'bg-pink-600 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title="Save to Favourites"
          >
            ♥
          </button>
        </div>

        {/* Product Information */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
              {product.status}
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-3 font-display">{product.name}</h1>
            <p className="mt-4 text-slate-600 text-sm leading-relaxed">{product.description}</p>
            
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-pink-600">
                {(product.price * (1 - product.discount_percent / 100)).toLocaleString()} MMK
              </span>
              {product.discount_percent > 0 && (
                <span className="text-slate-400 line-through">
                  {product.price.toLocaleString()} MMK
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-slate-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button (maps to cart_items table) */}
            <button 
              onClick={() => alert(`Added ${quantity} item(s) to cart!`)}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3.5 rounded-xl font-bold shadow-md transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}