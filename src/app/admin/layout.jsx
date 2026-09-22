import Link from "next/link";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 text-xl font-bold text-white tracking-wider">
          Admin Portal
        </div>
        <nav className="flex-1 space-y-1 px-4">
          <Link href="/admin" className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/branches" className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white">
            Branches
          </Link>
          <Link href="/admin/products" className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white">
            Products & Stock
          </Link>
          <Link href="/admin/orders" className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white">
            Orders
          </Link>
          <Link href="/admin/employees" className="block rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white">
            Employees & Salaries
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <span className="text-sm font-semibold text-gray-600">System Administrator</span>
          <div className="h-8 w-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
        </header>
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}