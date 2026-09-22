"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    general: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const phone = (formData.get("phone") as string).trim();
    const password = (formData.get("password") as string).trim();

    let newErrors = { name: "", email: "", phone: "", password: "", general: "" };
    let isValid = true;

    if (!name) {
      newErrors.name = "Full name is required.";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email address is required.";
      isValid = false;
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrors((prev) => ({
            ...prev,
            general: data.error || "Failed to create account.",
          }));
          setLoading(false);
          return;
        }

        // Success! Redirect to login page
        router.push("/login");
      } catch (err) {
        console.error("Signup error:", err);
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
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-display">Create an Account</h1>
          <p className="text-xs text-gray-500">Join IceBar and get sweet treats delivered!</p>
        </div>

        {errors.general && (
          <div className="rounded-xl bg-red-50 p-3 text-center text-xs font-medium text-red-600 border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="John Doe"
              className={`block w-full rounded-xl border bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`} 
            />
            {errors.name && <p className="text-[11px] font-medium text-red-500 mt-0.5">{errors.name}</p>}
          </div>

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
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600" htmlFor="phone">Phone Number</label>
            <input 
              id="phone" 
              name="phone" 
              type="tel" 
              placeholder="09XXXXXXXXX"
              className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all" 
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600" htmlFor="password">Password</label>
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
            className="w-full rounded-xl bg-pink-600 py-3 text-xs font-bold text-white shadow-md shadow-pink-500/25 hover:bg-pink-700 active:scale-[0.98] transition-all mt-1 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account? <Link href="/login" className="font-bold text-pink-600 hover:text-pink-700 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}