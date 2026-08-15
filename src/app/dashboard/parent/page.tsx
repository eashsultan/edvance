"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import {
  Users,
  CreditCard,
  FileCheck,
  Bell,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Building,
  CheckCircle,
} from "lucide-react";

export default function ParentDashboard() {
  const router = useRouter();
  const {
    school,
    students,
    invoices,
    payInvoice,
    grades,
    messages,
    currentUser,
    logout,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"child" | "fees" | "results" | "notices">("child");

  // Auth check
  useEffect(() => {
    if (!currentUser.role || currentUser.role !== "parent") {
      router.push("/component/auth/parentLogin");
    }
  }, [currentUser, router]);

  // Find parent's children (e.g. Chinedu Okafor is the child of Adebayo Okafor)
  const child = students.find((s) => s.parentEmail === currentUser.email) || students[0];

  const childInvoices = invoices.filter((i) => i.studentId === child?.id);
  const childGrades = grades.filter((g) => g.studentId === child?.id && g.approved);
  const childNotices = messages.filter(
    (m) => m.recipient === "All Parents" || m.recipient === `Parent: ${currentUser.name}`
  );

  // Flutterwave Mock Gateway state
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [cardNo, setCardNo] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const handleMockPay = (invoice: any) => {
    setSelectedInvoice(invoice);
    setCardNo("");
    setCardExpiry("");
    setCardCvv("");
    setPaySuccess(false);
  };

  const executeMockPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNo || !cardExpiry || !cardCvv) return;

    setPaying(true);

    setTimeout(() => {
      setPaying(false);
      setPaySuccess(true);
      setTimeout(() => {
        payInvoice(selectedInvoice.id, "FLW-MOCK-" + Math.floor(Math.random() * 900000 + 100000));
        setSelectedInvoice(null);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#050e1f] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/60 border-r border-white/5 flex flex-col p-6 z-10">
        <div className="flex items-center gap-3 mb-10">
          <Building className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none mb-1">edvance</h1>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Parent Portal</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("child")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "child" ? "bg-purple-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" /> My Child Info
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "fees" ? "bg-purple-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Fee Payments
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "results" ? "bg-purple-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <FileCheck className="w-4 h-4" /> Reports & Grades
          </button>
          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer relative ${
              activeTab === "notices" ? "bg-purple-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Bell className="w-4 h-4" /> Notices & Inbox
            {childNotices.length > 0 && (
              <span className="absolute right-3 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {childNotices.length}
              </span>
            )}
          </button>
        </nav>

        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition mt-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-serif">{school?.name || "School Hub"}</h2>
            <p className="text-xs text-white/50 mt-0.5">Parent Portal: {currentUser.name || "Guardian"}</p>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-white/80">
            Student ID: {child?.id}
          </div>
        </header>

        {activeTab === "child" && child && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-base mb-6 font-serif">Academic Profile Overview</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Student</p>
                  <h4 className="text-lg font-bold">{child.name}</h4>
                  <p className="text-xs text-white/50 font-mono mt-0.5">Admission No: {child.rollNumber}</p>
                </div>
                <div className="border-t border-white/10 mt-6 pt-4 flex justify-between text-xs">
                  <div>
                    <p className="text-white/40 mb-0.5">Class</p>
                    <p className="font-bold">{child.class}</p>
                  </div>
                  <div>
                    <p className="text-white/40 mb-0.5">School Code</p>
                    <p className="font-bold">{school?.id}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Academic Status</p>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-4xl font-bold text-emerald-400">{child.attendanceRate}%</p>
                    <p className="text-xs text-white/50 mt-1">Term Attendance</p>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div>
                    <p className="text-4xl font-bold text-blue-400">
                      ₦{(child.feesTotal - child.feesPaid).toLocaleString()}
                    </p>
                    <p className="text-xs text-white/50 mt-1">Outstanding Invoices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-base mb-6 font-serif">Fee Invoices & Receipts</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                    <th className="py-3 px-2">Invoice ID</th>
                    <th className="py-3 px-2">Bill Type</th>
                    <th className="py-3 px-2">Amount</th>
                    <th className="py-3 px-2">Due Date</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {childInvoices.map((inv) => (
                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 font-mono text-white/50">{inv.id}</td>
                      <td className="py-3 px-2 font-bold">{inv.type}</td>
                      <td className="py-3 px-2 font-semibold">₦{inv.amount.toLocaleString()}</td>
                      <td className="py-3 px-2 text-white/50">{inv.dueDate}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "Paid" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {inv.status === "Unpaid" ? (
                          <button
                            onClick={() => handleMockPay(inv)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition font-semibold"
                          >
                            Pay Online
                          </button>
                        ) : (
                          <span className="text-[10px] text-white/30 font-mono">Ref: {inv.reference}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-base mb-2 font-serif">Report Card & Results</h3>
            <p className="text-white/40 text-xs mb-6">Approved terminal marks submitted by subjects teachers</p>

            {childGrades.length === 0 ? (
              <div className="text-white/40 text-xs flex items-center gap-2 py-6">
                <ShieldAlert className="w-5 h-5 text-amber-500" /> Terminal report sheets are currently locked or awaiting approval.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                      <th className="py-3 px-2">Subject</th>
                      <th className="py-3 px-2">Term</th>
                      <th className="py-3 px-2">CA (40)</th>
                      <th className="py-3 px-2">Exam (60)</th>
                      <th className="py-3 px-2">Total Score</th>
                      <th className="py-3 px-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childGrades.map((grade) => (
                      <tr key={grade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-bold">{grade.subject}</td>
                        <td className="py-3 px-2">{grade.term}</td>
                        <td className="py-3 px-2 font-mono">{grade.caScore}</td>
                        <td className="py-3 px-2 font-mono">{grade.examScore}</td>
                        <td className="py-3 px-2 font-bold font-mono text-emerald-400">{grade.total}%</td>
                        <td className="py-3 px-2 font-bold text-blue-400 font-mono">{grade.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "notices" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-base mb-6 font-serif">Notice Board & teacher messages</h3>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
              {childNotices.map((msg) => (
                <div key={msg.id} className="bg-white/5 border border-white/5 p-4 rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-2 text-white/40 font-semibold text-[10px]">
                    <span>From: {msg.sender}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Flutterwave Mock Portal Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#12122c] border border-orange-500/20 text-white rounded-3xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 text-white/60 hover:text-white cursor-pointer text-xs uppercase"
            >
              Cancel
            </button>

            {/* Flutterwave Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center font-bold text-black text-xs">
                F
              </span>
              <h4 className="font-semibold text-sm tracking-wide">
                flutterwave <span className="text-orange-400 text-xs font-bold">MOCK GATEWAY</span>
              </h4>
            </div>

            {paySuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce mb-3" />
                <h5 className="font-bold text-base">Payment Successful!</h5>
                <p className="text-xs text-white/50 mt-1">Simulating billing audit clearance...</p>
              </div>
            ) : (
              <form onSubmit={executeMockPayment}>
                <div className="bg-white/5 p-4 rounded-2xl mb-5 text-xs">
                  <p className="text-white/40 uppercase text-[9px] tracking-wider mb-1">Paying bill</p>
                  <p className="font-bold text-sm">{selectedInvoice.type}</p>
                  <p className="text-orange-400 font-bold text-base mt-2">
                    ₦{selectedInvoice.amount.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div>
                    <label className="text-white/40 text-[10px] block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/40 text-[10px] block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-[10px] block mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={paying}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl text-xs mt-4 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Transacting Secures...
                      </>
                    ) : (
                      `Pay ₦${selectedInvoice.amount.toLocaleString()}`
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
