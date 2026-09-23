'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserSession {
  name: string;
  email: string;
}

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch current session data when navbar loads
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch session', err);
      }
    }
    checkAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur-md border border-pink-100">
        
        {/* Brand / Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-pink-600 flex items-center gap-2">
          🍦 <span className="text-gray-900 font-extrabold font-display">SweetIce</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-pink-600 transition-colors">Product</Link>
          <Link href="/branches" className="hover:text-pink-600 transition-colors">Our Location</Link>
          <Link href="/blog" className="hover:text-pink-600 transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-pink-600 transition-colors">Contact</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all border border-pink-200 flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            /* Logged-in User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 border border-pink-200 text-xs font-bold text-pink-700 hover:bg-pink-100 transition-all focus:outline-none"
              >
                <div className="h-6 w-6 rounded-full bg-pink-600 text-white flex items-center justify-center text-[10px]">
                  {user.name ? user.name.trim().charAt(0).toUpperCase() : "U"}
                </div>
                <span>{user.name}</span>
                <svg className="h-3 w-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-pink-100 bg-white py-2 shadow-xl shadow-pink-500/10 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link 
                    href="/favourites" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
                  >
                    Favourite
                  </Link>
                  <Link 
                    href="/change-password" 
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-all"
                  >
                    Change Password
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Log in Button */
            <Link 
              href="/login" 
              className="rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition-all"
            >
              Log in
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-full p-2 text-gray-700 hover:bg-pink-50 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-md border border-pink-100 md:hidden flex flex-col space-y-4 text-center">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-800 hover:text-pink-600">Home</Link>
          <Link href="/products" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-800 hover:text-pink-600">Product</Link>
          <Link href="/branches" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-800 hover:text-pink-600">Our Location</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-800 hover:text-pink-600">Blog</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-base font-medium text-gray-800 hover:text-pink-600">Contact</Link>
        </div>
      )}
    </header>
  );
}