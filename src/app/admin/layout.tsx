"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-pink-50/30">
      {/* Pink & White Sidebar */}
      <aside className="w-64 bg-white border-r border-pink-100 flex flex-col shadow-sm">
        <div className="p-6 text-xl font-extrabold text-gray-900 tracking-wider flex items-center gap-2 font-display">
          <span className="rounded-full bg-pink-100 p-1.5 text-base text-pink-600">🍦</span>
          Admin Portal
        </div>
        <nav className="flex-1 space-y-1.5 px-4">
          <Link href="/admin" className="block rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all">
            Dashboard
          </Link>
          <Link href="/admin/branches" className="block rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all">
            Branches
          </Link>
          <Link href="/admin/products" className="block rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all">
            Products & Stock
          </Link>
          <Link href="/admin/orders" className="block rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all">
            Orders
          </Link>
          <Link href="/admin/employees" className="block rounded-xl px-4 py-3 text-xs font-semibold text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all">
            Employees & Salaries
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-pink-100 flex items-center justify-between px-8 shadow-sm relative">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600">System Administrator</span>
          
          {/* Profile Circle & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-pink-500/25 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all cursor-pointer"
            >
              A
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-pink-100 bg-white py-2 shadow-xl shadow-pink-500/10 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">Administrator</p>
                  <p className="text-[10px] text-gray-500">admin@icebar.com</p>
                </div>
                <Link 
                  href="/admin/change-password" 
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
        </header>
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}