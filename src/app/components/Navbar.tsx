'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';

interface UserSession {
  name: string;
  email: string;
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Product' },
  { href: '/location', label: 'Our Location' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { count, openCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) setUser((await res.json()).user);
      } catch (err) {
        console.error('Failed to fetch session', err);
      }
    })();
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setDropdownOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <header className="fixed top-2 sm:top-4 inset-x-0 z-50 px-2 sm:px-4 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between rounded-full bg-white/90 px-4 sm:px-6 py-2.5 shadow-lg backdrop-blur-md border border-pink-100">
        <Link href="/" className="text-lg sm:text-xl font-bold tracking-tight text-pink-600 flex items-center gap-2">
           <span className="text-gray-900 font-extrabold font-display">SweetIce</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-pink-600 transition-colors">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openCart}
            className="relative h-10 w-10 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition border border-pink-200 flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            {/* Shopping cart icon (basket with wheels) */}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold h-5 min-w-5 px-1 rounded-full flex items-center justify-center border-2 border-white">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full  pl-1.5 pr-3 py-1.5 border border-pink-200 text-xs font-bold text-pink-700 hover:bg-pink-100 transition"
              >
                <span className="h-7 w-7 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs">
                  {user.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="hidden sm:inline max-w-24 truncate">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-pink-100 bg-white py-2 shadow-xl shadow-pink-500/10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link href="/favourites" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Favourite</Link>
                  <Link href="/change-password" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600">Change Password</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="rounded-full bg-pink-600 px-4 sm:px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition">
              Log in
            </Link>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden h-10 w-10 rounded-full flex items-center justify-center text-gray-700 hover:bg-pink-50"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mx-auto mt-2 max-w-[1600px] rounded-3xl bg-white/95 p-3 shadow-xl backdrop-blur-md border border-pink-100 md:hidden flex flex-col">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-2xl text-base font-medium text-gray-800 hover:bg-pink-50 hover:text-pink-600">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}