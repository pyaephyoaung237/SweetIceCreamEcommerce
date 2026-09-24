import Link from 'next/link';
import { ReactNode } from 'react';

// Centered auth layout: one card in the middle of the page on every screen size.
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 pt-28 pb-12 sm:pt-24">
      {/* Soft background blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-rose-200/50 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-5 flex items-center justify-center gap-2 text-lg font-extrabold text-gray-900">
          <span className="text-2xl">🍦</span> SweetIce
        </Link>

        <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl shadow-pink-500/10">
          <div className="h-1.5 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600" />
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}