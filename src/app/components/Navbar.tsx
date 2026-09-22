"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 ">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur-md border border-pink-100">
        
        {/* Brand / Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-pink-600 flex items-center gap-2">
          🍦 <span className="text-gray-900 font-extrabold">SweetIce</span>
        </Link>

        {/* Desktop Navigation Links (Hidden on small screens) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-pink-600 transition-colors">Product</Link>
          <Link href="/branches" className="hover:text-pink-600 transition-colors">Our Location</Link>
          <Link href="/blog" className="hover:text-pink-600 transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-pink-600 transition-colors">Contact</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          {/* Log in Button */}
          <Link 
            href="/login" 
            className="rounded-full bg-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-700 transition-all"
          >
            Log in
          </Link>

          {/* Mobile Hamburger Button (Only visible on mobile) */}
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