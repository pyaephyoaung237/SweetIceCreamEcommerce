import Link from 'next/link';

export default function Welcome() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-xl mb-8 min-h-[380px] flex items-center border border-pink-100/20">
      {/* Background Image with Dark & Pink Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1200&q=80" 
          alt="Delicious Ice Cream Background" 
          className="w-full h-full object-cover object-center opacity-65 scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-6 md:p-12 max-w-xl text-white flex flex-col items-start gap-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/30 border border-pink-400/30 text-pink-200 text-xs font-semibold backdrop-blur-md">
            Welcome to SweetIce
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Crafting Happiness, One Scoop at a Time.
        </h1>
        <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
          Indulge in our artisan, handcrafted ice creams made with the finest organic ingredients. Freshly churned daily just for you.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link 
            href="/products"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            Explore Menu 
          </Link>
          <Link 
            href="/branches"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs md:text-sm px-6 py-3 rounded-2xl backdrop-blur-md transition-all cursor-pointer"
          >
            Our Locations
          </Link>
        </div>
      </div>
    </section>
  );
}