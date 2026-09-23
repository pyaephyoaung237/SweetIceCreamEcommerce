"use client";

import { useEffect, useState } from "react";

interface Branch {
  id: number;
  name: string;
  slug: string;
  city: string;
  address: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    status: "active",
  });

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/admin/branches");
      const data = await res.json();
      if (data.success) setBranches(data.branches || []);
    } catch (err) {
      console.error("Error loading branches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranches = Array.isArray(branches) ? branches.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((branches?.length || 0) / itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = "/api/admin/branches";
      const method = editingBranch ? "PUT" : "POST";
      const body = editingBranch ? { ...formData, id: editingBranch.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save branch");

      closeModal();
      fetchBranches();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (b: Branch) => {
    setEditingBranch(b);
    setFormData({
      name: b.name,
      city: b.city,
      address: b.address,
      phone: b.phone || "",
      status: b.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
    setFormData({ name: "", city: "", address: "", phone: "", status: "active" });
    setError("");
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Branch",
      message: "Are you sure you want to delete this branch? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/branches?id=${id}`, { method: "DELETE" });
          fetchBranches();
        } catch (err) {
          console.error("Failed to delete branch", err);
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (loading) return <p className="text-pink-600 font-medium p-6">Loading branches...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Branches Management</h1>
        <button
          onClick={() => {
            closeModal();
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-pink-500/25 transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          + Add Branch
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-50 text-pink-800 text-xs uppercase font-bold">
              <th className="p-4">Branch Name</th>
              <th className="p-4">City</th>
              <th className="p-4">Address</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {currentBranches.map((b) => (
              <tr key={b.id} className="hover:bg-pink-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs">🏢</div>
                  {b.name}
                </td>
                <td className="p-4">{b.city}</td>
                <td className="p-4 text-gray-500">{b.address}</td>
                <td className="p-4">{b.phone || "-"}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEdit(b)} className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentBranches.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400 text-xs">No branches found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-pink-50 bg-pink-50/20">
            <span className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-pink-100 bg-white disabled:opacity-40">Previous</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="px-3 py-1.5 text-xs font-bold rounded-lg border border-pink-100 bg-white disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-pink-100 bg-pink-50/40">
              <h2 className="text-base font-extrabold text-gray-900">{editingBranch ? "Edit Branch" : "Add New Branch"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Branch Name</label>
                <input type="text" required placeholder="e.g. Downtown Store" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">City</label>
                  <input type="text" required placeholder="e.g. Yangon" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Address</label>
                <input type="text" required placeholder="Street address..." value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Phone</label>
                <input type="text" placeholder="+959..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50">
                  {submitting ? "Saving..." : editingBranch ? "Update Branch" : "Save Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">{confirmModal.title}</h3>
            <p className="text-xs text-gray-600">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={confirmModal.onConfirm} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}