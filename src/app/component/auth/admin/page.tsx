"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const { setCurrentUser } = useAppState();

  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      // Allow any login for mock prototype, but standard defaults exist
      setCurrentUser({
        role: "admin",
        email: email,
        name: "Principal Davies",
      });
      router.push("/dashboard/admin");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 text-black">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl hover:bg-gray-100 text-black mr-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#0f172a" />
            <polygon points="16,6 26,11 16,15 6,11" fill="#ffffff" />
            <polygon points="16,15 26,11 26,14 16,18" fill="#c7d2fe" />
            <polygon points="16,15 6,11 6,14 16,18" fill="#818cf8" />
            <rect x="14.5" y="15" width="3" height="7" rx="1" fill="#ffffff" />
            <circle cx="16" cy="23" r="2" fill="#818cf8" />
            <line x1="24" y1="12" x2="24" y2="17" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="24" cy="19" r="1.5" fill="#818cf8" />
          </svg>
          <span className="mt-3 text-xl font-bold text-gray-900 tracking-tight">edvance</span>
          <span className="text-[10px] font-semibold text-indigo-500 tracking-widest uppercase mt-0.5">
            School Management
          </span>
        </div>

        <h2 className="text-2xl font-bold text-black mb-1">Welcome back</h2>
        <p className="text-xs text-gray-400 mb-8">Sign in to your admin account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-black mb-1 block">Email</label>
            <input
              type="email"
              placeholder="admin@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-black mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none text-black focus:ring-2 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
