"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();

    let newErrors = { email: "", password: "", general: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email address is required.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setLoading(true);
      try {
        // 1. Call your backend login API route
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors((prev) => ({
            ...prev,
            general: data.error || "Invalid email or password",
          }));
          setLoading(false);
          return;
        }

        // 2. Success! Redirect user to admin or home page
        window.location.href = data.redirect;
      } catch (err) {
        console.error("Login error:", err);
        setErrors((prev) => ({
          ...prev,
          general: "Something went wrong. Please try again.",
        }));
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="text-center space-y-1.5">
          <span className="inline-block rounded-full bg-pink-100 p-2 text-xl text-pink-600">🍦</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-display">Welcome Back</h1>
          <p className="text-xs text-gray-500">Sign in to manage your ice cream orders</p>
        </div>

        {errors.general && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-xs font-medium text-red-600 border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              className={`block w-full rounded-xl border bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`} 
            />
            {errors.email && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600" htmlFor="password">Password</label>
              <Link href="/forgot-password" className="text-[11px] font-medium text-pink-600 hover:underline">Forgot?</Link>
            </div>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              className={`block w-full rounded-xl border bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`} 
            />
            {errors.password && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 active:scale-[0.98] transition-all mt-1 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have an account? <Link href="/signup" className="font-bold text-pink-600 hover:text-pink-700 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}