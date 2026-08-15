"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function TeacherLogin() {
  const router = useRouter();
  const { setCurrentUser } = useAppState();

  const [email, setEmail] = useState("teacher@school.com");
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
      setCurrentUser({
        role: "teacher",
        email: email,
        name: "Mrs. Ngozi Ezenwa",
      });
      router.push("/dashboard/teacher");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 text-black">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={() => router.push("/")}
          className="p-2 rounded-xl hover:bg-gray-100 text-black mr-1 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#0f172a" />
              <polygon points="16,6 26,11 16,15 6,11" fill="#ffffff" />
              <polygon points="16,15 26,11 26,14 16,18" fill="#c7d2fe" />
              <polygon points="16,15 6,11 6,14 16,18" fill="#818cf8" />
              <rect x="14.5" y="15" width="3" height="7" rx="1" fill="#ffffff" />
              <circle cx="16" cy="23" r="2" fill="#818cf8" />
              <line x1="24" y1="12" x2="24" y2="17" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="24" cy="19" r="1.5" fill="#818cf8" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">Teacher Login</h1>
            <p className="text-xs text-gray-400">Welcome back — sign in to continue</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 mb-6">
            <div>
              <label className="text-xs text-black mb-1 block">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none text-black focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <label className="text-xs text-black mb-1 block">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 text-black focus:ring-green-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-black cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
