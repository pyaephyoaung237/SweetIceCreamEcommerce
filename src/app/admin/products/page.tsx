"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_name: string;
  status: string;
  image_url?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  status?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Custom Confirm Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Product Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    status: "available",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Category Form State & View Mode
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryViewMode, setCategoryViewMode] = useState<"add" | "list">("add");

  const fetchData = async () => {
    try {
      const resProd = await fetch("/api/admin/products");
      const dataProd = await resProd.json();
      if (dataProd.success) setProducts(dataProd.products || []);

      const resCat = await fetch("/api/admin/categories");
      const dataCat = await resCat.json();
      if (dataCat.success) setCategories(dataCat.categories || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("category_id", formData.category_id);
      data.append("status", formData.status);
      if (selectedImage) data.append("image", selectedImage);

      let url = "/api/admin/products";
      let method = "POST";

      if (editingProduct) {
        method = "PUT";
        data.append("id", editingProduct.id.toString());
        if (editingProduct.image_url) data.append("existing_image", editingProduct.image_url);
      }

      const res = await fetch(url, { method, body: data });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save product");

      closeProductModal();
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", categoryName);
      data.append("description", categoryDesc);

      let url = "/api/admin/categories";
      let method = "POST";

      if (editingCategory) {
        method = "PUT";
        data.append("id", editingCategory.id.toString());
      }

      const res = await fetch(url, { method, body: data });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save category");

      setCategoryName("");
      setCategoryDesc("");
      setEditingCategory(null);
      setCategoryViewMode("list");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      description: p.description || "",
      price: p.price.toString(),
      category_id: p.category_id ? p.category_id.toString() : "",
      status: p.status,
    });
    setImagePreview(p.image_url || null);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", category_id: "", status: "available" });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleDeleteProduct = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Product",
      message: "Are you sure you want to delete this product? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
          fetchData();
        } catch (err) {
          console.error("Failed to delete product", err);
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteCategory = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Category",
      message: "Are you sure you want to delete this category? Products linked to it might become uncategorized.",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
          fetchData();
        } catch (err) {
          console.error("Failed to delete category", err);
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (loading) return <p className="text-pink-600 font-medium p-6">Loading product catalog...</p>;

  return (
    <div>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setCategoryViewMode("add");
              setCategoryName("");
              setCategoryDesc("");
              setEditingCategory(null);
              setIsCategoryModalOpen(true);
            }}
            className="bg-white border border-pink-200 hover:bg-pink-50 text-pink-700 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            📂 Categories
          </button>
          <button
            onClick={() => {
              closeProductModal();
              setIsProductModalOpen(true);
            }}
            className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-pink-500/25 transition-all text-xs uppercase tracking-wider cursor-pointer"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-50 text-pink-800 text-xs uppercase font-bold">
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {currentProducts.map((p) => (
              <tr key={p.id} className="hover:bg-pink-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-pink-100 shadow-sm" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs">🍦</div>
                  )}
                  {p.name}
                </td>
                <td className="p-4">{p.category_name || "Uncategorized"}</td>
                <td className="p-4">${Number(p.price).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => openEditProduct(p)} className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400 text-xs">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-pink-50 bg-pink-50/20">
            <span className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-pink-100 bg-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-pink-100 bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-pink-100 bg-pink-50/40">
              <h2 className="text-base font-extrabold text-gray-900">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={closeProductModal} className="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Product Name</label>
                <input type="text" required placeholder="e.g. Mint Choc Chip Scoop" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Price ($)</label>
                  <input type="number" step="0.01" required placeholder="4.99" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20">
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20">
                  <option value="">Select Category</option>
                  {Array.isArray(categories) && categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Product Image</label>
                <div className="flex items-center gap-4">
                  {imagePreview && <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-pink-200" />}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Description</label>
                <textarea rows={3} placeholder="Flavor profile or ingredients..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/25 resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeProductModal} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50">
                  {submitting ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CATEGORIES MODAL (WITH VIEW/EDIT LIST) --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-pink-100 bg-pink-50/40">
              <h2 className="text-base font-extrabold text-gray-900">Manage Categories</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
            </div>

            <div className="p-6 space-y-4">
              {/* Toggle Tabs */}
              <div className="flex gap-2 border-b border-pink-100 pb-3">
                <button
                  onClick={() => { setCategoryViewMode("add"); setEditingCategory(null); setCategoryName(""); setCategoryDesc(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${categoryViewMode === "add" ? "bg-pink-600 text-white shadow-sm" : "bg-pink-50 text-pink-700 hover:bg-pink-100"}`}
                >
                  {editingCategory ? "Edit Category" : "+ Add Category"}
                </button>
                <button
                  onClick={() => setCategoryViewMode("list")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${categoryViewMode === "list" ? "bg-pink-600 text-white shadow-sm" : "bg-pink-50 text-pink-700 hover:bg-pink-100"}`}
                >
                  View All ({categories.length})
                </button>
              </div>

              {error && <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

              {categoryViewMode === "add" ? (
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sundaes, Cones..."
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Description (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Category details..."
                      value={categoryDesc}
                      onChange={(e) => setCategoryDesc(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20 resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => { setEditingCategory(null); setCategoryName(""); setCategoryDesc(""); setCategoryViewMode("list"); }}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                      {submitting ? "Saving..." : editingCategory ? "Update Category" : "Save Category"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex justify-between items-center p-3 bg-pink-50/40 border border-pink-100 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                        {cat.description && <p className="text-xs text-gray-500">{cat.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryName(cat.name);
                            setCategoryDesc(cat.description || "");
                            setCategoryViewMode("add");
                          }}
                          className="text-xs font-bold text-pink-600 hover:text-pink-800 bg-white px-2.5 py-1 rounded-lg border border-pink-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 bg-white px-2.5 py-1 rounded-lg border border-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && <p className="text-center text-xs text-gray-400 py-4">No categories created yet.</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- CUSTOM CONFIRM DIALOG MODAL --- */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-extrabold text-gray-900">{confirmModal.title}</h3>
            <p className="text-xs text-gray-600">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}