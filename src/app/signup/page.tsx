"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "../components/AuthShell";
import AuthField from "../components/AuthField";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", phone: "", password: "", general: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = ((formData.get("name") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim();
    const phone = ((formData.get("phone") as string) || "").trim();
    const password = (formData.get("password") as string) || ""; // not trimmed: must match login

    const newErrors = { name: "", email: "", phone: "", password: "", general: "" };
    if (!name) newErrors.name = "Full name is required.";
    if (!email) newErrors.email = "Email address is required.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email address.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.password) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(prev => ({ ...prev, general: data.error || "Failed to create account." }));
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setErrors(prev => ({ ...prev, general: "Something went wrong. Please try again." }));
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="text-center space-y-2 mb-6">
        <span className="inline-block rounded-full bg-pink-100 p-2.5 text-2xl">🍦</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">Create an account</h1>
        <p className="text-sm text-gray-500">Join SweetIce and get sweet treats delivered</p>
      </div>

      {errors.general && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-center text-sm font-medium text-red-600 border border-red-200">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField id="name" label="Full name" placeholder="John Doe" autoComplete="name" error={errors.name} />
        <AuthField id="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" error={errors.email} />
        <AuthField id="phone" label="Phone number (optional)" type="tel" placeholder="09XXXXXXXXX" autoComplete="tel" error={errors.phone} />
        <AuthField id="password" label="Password" type="password" placeholder="At least 6 characters" autoComplete="new-password" error={errors.password} />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-pink-600 py-3.5 text-base font-bold text-white shadow-md shadow-pink-500/25 hover:bg-pink-700 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-pink-600 hover:underline">Log in</Link>
      </p>
    </AuthShell>
  );
}