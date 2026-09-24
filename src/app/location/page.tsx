import Link from 'next/link';

export default function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-24">
      
      {/* Left Banner (Purple Theme - e.g., Ice Cream Cones / Combos) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 to-indigo-500 p-6 sm:p-8 text-white flex items-center justify-between shadow-lg shadow-purple-500/10 min-h-[180px]">
        {/* Content */}
        <div className="relative z-10 max-w-[200px] sm:max-w-[240px] flex flex-col items-start gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
            Cone Combos
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            More Scoops, More Happiness!
          </h2>
          <Link 
            href="/combos"
            className="mt-2 bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5"
          >
            Explore Combos <span>→</span>
          </Link>
        </div>

        {/* Banner Image / Illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80" 
            alt="Cone Combos" 
            className="h-full w-full object-cover object-left opacity-90 scale-110 translate-x-4"
          />
          {/* Subtle gradient overlay to blend image into the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-transparent to-transparent opacity-80" />
        </div>
      </div>

      {/* Right Banner (Pink Theme - e.g., Ice Cream Cakes) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-400 to-rose-400 p-6 sm:p-8 text-white flex items-center justify-between shadow-lg shadow-pink-500/10 min-h-[180px]">
        {/* Content */}
        <div className="relative z-10 max-w-[200px] sm:max-w-[240px] flex flex-col items-start gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
            Ice Cream Cakes
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            Celebrate Every Moment Sweetly
          </h2>
          <Link 
            href="/cakes"
            className="mt-2 bg-white text-pink-600 hover:bg-pink-50 font-bold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5"
          >
            Shop Cakes <span>→</span>
          </Link>
        </div>

        {/* Banner Image / Illustration */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 flex items-center justify-end overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80" 
            alt="Ice Cream Cakes" 
            className="h-full w-full object-cover object-left opacity-90 scale-110 translate-x-4"
          />
          {/* Subtle gradient overlay to blend image into the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-transparent to-transparent opacity-80" />
        </div>
      </div>

    </div>
  );
}