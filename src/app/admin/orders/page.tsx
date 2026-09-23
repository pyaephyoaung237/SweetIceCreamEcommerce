"use client";

import { useEffect, useState } from "react";

interface Order {
  id: number;
  customer_name: string;
  branch_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "all") return true;
    return o.status === filterStatus;
  });

  if (loading) {
    return <p className="text-pink-600 font-medium p-6">Loading orders...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-display">Manage Orders</h1>
          <p className="text-sm text-gray-500">View and track customer ice cream purchases across branches.</p>
        </div>
        
        {/* Status Filter Tabs */}
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-pink-100 shadow-sm">
          {["all", "pending", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-pink-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-pink-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 text-pink-800 text-xs uppercase font-bold">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredOrders.map((o) => (
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
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    {o.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(o.id, "completed")}
                        className="text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded-lg transition-all shadow-sm cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                    {o.status === "completed" && (
                      <span className="text-xs text-gray-400 font-medium">Finished</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 text-xs">
                    No orders found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}