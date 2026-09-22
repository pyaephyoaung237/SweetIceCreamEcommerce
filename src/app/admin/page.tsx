export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-display">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin! Manage your sweet ice cream shop here.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Orders</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">12</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Products</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">8</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Branches</h3>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">2</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Pending Deliveries</h3>
          <p className="text-3xl font-extrabold text-pink-600 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}