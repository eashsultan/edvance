"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, BookOpen, Users, ArrowRight, MessageCircle, CheckCircle, Star, ChevronRight } from "lucide-react";
import Link from "next/link";

// Edvance Icon Component matching the original SVG
const EdvanceIcon = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#0f172a" />
    <polygon points="16,6 26,11 16,15 6,11" fill="#ffffff" />
    <polygon points="16,15 26,11 26,14 16,18" fill="#c7d2fe" />
    <polygon points="16,15 6,11 6,14 16,18" fill="#818cf8" />
    <rect x="14.5" y="15" width="3" height="7" rx="1" fill="#ffffff" />
    <circle cx="16" cy="23" r="2" fill="#818cf8" />
    <line x1="24" y1="12" x2="24" y2="17" stroke="#c7d2fe" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="19" r="1.5" fill="#818cf8" />
  </svg>
);

// Count-up animation hook
const useCountUp = (target: number, duration: number = 2000, trigger: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);

  return count;
};

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const schoolsCount = useCountUp(12, 1800, isLoaded);
  const studentsCount = useCountUp(4800, 2200, isLoaded);
  const teachersCount = useCountUp(320, 2000, isLoaded);

  const portals = [
    {
      key: "admin",
      label: "Admin",
      sublabel: "Principal / School Manager",
      icon: <Shield className="w-7 h-7" />,
      desc: "Manage students, teachers, fees, results and announcements all in one place.",
      route: "/component/auth/admin",
      accent: "#3b82f6",
      accentBg: "rgba(59, 130, 246, 0.1)",
      accentBorder: "rgba(59, 130, 246, 0.3)",
      badge: "School Hub",
    },
    {
      key: "teacher",
      label: "Teacher",
      sublabel: "Class Teacher / Subject Teacher",
      icon: <BookOpen className="w-7 h-7" />,
      desc: "Enter results, take attendance, message parents and manage your classes.",
      route: "/component/auth/teacherLogin",
      accent: "#10b981",
      accentBg: "rgba(16, 185, 129, 0.1)",
      accentBorder: "rgba(16, 185, 129, 0.3)",
      badge: "Classroom",
    },
    {
      key: "parent",
      label: "Parent",
      sublabel: "Parent / Guardian",
      icon: <Users className="w-7 h-7" />,
      desc: "Track your child's results, attendance, fee payments and school updates.",
      route: "/component/auth/parentLogin",
      accent: "#8b5cf6",
      accentBg: "rgba(139, 92, 246, 0.1)",
      accentBorder: "rgba(139, 92, 246, 0.3)",
      badge: "Family",
    },
  ];

  const features = [
    {
      icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
      title: "Real-time Dashboard",
      desc: "Live stats on students, fees, attendance and performance",
    },
    {
      icon: <EdvanceIcon size={20} />,
      title: "Smart Results",
      desc: "Teacher submits → Admin approves → Parent sees instantly",
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
      title: "Built-in Messaging",
      desc: "Direct communication between admin, teachers and parents",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-blue-400" />,
      title: "Fee Tracking",
      desc: "Flutterwave-powered payments with full audit trail",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050e1f] text-white overflow-x-hidden font-sans">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="fixed -top-[200px] -left-[200px] w-[600px] height-[600px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)]" />
      <div className="fixed -bottom-[200px] -right-[200px] w-[600px] height-[600px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <EdvanceIcon size={32} />
            <span className="font-bold text-lg tracking-tight">edvance</span>
          </div>
          <button
            onClick={() => router.push("/component/auth/register")}
            className="text-xs font-semibold px-4 py-2 rounded-xl border border-white/20 hover:border-blue-400 hover:text-blue-400 bg-transparent text-white/70 cursor-pointer transition-all duration-200"
          >
            Register School
          </button>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs px-4 py-1.5 rounded-full mb-8 tracking-wider">
            <Star className="w-3 h-3 fill-current" />
            Nigeria's School Management Platform
          </div>

          <h1
            className={`font-serif text-4xl md:text-7xl font-bold leading-tight mb-6 transition-all duration-1000 transform ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Every school <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">deserves great management.</span>
          </h1>

          <p className="text-white/50 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
            One platform connecting school admins, teachers and parents. Results, fees, attendance, messaging — everything in sync.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/component/auth/register")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 shadow-lg shadow-blue-600/20"
            >
              Register Your School <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById("login-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 bg-transparent text-white/70 hover:text-white font-semibold text-sm px-7 py-3.5 rounded-2xl border border-white/15 hover:border-white/30 cursor-pointer transition-all duration-200"
            >
              I already have an account
            </button>
          </div>
        </section>

        {/* Counter Stats Section */}
        <section className="border-y border-white/5 py-12 bg-white/[0.01]">
          <div className="max-w-3xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-1">{schoolsCount}+</p>
              <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest">Schools</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-1">{studentsCount}+</p>
              <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest">Students</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold mb-1">{teachersCount}+</p>
              <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-widest">Teachers</p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 max-w-5xl mx-auto w-full">
          <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-3">Platform Features</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-12">Built for Nigerian schools</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-sm mb-2">{feature.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Portals Access Section */}
        <section id="login-section" className="py-20 px-6 max-w-5xl mx-auto w-full">
          <p className="text-white/30 text-xs uppercase tracking-widest text-center mb-3">Access Portal</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-2">Who are you logging in as?</h2>
          <p className="text-white/40 text-sm text-center mb-12 max-w-md mx-auto">Select your role to go to the correct login page</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portals.map((portal) => (
              <button
                key={portal.key}
                onClick={() => router.push(portal.route)}
                className="text-left bg-white/5 border border-white/10 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.08]"
                style={{
                  borderImageSource: `linear-gradient(to bottom, ${portal.accent}33, transparent)`,
                }}
              >
                <span
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full mb-5 inline-block"
                  style={{ backgroundColor: portal.accentBg, color: portal.accent }}
                >
                  {portal.badge}
                </span>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: portal.accentBg, color: portal.accent }}
                >
                  {portal.icon}
                </div>

                <h3 className="text-lg font-bold mb-1">{portal.label}</h3>
                <p className="text-white/40 text-xs mb-3">{portal.sublabel}</p>
                <p className="text-white/50 text-xs leading-relaxed mb-6">{portal.desc}</p>

                <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: portal.accent }}>
                  Log in as {portal.label} <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Ready to Register CTA */}
        <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
          <div className="rounded-3xl border border-blue-500/20 p-12 text-center relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent_60%)]" />
            <div className="relative z-10">
              <h2 className="font-serif text-xl md:text-2xl font-bold mb-3">Ready to bring your school online?</h2>
              <p className="text-white/50 text-xs md:text-sm mb-8 max-w-sm mx-auto">
                Registration takes less than 2 minutes. Your school code is generated instantly.
              </p>
              <button
                onClick={() => router.push("/component/auth/register")}
                className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs md:text-sm px-6 py-3 rounded-xl cursor-pointer transition-all duration-200"
              >
                Register Your School — It's Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center bg-white/[0.005]">
          <p className="text-white/20 text-xs">© 2026 Edvance · Built for Nigerian Schools</p>
        </footer>
      </div>
    </div>
  );
}
