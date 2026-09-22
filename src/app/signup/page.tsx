import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30">
      {/* Decorative background blob */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-pink-100 bg-white/80 p-8 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="text-center space-y-2">
          <span className="inline-block rounded-full bg-pink-100 p-3 text-2xl text-pink-600 mb-1">🍦</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">Create an Account</h1>
          <p className="text-sm text-gray-500">Join IceBar and get sweet treats delivered!</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="John Doe"
              required 
              className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              required 
              className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 active:scale-[0.98] transition-all"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="font-bold text-pink-600 hover:text-pink-700 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}