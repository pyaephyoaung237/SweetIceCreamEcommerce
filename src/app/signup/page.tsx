"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();

    let newErrors = { name: "", email: "", password: "" };
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
      // Proceed with signup logic
      console.log("Form submitted successfully!");
    }
  };

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-pink-50/50 via-white to-pink-50/30">
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-pink-100 bg-white/80 p-8 shadow-xl backdrop-blur-xl sm:p-10">
        <div className="text-center space-y-2">
          <span className="inline-block rounded-full bg-pink-100 p-3 text-2xl text-pink-600 mb-1">🍦</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-display">Create an Account</h1>
          <p className="text-sm text-gray-500">Join IceBar and get sweet treats delivered!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600" htmlFor="name">Full Name</label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              placeholder="John Doe"
              className={`block w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.name ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`} 
            />
            {errors.name && <p className="text-xs font-medium text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600" htmlFor="email">Email Address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@example.com"
              className={`block w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.email ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`} 
            />
            {errors.email && <p className="text-xs font-medium text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              className={`block w-full rounded-xl border bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.password ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-pink-500 focus:ring-pink-500/20"
              }`} 
            />
            {errors.password && <p className="text-xs font-medium text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/25 hover:from-pink-700 hover:to-rose-600 active:scale-[0.98] transition-all mt-2"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="font-bold text-pink-600 hover:text-pink-700 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}