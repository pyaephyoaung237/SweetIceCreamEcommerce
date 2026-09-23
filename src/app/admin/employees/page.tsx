"use client";

import { useEffect, useState } from "react";

interface Employee {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  branch_id: number;
  branch_name: string;
  position: string;
  base_salary: number;
  status: string;
}

interface SalaryRecord {
  id: number;
  employee_name: string;
  branch_name: string;
  period: string;
  amount: number;
  bonus: number;
  note: string;
  created_at: string;
}

interface Branch {
  id: number;
  name: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<"employees" | "salaries">("employees");
  const [isEmpModal, setIsEmpModal] = useState(false);
  const [isSalModal, setIsSalModal] = useState(false);

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

  const [empForm, setEmpForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    branch_id: "",
    position: "",
    base_salary: "",
  });

  const [salForm, setSalForm] = useState({
    employee_id: "",
    branch_id: "",
    period: "",
    amount: "",
    bonus: "0",
    note: "",
  });

  const loadData = async () => {
    try {
      const resEmp = await fetch("/api/admin/employees");
      const dEmp = await resEmp.json();
      if (dEmp.success) setEmployees(dEmp.employees || []);

      const resSal = await fetch("/api/admin/employees?type=salaries");
      const dSal = await resSal.json();
      if (dSal.success) setSalaries(dSal.salaries || []);

      const resB = await fetch("/api/admin/branches");
      const dB = await resB.json();
      if (dB.success) setBranches(dB.branches || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentList = tab === "employees" ? employees : salaries;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = Array.isArray(currentList) ? currentList.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((currentList?.length || 0) / itemsPerPage);

  const handleEmpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empForm),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add employee");

      setIsEmpModal(false);
      setEmpForm({ name: "", email: "", phone: "", password: "", branch_id: "", position: "", base_salary: "" });
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "salary", ...salForm }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to process salary payout");

      setIsSalModal(false);
      setSalForm({ employee_id: "", branch_id: "", period: "", amount: "", bonus: "0", note: "" });
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Employee",
      message: "Are you sure you want to delete this employee and their associated user account?",
      onConfirm: async () => {
        try {
          await fetch(`/api/admin/employees?id=${id}`, { method: "DELETE" });
          loadData();
        } catch (err) {
          console.error("Failed to delete employee", err);
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (loading) return <p className="text-pink-600 font-medium p-6">Loading personnel data...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees and Salaries</h1>
        <div className="flex gap-3">
          <button onClick={() => { setIsEmpModal(true); setError(""); }} className="bg-white border border-pink-200 hover:bg-pink-50 text-pink-700 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider cursor-pointer">
            + Add Employee
          </button>
          <button onClick={() => { setIsSalModal(true); setError(""); }} className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-md shadow-pink-500/25 transition-all text-xs uppercase tracking-wider cursor-pointer">
            + Pay Salary
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setTab("employees"); setCurrentPage(1); }} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === "employees" ? "bg-pink-600 text-white shadow-sm" : "bg-white border border-pink-100 text-gray-700 hover:bg-pink-50"}`}>
          Employees ({employees.length})
        </button>
        <button onClick={() => { setTab("salaries"); setCurrentPage(1); }} className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${tab === "salaries" ? "bg-pink-600 text-white shadow-sm" : "bg-white border border-pink-100 text-gray-700 hover:bg-pink-50"}`}>
          Salary Records ({salaries.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        {tab === "employees" ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 text-pink-800 text-xs uppercase font-bold">
                <th className="p-4">Staff Name</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Position</th>
                <th className="p-4">Base Salary</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {paginatedData.map((e: any) => (
                <tr key={e.id} className="hover:bg-pink-50/50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-xs">👤</div>
                    <div>
                      {e.name}
                      <span className="block text-xs font-normal text-gray-400">{e.email}</span>
                    </div>
                  </td>
                  <td className="p-4">{e.branch_name}</td>
                  <td className="p-4">{e.position}</td>
                  <td className="p-4">${Number(e.base_salary).toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteEmployee(e.id)} className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400 text-xs">No employees found.</td></tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50 text-pink-800 text-xs uppercase font-bold">
                <th className="p-4">Employee</th>
                <th className="p-4">Branch</th>
                <th className="p-4">Period</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {paginatedData.map((s: any) => (
                <tr key={s.id} className="hover:bg-pink-50/50 transition-colors">
                  <td className="p-4 font-semibold text-gray-900">{s.employee_name}</td>
                  <td className="p-4">{s.branch_name}</td>
                  <td className="p-4 font-mono text-xs">{s.period}</td>
                  <td className="p-4 font-bold text-green-600">${Number(s.amount).toFixed(2)}</td>
                  <td className="p-4">${Number(s.bonus).toFixed(2)}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400 text-xs">No salary payout records found.</td></tr>
              )}
            </tbody>
          </table>
        )}

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

      {/* Add Employee Modal */}
      {isEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-pink-100 bg-pink-50/40">
              <h2 className="text-base font-extrabold text-gray-900">Add New Employee Staff</h2>
              <button onClick={() => setIsEmpModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleEmpSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Full Name</label>
                <input type="text" required placeholder="John Doe" value={empForm.name} onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email</label>
                  <input type="email" required placeholder="john@store.com" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Password</label>
                  <input type="password" required placeholder="••••••••" value={empForm.password} onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Branch</label>
                  <select required value={empForm.branch_id} onChange={(e) => setEmpForm({ ...empForm, branch_id: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20">
                    <option value="">Select Branch</option>
                    {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Position</label>
                  <input type="text" required placeholder="Manager / Cashier" value={empForm.position} onChange={(e) => setEmpForm({ ...empForm, position: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Base Salary ($)</label>
                <input type="number" step="0.01" required placeholder="1200.00" value={empForm.base_salary} onChange={(e) => setEmpForm({ ...empForm, base_salary: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEmpModal(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50">Save Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {isSalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-pink-100 bg-pink-50/40">
              <h2 className="text-base font-extrabold text-gray-900">Process Salary Payout</h2>
              <button onClick={() => setIsSalModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">&times;</button>
            </div>

            <form onSubmit={handleSalSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {error && <div className="p-3 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Select Employee</label>
                <select required value={salForm.employee_id} onChange={(e) => {
                  const emp = employees.find(x => x.id == Number(e.target.value));
                  setSalForm({
                    ...salForm,
                    employee_id: e.target.value,
                    branch_id: emp ? emp.branch_id.toString() : "",
                    amount: emp ? emp.base_salary.toString() : "",
                  });
                }} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20">
                  <option value="">Select Employee</option>
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.position})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Period (YYYY-MM)</label>
                  <input type="text" required placeholder="2026-06" pattern="^[0-9]{4}-[0-9]{2}$" value={salForm.period} onChange={(e) => setSalForm({ ...salForm, period: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Bonus ($)</label>
                  <input type="number" step="0.01" value={salForm.bonus} onChange={(e) => setSalForm({ ...salForm, bonus: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Payout Amount ($)</label>
                <input type="number" step="0.01" required value={salForm.amount} onChange={(e) => setSalForm({ ...salForm, amount: e.target.value })} className="w-full px-3.5 py-2.5 text-sm border border-pink-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/20" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsSalModal(false)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50">Submit Payout</button>
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