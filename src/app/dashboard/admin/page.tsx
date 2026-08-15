"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  MessageSquare,
  LogOut,
  Plus,
  Check,
  AlertCircle,
  Building,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    school,
    students,
    addStudent,
    teachers,
    addTeacher,
    invoices,
    addInvoice,
    grades,
    approveGrade,
    messages,
    sendMessage,
    currentUser,
    logout,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"overview" | "students" | "teachers" | "fees" | "results" | "messages">("overview");

  // Auth check
  useEffect(() => {
    if (!currentUser.role || currentUser.role !== "admin") {
      router.push("/component/auth/admin");
    }
  }, [currentUser, router]);

  // Form states
  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentClass, setStudentClass] = useState("JSS 1");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [teacherClass, setTeacherClass] = useState("JSS 1");

  const [feeAmount, setFeeAmount] = useState("");
  const [feeType, setFeeType] = useState("Tuition Fee");
  const [feeStudent, setFeeStudent] = useState("");

  const [broadcastMsg, setBroadcastMsg] = useState("");

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !rollNo || !parentEmail || !parentName) return;
    addStudent({
      name: studentName,
      rollNumber: rollNo,
      class: studentClass,
      parentEmail,
      parentName,
    });
    setStudentName("");
    setRollNo("");
    setParentName("");
    setParentEmail("");
    alert("Student added successfully!");
  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !teacherEmail || !teacherSubject) return;
    addTeacher({
      name: teacherName,
      email: teacherEmail,
      subject: teacherSubject,
      class: teacherClass,
    });
    setTeacherName("");
    setTeacherEmail("");
    setTeacherSubject("");
    alert("Teacher added successfully!");
  };

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeAmount || !feeStudent) return;
    const studentObj = students.find((s) => s.id === feeStudent);
    if (!studentObj) return;

    addInvoice({
      studentId: studentObj.id,
      studentName: studentObj.name,
      amount: parseFloat(feeAmount),
      type: feeType,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setFeeAmount("");
    alert("Invoice generated!");
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    sendMessage({
      sender: "Admin",
      recipient: "All Parents",
      text: broadcastMsg,
    });
    setBroadcastMsg("");
    alert("Broadcast message sent to all parents!");
  };

  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingRevenue = invoices.filter((i) => i.status === "Unpaid").reduce((acc, curr) => acc + curr.amount, 0);
  const unapprovedGrades = grades.filter((g) => !g.approved);

  return (
    <div className="flex min-h-screen bg-[#050e1f] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/60 border-r border-white/5 flex flex-col p-6 z-10">
        <div className="flex items-center gap-3 mb-10">
          <Building className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none mb-1">edvance</h1>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "overview" ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "students" ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" /> Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("teachers")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "teachers" ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <UserCheck className="w-4 h-4" /> Teachers ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "fees" ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Fees & Billing
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer relative ${
              activeTab === "results" ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Check className="w-4 h-4" /> Approve Results
            {unapprovedGrades.length > 0 && (
              <span className="absolute right-3 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unapprovedGrades.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "messages" ? "bg-blue-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Announcements
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

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-serif">{school?.name || "School Hub"}</h2>
            <p className="text-xs text-white/50 mt-0.5">Welcome, {currentUser.name || "Administrator"}</p>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-white/80">
            School Code: {school?.id}
          </div>
        </header>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Grid Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Total Teachers</p>
                <p className="text-3xl font-bold">{teachers.length}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Fees Collected</p>
                <p className="text-3xl font-bold text-emerald-400">₦{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">Outstanding Fees</p>
                <p className="text-3xl font-bold text-rose-400">₦{pendingRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Quick Actions & Recent Updates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4 font-serif">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab("students")}
                    className="p-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-semibold text-center cursor-pointer transition"
                  >
                    Add Student Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("teachers")}
                    className="p-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold text-center cursor-pointer transition"
                  >
                    Add Teacher Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("fees")}
                    className="p-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-semibold text-center cursor-pointer transition"
                  >
                    Create Fee Invoices
                  </button>
                  <button
                    onClick={() => setActiveTab("messages")}
                    className="p-4 bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-500/20 rounded-xl text-xs font-semibold text-center cursor-pointer transition"
                  >
                    Post Announcement
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4 font-serif">Unapproved Term Results</h3>
                {unapprovedGrades.length === 0 ? (
                  <div className="text-white/40 text-sm flex items-center gap-2 py-6">
                    <AlertCircle className="w-5 h-5 text-emerald-500" /> All submitted grades have been approved.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto">
                    {unapprovedGrades.map((g) => (
                      <div
                        key={g.id}
                        className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 text-xs"
                      >
                        <div>
                          <p className="font-bold">{g.studentName}</p>
                          <p className="text-white/50 text-[10px]">
                            {g.subject} · {g.class} · CA: {g.caScore} Exam: {g.examScore}
                          </p>
                        </div>
                        <button
                          onClick={() => approveGrade(g.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
                        >
                          Approve ({g.total}%)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-base mb-4 font-serif flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" /> Add New Student
              </h3>
              <form onSubmit={handleAddStudent} className="flex flex-col gap-3 text-sm">
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Chukwuma Obi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Roll / Admission Number</label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. EDV/2026/088"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Class</label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>JSS 1</option>
                    <option>JSS 2</option>
                    <option>JSS 3</option>
                    <option>SSS 1</option>
                    <option>SSS 2</option>
                    <option>SSS 3</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Parent Name</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Mr. Kola Obi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Parent Email</label>
                  <input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl mt-2 transition cursor-pointer"
                >
                  Create Profile
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-4 font-serif">Registered Students</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Class</th>
                      <th className="py-3 px-2">Parent Contact</th>
                      <th className="py-3 px-2">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-mono text-white/50">{student.id}</td>
                        <td className="py-3 px-2 font-bold">{student.name}</td>
                        <td className="py-3 px-2">{student.class}</td>
                        <td className="py-3 px-2">
                          <p className="font-semibold text-white/80">{student.parentName}</p>
                          <p className="text-[10px] text-white/40">{student.parentEmail}</p>
                        </td>
                        <td className="py-3 px-2 font-semibold text-emerald-400">{student.attendanceRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "teachers" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-base mb-4 font-serif flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" /> Add New Teacher
              </h3>
              <form onSubmit={handleAddTeacher} className="flex flex-col gap-3 text-sm">
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="e.g. Mr. Yusuf Alao"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    placeholder="teacher@school.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Primary Subject</label>
                  <input
                    type="text"
                    required
                    value={teacherSubject}
                    onChange={(e) => setTeacherSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Class Assigned</label>
                  <select
                    value={teacherClass}
                    onChange={(e) => setTeacherClass(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>JSS 1</option>
                    <option>JSS 2</option>
                    <option>JSS 3</option>
                    <option>SSS 1</option>
                    <option>SSS 2</option>
                    <option>SSS 3</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl mt-2 transition cursor-pointer"
                >
                  Register Teacher
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-4 font-serif">Teaching Staff</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Teacher</th>
                      <th className="py-3 px-2">Email</th>
                      <th className="py-3 px-2">Subject Assigned</th>
                      <th className="py-3 px-2">Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-mono text-white/50">{teacher.id}</td>
                        <td className="py-3 px-2 font-bold">{teacher.name}</td>
                        <td className="py-3 px-2">{teacher.email}</td>
                        <td className="py-3 px-2 font-semibold text-blue-400">{teacher.subject}</td>
                        <td className="py-3 px-2">{teacher.class}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "fees" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-base mb-4 font-serif flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-500" /> Create Fee Invoice
              </h3>
              <form onSubmit={handleAddInvoice} className="flex flex-col gap-3 text-sm">
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Select Student</label>
                  <select
                    required
                    value={feeStudent}
                    onChange={(e) => setFeeStudent(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.class})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Fee Type / Label</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Tuition Fee</option>
                    <option>Exam Fee</option>
                    <option>Sports Uniform</option>
                    <option>Textbooks Package</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    required
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl mt-2 transition cursor-pointer"
                >
                  Generate Invoice
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-4 font-serif">Invoices & Auditing</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                      <th className="py-3 px-2">Invoice ID</th>
                      <th className="py-3 px-2">Student</th>
                      <th className="py-3 px-2">Fee Type</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Due Date</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-mono text-white/50">{inv.id}</td>
                        <td className="py-3 px-2 font-bold">{inv.studentName}</td>
                        <td className="py-3 px-2">{inv.type}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-base mb-2 font-serif">Grades Approvals Queue</h3>
            <p className="text-white/40 text-xs mb-6">Submitted student grades and terminal marks requiring admin signature</p>

            {grades.length === 0 ? (
              <p className="text-white/40 text-sm">No grades recorded in system.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                      <th className="py-3 px-2">Student</th>
                      <th className="py-3 px-2">Subject</th>
                      <th className="py-3 px-2">Class</th>
                      <th className="py-3 px-2">CA (40)</th>
                      <th className="py-3 px-2">Exam (60)</th>
                      <th className="py-3 px-2">Total Score</th>
                      <th className="py-3 px-2">Grade</th>
                      <th className="py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3 px-2 font-bold">{grade.studentName}</td>
                        <td className="py-3 px-2">{grade.subject}</td>
                        <td className="py-3 px-2">{grade.class}</td>
                        <td className="py-3 px-2 font-mono">{grade.caScore}</td>
                        <td className="py-3 px-2 font-mono">{grade.examScore}</td>
                        <td className="py-3 px-2 font-bold font-mono">{grade.total}%</td>
                        <td className="py-3 px-2 font-bold text-blue-400 font-mono">{grade.grade}</td>
                        <td className="py-3 px-2">
                          {grade.approved ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => approveGrade(grade.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg cursor-pointer transition"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-base mb-4 font-serif flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-500" /> Send Announcement
              </h3>
              <form onSubmit={handleBroadcast} className="flex flex-col gap-3 text-sm">
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Target Recipients</label>
                  <input
                    type="text"
                    disabled
                    value="All Parents & Guardians"
                    className="w-full bg-white/5 border border-white/5 rounded-xl p-2.5 text-white/50 text-xs"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Message Notice Content</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="e.g. School resumes next Monday. Please ensure students have complete notebooks."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 rounded-xl mt-2 transition cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-4 font-serif">Sent Messages Log</h3>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                {messages
                  .filter((m) => m.sender === "Admin")
                  .map((msg) => (
                    <div key={msg.id} className="bg-white/5 border border-white/5 p-4 rounded-xl text-xs">
                      <div className="flex justify-between items-center mb-2 text-white/40 font-semibold text-[10px]">
                        <span>To: {msg.recipient}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="text-white/80 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
