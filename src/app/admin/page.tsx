"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  totalOrders: number;
  activeProducts: number;
  branches: number;
  pendingDeliveries: number;
}

interface PopularProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  total_sold: number;
  image?: string;
}

interface Order {
  id: number;
  customer_name: string;
  branch_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeProducts: 0,
    branches: 0,
    pendingDeliveries: 0,
  });
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setPopularProducts(data.popularProducts || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  if (loading) {
    return <p className="text-pink-600 font-medium p-6">Loading dashboard insights...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-display">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin! Manage your sweet ice cream shop here.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-white border border-pink-200 hover:bg-pink-50 text-pink-700 font-bold py-2 px-4 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          Refresh Stats
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Orders</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Products</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.activeProducts}</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Branches</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.branches}</p>
        </div>
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Deliveries</h3>
          <p className="text-3xl font-extrabold text-pink-600 mt-2">{stats.pendingDeliveries}</p>
        </div>
      </div>

      {/* Grid: Popular Ice Creams & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Ice Creams */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm lg:col-span-1 space-y-4">
          <h2 className="text-base font-extrabold text-gray-900"> Popular Ice Creams</h2>
          <div className="space-y-3">
            {popularProducts.map((p, index) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-pink-50/40 rounded-xl border border-pink-50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-pink-200 text-pink-800 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{p.name}</h4>
                    <p className="text-xs text-gray-500">${Number(p.price).toFixed(2)} • {p.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-lg">
                    {p.total_sold} sold
                  </span>
                </div>
              </div>
            ))}
            {popularProducts.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No sales data available yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-gray-900">Recent Customer Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50 text-pink-800 text-xs uppercase font-bold">
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Branch</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="p-3 font-mono text-xs font-bold text-gray-900">#{o.id}</td>
                    <td className="p-3 font-semibold">{o.customer_name}</td>
                    <td className="p-3 text-gray-500 text-xs">{o.branch_name}</td>
                    <td className="p-3 font-bold text-green-600">${Number(o.total_amount).toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        o.status === "completed" ? "bg-green-100 text-green-700" :
                        o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-pink-100 text-pink-700"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {o.status === "pending" ? (
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, "completed")}
                          className="text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg transition-all shadow-sm cursor-pointer"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400 text-xs">No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}