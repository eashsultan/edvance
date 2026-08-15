"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import {
  BookOpen,
  Users,
  FileSpreadsheet,
  MessageCircle,
  LogOut,
  Plus,
  Send,
  Building,
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const {
    school,
    students,
    grades,
    submitGrade,
    messages,
    sendMessage,
    currentUser,
    logout,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"class" | "grades" | "messages">("class");

  // Auth check
  useEffect(() => {
    if (!currentUser.role || currentUser.role !== "teacher") {
      router.push("/component/auth/teacherLogin");
    }
  }, [currentUser, router]);

  // Mrs Ngozi teaches JSS 1
  const assignedClass = "JSS 1";
  const teacherSubject = "Mathematics";
  const classStudents = students.filter((s) => s.class === assignedClass);

  // Grade Form State
  const [selectedStudent, setSelectedStudent] = useState("");
  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [term, setTerm] = useState("First Term");

  // Chat Form State
  const [chatParentEmail, setChatParentEmail] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !caScore || !examScore) return;

    const studentObj = students.find((s) => s.id === selectedStudent);
    if (!studentObj) return;

    const ca = parseFloat(caScore);
    const exam = parseFloat(examScore);

    if (ca > 40 || exam > 60) {
      alert("CA score cannot exceed 40 and Exam score cannot exceed 60.");
      return;
    }

    submitGrade({
      studentId: studentObj.id,
      studentName: studentObj.name,
      subject: teacherSubject,
      class: assignedClass,
      caScore: ca,
      examScore: exam,
      term,
    });

    setCaScore("");
    setExamScore("");
    alert("Term score submitted to school admin for approval!");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatParentEmail || !chatMessage) return;

    const studentObj = students.find((s) => s.parentEmail === chatParentEmail);
    const parentName = studentObj ? studentObj.parentName : "Parent";

    sendMessage({
      sender: `Mrs. Ngozi Ezenwa (${teacherSubject})`,
      recipient: `Parent: ${parentName}`,
      text: chatMessage,
    });

    setChatMessage("");
    alert("Feedback sent to parent!");
  };

  return (
    <div className="flex min-h-screen bg-[#050e1f] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/60 border-r border-white/5 flex flex-col p-6 z-10">
        <div className="flex items-center gap-3 mb-10">
          <Building className="w-8 h-8 text-emerald-500" />
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none mb-1">edvance</h1>
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Teacher Panel</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("class")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "class" ? "bg-emerald-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" /> My Classroom ({assignedClass})
          </button>
          <button
            onClick={() => setActiveTab("grades")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "grades" ? "bg-emerald-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Record Term Grades
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTab === "messages" ? "bg-emerald-600 text-white" : "text-white/60 hover:bg-white/5"
            }`}
          >
            <MessageCircle className="w-4 h-4" /> Parents Messaging
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
            <p className="text-xs text-white/50 mt-0.5">Welcome, {currentUser.name || "Teacher"}</p>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs font-semibold text-white/80">
            Subject: {teacherSubject} ({assignedClass})
          </div>
        </header>

        {activeTab === "class" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
            <h3 className="font-bold text-base mb-2 font-serif">Classroom Students Directory</h3>
            <p className="text-white/40 text-xs mb-6">List of students currently registered under your form class JSS 1</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Student Name</th>
                    <th className="py-3 px-2">Admission No</th>
                    <th className="py-3 px-2">Parent Name</th>
                    <th className="py-3 px-2">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((std) => (
                    <tr key={std.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-2 font-mono text-white/50">{std.id}</td>
                      <td className="py-3 px-2 font-bold">{std.name}</td>
                      <td className="py-3 px-2 font-mono">{std.rollNumber}</td>
                      <td className="py-3 px-2">{std.parentName}</td>
                      <td className="py-3 px-2 font-semibold text-emerald-400">{std.attendanceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "grades" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-base mb-4 font-serif flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-500" /> Record Marks
              </h3>
              <form onSubmit={handleGradeSubmit} className="flex flex-col gap-3 text-sm">
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Select Student</label>
                  <select
                    required
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Student --</option>
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Term</label>
                  <select
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>First Term</option>
                    <option>Second Term</option>
                    <option>Third Term</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Continuous Assessment (CA) Score (Max 40)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={40}
                    value={caScore}
                    onChange={(e) => setCaScore(e.target.value)}
                    placeholder="e.g. 28"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Exam Score (Max 60)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={60}
                    value={examScore}
                    onChange={(e) => setExamScore(e.target.value)}
                    placeholder="e.g. 52"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl mt-2 transition cursor-pointer"
                >
                  Submit Scores
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-4 font-serif">Mathematics Grades Ledger</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                      <th className="py-3 px-2">Student Name</th>
                      <th className="py-3 px-2">Term</th>
                      <th className="py-3 px-2">CA (40)</th>
                      <th className="py-3 px-2">Exam (60)</th>
                      <th className="py-3 px-2">Total Score</th>
                      <th className="py-3 px-2">Grade</th>
                      <th className="py-3 px-2">Approval Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades
                      .filter((g) => g.subject === teacherSubject && g.class === assignedClass)
                      .map((grade) => (
                        <tr key={grade.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-3 px-2 font-bold">{grade.studentName}</td>
                          <td className="py-3 px-2">{grade.term}</td>
                          <td className="py-3 px-2 font-mono">{grade.caScore}</td>
                          <td className="py-3 px-2 font-mono">{grade.examScore}</td>
                          <td className="py-3 px-2 font-bold font-mono">{grade.total}%</td>
                          <td className="py-3 px-2 font-bold text-blue-400 font-mono">{grade.grade}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                grade.approved
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-amber-500/20 text-amber-400"
                              }`}
                            >
                              {grade.approved ? "Approved" : "Awaiting Approval"}
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

        {activeTab === "messages" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-base mb-4 font-serif flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-500" /> Send Parent Message
              </h3>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-3 text-sm">
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Select Parent</label>
                  <select
                    required
                    value={chatParentEmail}
                    onChange={(e) => setChatParentEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choose Parent --</option>
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.parentEmail}>
                        {s.parentName} (Parent of {s.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-[11px] block mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Enter academic feedback or notice..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl mt-2 transition cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-base mb-4 font-serif">Message Logs</h3>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
                {messages
                  .filter((m) => m.sender.includes("Ngozi") || m.recipient.includes("Mrs. Ngozi"))
                  .map((msg) => (
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
          </div>
        )}
      </main>
    </div>
  );
}
