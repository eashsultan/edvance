"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterSchool() {
  const router = useRouter();
  const { registerSchool } = useAppState();

  const [schoolName, setSchoolName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !adminName || !email || !password) {
      setError("Please fill in all required fields (*)");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      registerSchool({
        name: schoolName,
        phone,
        address,
        adminName,
        adminEmail: email,
      });
      router.push("/dashboard/admin");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg text-black">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl hover:bg-gray-100 text-black mr-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
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
            <h1 className="text-lg font-bold text-black">Register Your School</h1>
            <p className="text-xs text-gray-500">Set up your school management system</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* School Details */}
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">School Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-600 mb-1 block font-semibold">School Name *</label>
              <input
                type="text"
                placeholder="e.g. Greenfield Academy"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block font-semibold">Phone</label>
              <input
                type="text"
                placeholder="+234..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block font-semibold">Address</label>
              <input
                type="text"
                placeholder="School address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Admin Admin Account */}
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Account</p>
          <p className="text-xs text-gray-500 mb-3">This will be your admin login credentials</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div>
              <label className="text-xs text-gray-600 mb-1 block font-semibold">Full Name *</label>
              <input
                type="text"
                placeholder="Your full name"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block font-semibold">Email *</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 relative">
              <label className="text-xs text-gray-600 mb-1 block font-semibold">
                Password * <span className="text-gray-400">(min 6 characters)</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl text-black p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-black cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 font-semibold py-3 rounded-2xl transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Registering...
              </>
            ) : (
              "Register School"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          Already registered?{" "}
          <button
            onClick={() => router.push("/component/auth/admin")}
            className="text-blue-500 hover:underline font-medium cursor-pointer"
          >
            Admin Login
          </button>
        </p>
      </div>
    </div>
  );
}
