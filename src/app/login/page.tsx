"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "../components/AuthShell";
import AuthField from "../components/AuthField";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = ((formData.get("email") as string) || "").trim();
    const password = (formData.get("password") as string) || ""; // not trimmed: must match signup

    const newErrors = { email: "", password: "", general: "" };
    if (!email) newErrors.email = "Email address is required.";
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(prev => ({ ...prev, general: data.error || "Invalid email or password" }));
        setLoading(false);
        return;
      }

      // Full reload so the navbar picks up the new session
      window.location.href = data.redirect || "/";
    } catch (err) {
      console.error("Login error:", err);
      setErrors(prev => ({ ...prev, general: "Something went wrong. Please try again." }));
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="text-center space-y-2 mb-6">
        <span className="inline-block rounded-full bg-pink-100 p-2.5 text-2xl">🍦</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">Welcome back</h1>
        <p className="text-sm text-gray-500">Log in to order your favourite ice cream</p>
      </div>

      {errors.general && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-200">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField id="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email} />
        <AuthField
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password}
          action={<Link href="/forgot-password" className="text-xs font-medium text-pink-600 hover:underline">Forgot password?</Link>}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3.5 text-base font-bold text-white shadow-md shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        New to SweetIce?{" "}
        <Link href="/signup" className="font-bold text-pink-600 hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}