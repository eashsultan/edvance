"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/StateContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  Banknote,
  Users2,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Search,
  Check,
  Send,
  Loader2,
  DollarSign,
  AlertCircle,
  FolderSync,
} from "lucide-react";

export default function AdminPortal() {
  const router = useRouter();
  const {
    school,
    updateSchool,
    students,
    addStudent,
    removeStudent,
    teachers,
    addTeacher,
    removeTeacher,
    payTeacherSalary,
    classes,
    addClass,
    removeClass,
    subjects,
    addSubject,
    removeSubject,
    invoices,
    addInvoice,
    payInvoice,
    grades,
    approveGrade,
    messages,
    sendMessage,
    ptaMeetings,
    addPtaMeeting,
    removePtaMeeting,
    announcements,
    addAnnouncement,
    removeAnnouncement,
    currentUser,
    authLoading,
    logout,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "students"
    | "teachers"
    | "classes"
    | "subjects"
    | "attendance"
    | "results"
    | "fees"
    | "payroll"
    | "pta"
    | "announcements"
    | "messages"
    | "settings"
  >("dashboard");

  // Auth Check
  useEffect(() => {
    if (!authLoading && (!currentUser.role || currentUser.role !== "admin")) {
      router.push("/component/auth/admin");
    }
  }, [currentUser, authLoading, router]);

  // Search/Filters state
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All Classes");
  const [attendanceTerm, setAttendanceTerm] = useState("First Term");
  const [attendanceSession, setAttendanceSession] = useState("2024/2025");
  const [attendanceTab, setAttendanceTab] = useState<"overview" | "records">("overview");
  const [financeTab, setFinanceTab] = useState<"fees" | "payroll">("fees");

  // Modals state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddPta, setShowAddPta] = useState(false);
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<any>(null);

  // New item Form States
  const [newStudent, setNewStudent] = useState({ name: "", rollNumber: "", class: "Ss3", parentName: "", parentEmail: "", familyCode: "" });
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", subject: "", class: "Ss3", salary: 20000, bank: "Page MFBank", accountNo: "" });
  const [newClassName, setNewClassName] = useState("");
  const [newSub, setNewSub] = useState({ name: "", className: "Ss3", caMax: 40, examMax: 60 });
  const [newPta, setNewPta] = useState({ title: "", dateTime: "", type: "Video" as "Video" | "Audio", description: "" });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "" });

  // Settings form states
  const [settingsForm, setSettingsForm] = useState({
    name: "Alpha",
    email: "ishaqsultan7541@gmail.com",
    phone: "09075444148",
    address: "Gombe",
    code: "IRA85BAG",
    bank: "Page MFBank",
    accountNo: "222222222222222",
    accountName: "Alpha School Enterprise",
  });

  // Load settings from school state once ready
  useEffect(() => {
    if (school) {
      setSettingsForm({
        name: school.name || "Alpha",
        email: school.adminEmail || "ishaqsultan7541@gmail.com",
        phone: school.phone || "09075444148",
        address: school.address || "Gombe",
        code: school.id || "IRA85BAG",
        bank: school.bankName || "Page MFBank",
        accountNo: school.accountNumber || "222222222222222",
        accountName: school.accountName || "Alpha School Enterprise",
      });
    }
  }, [school]);

  // Dashboard calculation metrics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalCollectedFees = invoices.filter((i) => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const totalPendingFees = invoices.filter((i) => i.status === "Unpaid").reduce((acc, curr) => acc + curr.amount, 0);

  // Add / Create handlers
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      name: newStudent.name,
      rollNumber: newStudent.rollNumber,
      class: newStudent.class,
      parentName: newStudent.parentName,
      parentEmail: newStudent.parentEmail,
      familyCode: newStudent.familyCode,
    });
    setNewStudent({ name: "", rollNumber: "", class: "Ss3", parentName: "", parentEmail: "", familyCode: "" });
    setShowAddStudent(false);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacher({
      name: newTeacher.name,
      email: newTeacher.email,
      subject: newTeacher.subject,
      class: newTeacher.class,
      salary: Number(newTeacher.salary),
      bank: newTeacher.bank,
      accountNo: newTeacher.accountNo,
    });
    setNewTeacher({ name: "", email: "", subject: "", class: "Ss3", salary: 20000, bank: "Page MFBank", accountNo: "" });
    setShowAddTeacher(false);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClass(newClassName);
    setNewClassName("");
    setShowAddClass(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject({
      name: newSub.name,
      className: newSub.className,
      caMax: Number(newSub.caMax),
      examMax: Number(newSub.examMax),
    });
    setNewSub({ name: "", className: "Ss3", caMax: 40, examMax: 60 });
    setShowAddSubject(false);
  };

  const handleCreatePta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPta.title || !newPta.dateTime) return;
    addPtaMeeting({
      title: newPta.title,
      dateTime: newPta.dateTime,
      type: newPta.type,
      description: newPta.description,
    });
    setNewPta({ title: "", dateTime: "", type: "Video", description: "" });
    setShowAddPta(false);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
    });
    setNewAnnouncement({ title: "", content: "" });
    setShowAddAnnouncement(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (school) {
      updateSchool({
        ...school,
        name: settingsForm.name,
        adminEmail: settingsForm.email,
        phone: settingsForm.phone,
        address: settingsForm.address,
        bankName: settingsForm.bank,
        accountNumber: settingsForm.accountNo,
        accountName: settingsForm.accountName,
      });
      alert("Settings saved successfully!");
    }
  };

  // Filtered lists
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.class.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-slate-500 text-xs">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        Initializing session...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-[#334155] font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col p-5 z-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            A
          </div>
          <div>
            <h1 className="font-bold text-sm text-[#0f172a] leading-none mb-1">{school?.name || "Alpha"}</h1>
            <span className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "students", label: "Students", icon: <Users className="w-4 h-4" /> },
            { id: "teachers", label: "Teachers", icon: <UserCheck className="w-4 h-4" /> },
            { id: "classes", label: "Classes", icon: <Building2 className="w-4 h-4" /> },
            { id: "subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" /> },
            { id: "attendance", label: "Attendance", icon: <Calendar className="w-4 h-4" /> },
            { id: "results", label: "Results", icon: <Award className="w-4 h-4" /> },
            { id: "fees", label: "Fee Management", icon: <CreditCard className="w-4 h-4" /> },
            { id: "payroll", label: "Payroll", icon: <Banknote className="w-4 h-4" /> },
            { id: "pta", label: "PTA Meetings", icon: <Users2 className="w-4 h-4" /> },
            { id: "announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
            { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
            { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10"
                  : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* User Info & Signout */}
        <div className="border-t border-[#e2e8f0] pt-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
              I
            </div>
            <div>
              <p className="text-xs font-bold text-[#0f172a]">Ishaq</p>
              <p className="text-[10px] text-[#94a3b8]">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="p-2 text-[#94a3b8] hover:text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 p-8 overflow-y-auto max-w-6xl mx-auto">
        {/* VIEW 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0f172a] flex items-center gap-2">
                Welcome back, Ishaq 👋
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">Here is what is going on in your school</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Students</p>
                  <p className="text-2xl font-bold text-[#0f172a] mt-1">{totalStudents}</p>
                  <span className="text-[10px] text-[#94a3b8]">Live from database</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Teachers</p>
                  <p className="text-2xl font-bold text-[#0f172a] mt-1">{totalTeachers}</p>
                  <span className="text-[10px] text-[#94a3b8]">Live from database</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Total Classes</p>
                  <p className="text-2xl font-bold text-[#0f172a] mt-1">{totalClasses}</p>
                  <span className="text-[10px] text-[#94a3b8]">Live from database</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Fees Collected</p>
                  <p className="text-2xl font-bold text-[#0f172a] mt-1">₦{totalCollectedFees.toLocaleString()}</p>
                  <span className="text-[10px] text-[#64748b] font-semibold">₦{totalPendingFees.toLocaleString()} pending</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Graphs placeholder section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0f172a] mb-1">Students per Class</h3>
                <p className="text-xs text-[#94a3b8] mb-6">Live distribution across all classes</p>
                <div className="flex flex-col items-center justify-center py-12 text-[#94a3b8] text-xs">
                  {classes.length === 0 ? "No class data yet" : (
                    <div className="w-full flex flex-col gap-3">
                      {classes.map((cls) => {
                        const count = students.filter(s => s.class === cls.name).length;
                        const pct = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
                        return (
                          <div key={cls.id}>
                            <div className="flex justify-between text-xs font-bold text-[#475569] mb-1">
                              <span>{cls.name}</span>
                              <span>{count} Students</span>
                            </div>
                            <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pct || 10}%` }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#0f172a] mb-1">Fee Payment Status</h3>
                <p className="text-xs text-[#94a3b8] mb-6">pending vs paid breakdown</p>
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="flex gap-6 mt-6 justify-center text-xs">
                    <span className="flex items-center gap-2 font-bold text-[#475569]">
                      <span className="w-3 h-3 rounded-full bg-blue-600" /> Paid: ₦{totalCollectedFees.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-2 font-bold text-[#475569]">
                      <span className="w-3 h-3 rounded-full bg-orange-500" /> Pending: ₦{totalPendingFees.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: STUDENTS */}
        {activeTab === "students" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">Students</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Manage all students</p>
              </div>
              <button
                onClick={() => setShowAddStudent(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Add Student
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Students Table */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Student</th>
                      <th className="py-4 px-6">Class</th>
                      <th className="py-4 px-6">Parent</th>
                      <th className="py-4 px-6">Family Code</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-[#94a3b8]">
                          No students found
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((std) => (
                        <tr key={std.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/50">
                          <td className="py-4 px-6 font-bold text-[#0f172a]">{std.name}</td>
                          <td className="py-4 px-6">{std.class}</td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-[#334155]">{std.parentName}</p>
                            <p className="text-[10px] text-[#94a3b8]">{std.parentEmail}</p>
                          </td>
                          <td className="py-4 px-6 font-mono text-[#64748b]">{std.familyCode}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => removeStudent(std.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: TEACHERS */}
        {activeTab === "teachers" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">Teachers</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Manage all teachers</p>
              </div>
              <button
                onClick={() => setShowAddTeacher(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Add Teacher
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Teachers Table */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Teacher</th>
                      <th className="py-4 px-6">Subject</th>
                      <th className="py-4 px-6">Salary</th>
                      <th className="py-4 px-6">Bank</th>
                      <th className="py-4 px-6">Account No</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Assigned Classes</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#94a3b8]">
                          No teachers found
                        </td>
                      </tr>
                    ) : (
                      filteredTeachers.map((t) => (
                        <tr key={t.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/50">
                          <td className="py-4 px-6">
                            <p className="font-bold text-[#0f172a]">{t.name}</p>
                            <p className="text-[10px] text-[#94a3b8]">{t.email}</p>
                          </td>
                          <td className="py-4 px-6 font-bold">{t.subject}</td>
                          <td className="py-4 px-6 font-semibold">₦{(t.salary || 0).toLocaleString()}</td>
                          <td className="py-4 px-6">{t.bank}</td>
                          <td className="py-4 px-6 font-mono text-[#64748b]">{t.accountNo}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : "bg-red-50 text-red-600 border border-red-200"
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-blue-600">{t.class}</td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => removeTeacher(t.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: CLASSES */}
        {activeTab === "classes" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">Classes</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Manage all classes</p>
              </div>
              <button
                onClick={() => setShowAddClass(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Add Class
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {classes.map((cls) => (
                <div key={cls.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => removeClass(cls.id)}
                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-md cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-[#0f172a] text-sm">{cls.name}</h4>
                  <p className="text-[10px] text-[#94a3b8] mt-1 uppercase tracking-wider font-semibold">
                    {students.filter((s) => s.class === cls.name).length} Students
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: SUBJECTS */}
        {activeTab === "subjects" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">Subject Management</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Define subjects per class — used for CA and Exam entry</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => alert("Bulk add feature activated.")}
                  className="bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-[#334155] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition"
                >
                  Bulk Add
                </button>
                <button
                  onClick={() => setShowAddSubject(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Add Subject
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm mb-6 flex items-center gap-4">
              <div className="text-xs font-bold text-[#64748b]">Filter by Class</div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              >
                <option>All Classes</option>
                {classes.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Accordion or list */}
            {classes
              .filter((c) => subjectFilter === "All Classes" || c.name === subjectFilter)
              .map((c) => {
                const classSubs = subjects.filter((s) => s.className === c.name);
                return (
                  <div key={c.id} className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="bg-[#f8fafc] px-6 py-4 border-b border-[#e2e8f0] flex justify-between items-center">
                      <h4 className="font-bold text-sm text-[#0f172a]">{c.name}</h4>
                      <span className="text-[10px] bg-slate-200 text-[#475569] font-bold px-2 py-0.5 rounded-full">
                        {classSubs.length} subjects
                      </span>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      {classSubs.length === 0 ? (
                        <p className="text-xs text-[#94a3b8]">No subjects configured for this class</p>
                      ) : (
                        classSubs.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex justify-between items-center border border-[#e2e8f0] rounded-xl p-4 text-xs hover:bg-[#f8fafc]/30"
                          >
                            <div>
                              <p className="font-bold text-[#0f172a]">{sub.name}</p>
                              <p className="text-[#94a3b8] text-[10px] mt-0.5">
                                CA: {sub.caMax} · Exam: {sub.examMax} · Total: {sub.caMax + sub.examMax}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => removeSubject(sub.id)}
                                className="text-red-500 hover:text-red-700 px-3 py-1.5 hover:bg-red-50 rounded-lg cursor-pointer transition font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* VIEW 6: ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">Attendance Management</h2>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm mb-6 flex gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">Term</label>
                <select
                  value={attendanceTerm}
                  onChange={(e) => setAttendanceTerm(e.target.value)}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                >
                  <option>First Term</option>
                  <option>Second Term</option>
                  <option>Third Term</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#94a3b8] font-bold uppercase tracking-wider">Session</label>
                <select
                  value={attendanceSession}
                  onChange={(e) => setAttendanceSession(e.target.value)}
                  className="bg-white border border-[#e2e8f0] rounded-xl px-3 py-2 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                >
                  <option>2024/2025</option>
                  <option>2025/2026</option>
                </select>
              </div>
            </div>

            {/* Toggle view */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAttendanceTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  attendanceTab === "overview" ? "bg-blue-600 text-white" : "bg-white border border-[#cbd5e1] text-[#334155]"
                }`}
              >
                Class Overview
              </button>
              <button
                onClick={() => setAttendanceTab("records")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  attendanceTab === "records" ? "bg-blue-600 text-white" : "bg-white border border-[#cbd5e1] text-[#334155]"
                }`}
              >
                All Records
              </button>
            </div>

            {/* Sub metrics */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm text-center">
                <p className="text-2xl font-bold text-[#0f172a]">0</p>
                <p className="text-[10px] text-[#64748b] font-bold mt-1 uppercase tracking-wider">Total Records</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm text-center">
                <p className="text-2xl font-bold text-emerald-600">0</p>
                <p className="text-[10px] text-[#64748b] font-bold mt-1 uppercase tracking-wider">Present</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm text-center">
                <p className="text-2xl font-bold text-red-600">0</p>
                <p className="text-[10px] text-[#64748b] font-bold mt-1 uppercase tracking-wider">Absent</p>
              </div>
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm text-center">
                <p className="text-2xl font-bold text-amber-600">0</p>
                <p className="text-[10px] text-[#64748b] font-bold mt-1 uppercase tracking-wider">Late</p>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0f172a] mb-6">Attendance by Class</h3>
              <p className="text-xs text-[#94a3b8] text-center py-6">No attendance data yet for this term</p>
            </div>
          </div>
        )}

        {/* VIEW 7: RESULTS */}
        {activeTab === "results" && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0f172a]">Terminal Marks Approval</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Submitted grading cards awaiting admin signature</p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Subject</th>
                    <th className="py-4 px-6">Class</th>
                    <th className="py-4 px-6">CA Score</th>
                    <th className="py-4 px-6">Exam Score</th>
                    <th className="py-4 px-6">Total</th>
                    <th className="py-4 px-6">Grade</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#94a3b8]">
                        No grades awaiting approval
                      </td>
                    </tr>
                  ) : (
                    grades.map((g) => (
                      <tr key={g.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/50">
                        <td className="py-4 px-6 font-bold">{g.studentName}</td>
                        <td className="py-4 px-6 font-semibold">{g.subject}</td>
                        <td className="py-4 px-6">{g.class}</td>
                        <td className="py-4 px-6 font-mono">{g.caScore}</td>
                        <td className="py-4 px-6 font-mono">{g.examScore}</td>
                        <td className="py-4 px-6 font-bold text-blue-600 font-mono">{g.total}%</td>
                        <td className="py-4 px-6 font-bold font-mono">{g.grade}</td>
                        <td className="py-4 px-6 text-right">
                          {g.approved ? (
                            <span className="text-emerald-500 font-semibold flex items-center gap-1 justify-end">
                              <Check className="w-4 h-4" /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => approveGrade(g.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 8: FEE MANAGEMENT */}
        {activeTab === "fees" && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0f172a]">Finance Overview</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Student fees & teacher payroll</p>
            </div>

            {/* Toggle tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFinanceTab("fees")}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition ${
                  financeTab === "fees" ? "bg-blue-600 text-white" : "bg-white border border-[#cbd5e1] text-[#334155]"
                }`}
              >
                Student Fees
              </button>
              <button
                onClick={() => setActiveTab("payroll")}
                className="bg-white border border-[#cbd5e1] text-[#334155] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Teacher Payroll
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-[#047857] uppercase tracking-wider">Total Collected</p>
                <p className="text-2xl font-bold text-[#065f46] mt-2">₦{totalCollectedFees.toLocaleString()}</p>
              </div>
              <div className="bg-[#fffde6] border border-[#fef08a] rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-[#854d0e] uppercase tracking-wider">Pending Payment</p>
                <p className="text-2xl font-bold text-[#713f12] mt-2">₦{totalPendingFees.toLocaleString()}</p>
              </div>
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-[#1d4ed8] uppercase tracking-wider">Total Records</p>
                <p className="text-2xl font-bold text-[#1e40af] mt-2">{invoices.length}</p>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Class</th>
                      <th className="py-4 px-6">Amount</th>
                      <th className="py-4 px-6">Term</th>
                      <th className="py-4 px-6">Session</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Paid On</th>
                      <th className="py-4 px-6 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-[#94a3b8]">
                          No records found
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/50">
                          <td className="py-4 px-6 font-bold">{inv.studentName}</td>
                          <td className="py-4 px-6 font-semibold">Ss3</td>
                          <td className="py-4 px-6 font-bold">₦{inv.amount.toLocaleString()}</td>
                          <td className="py-4 px-6">{inv.term || "First Term"}</td>
                          <td className="py-4 px-6">{inv.session || "2024/2025"}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.status === "Paid"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : "bg-red-50 text-red-600 border border-red-200"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[#64748b]">{inv.paidDate || "—"}</td>
                          <td className="py-4 px-6 text-right">
                            {inv.status === "Paid" ? (
                              <button
                                onClick={() => alert(`Receipt Reference: ${inv.reference}`)}
                                className="text-blue-600 hover:underline font-semibold cursor-pointer"
                              >
                                View Receipt
                              </button>
                            ) : (
                              <span className="text-[#94a3b8]">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 9: PAYROLL */}
        {activeTab === "payroll" && (
          <div className="animate-fadeIn">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#0f172a]">Salary Management</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Pay teacher salaries via Flutterwave</p>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm overflow-hidden p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Teacher</th>
                      <th className="py-4 px-6">Subject</th>
                      <th className="py-4 px-6">Bank</th>
                      <th className="py-4 px-6">Account No</th>
                      <th className="py-4 px-6">Salary</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((t) => (
                      <tr key={t.id} className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]/50">
                        <td className="py-4 px-6 font-bold">{t.name}</td>
                        <td className="py-4 px-6 font-semibold">{t.subject}</td>
                        <td className="py-4 px-6">{t.bank}</td>
                        <td className="py-4 px-6 font-mono text-[#64748b]">{t.accountNo}</td>
                        <td className="py-4 px-6 font-bold text-[#0f172a]">₦{(t.salary || 0).toLocaleString()}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              t.status === "Paid"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {t.status === "Unpaid" ? (
                            <button
                              onClick={() => {
                                payTeacherSalary(t.id);
                                alert(`Paid ₦${(t.salary || 0).toLocaleString()} to ${t.name} via Flutterwave Mock.`);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition flex items-center gap-1.5 ml-auto text-[10px]"
                            >
                              <Send className="w-3.5 h-3.5" /> Pay Now
                            </button>
                          ) : (
                            <span className="text-emerald-500 font-bold text-[10px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 10: PTA MEETINGS */}
        {activeTab === "pta" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">PTA Meetings</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Schedule and manage parent-teacher association schedules</p>
              </div>
              <button
                onClick={() => setShowAddPta(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Schedule PTA Meeting
              </button>
            </div>

            {ptaMeetings.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center text-[#94a3b8] text-xs">
                No meetings scheduled yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {ptaMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            meeting.type === "Video"
                              ? "bg-blue-50 text-blue-600 border border-blue-200"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          }`}
                        >
                          {meeting.type} Meeting
                        </span>
                        <button
                          onClick={() => removePtaMeeting(meeting.id)}
                          className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-[#0f172a] text-sm mb-1">{meeting.title}</h4>
                      <p className="text-[10px] text-[#94a3b8] mb-3">
                        📅 {new Date(meeting.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                      <p className="text-xs text-[#64748b] leading-relaxed mb-6">{meeting.description}</p>
                    </div>

                    <button
                      onClick={() => setActiveMeeting(meeting)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition cursor-pointer text-center ${
                        meeting.type === "Video" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      Join {meeting.type === "Video" ? "Video call" : "Audio call"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 11: ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">School Announcements</h2>
                <p className="text-xs text-[#64748b] mt-0.5">Broadcast school updates, notices, or newsletters</p>
              </div>
              <button
                onClick={() => setShowAddAnnouncement(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Post Announcement
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center text-[#94a3b8] text-xs">
                No announcements posted yet
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-sm">{ann.title}</h4>
                        <span className="text-[10px] text-[#94a3b8]">📅 Date Posted: {ann.date}</span>
                      </div>
                      <button
                        onClick={() => removeAnnouncement(ann.id)}
                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed mt-2 whitespace-pre-wrap">{ann.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 12: MESSAGES */}
        {activeTab === "messages" && (
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm animate-fadeIn">
            <h3 className="text-sm font-bold text-[#0f172a] mb-2">Messages Box</h3>
            <p className="text-xs text-[#64748b] mb-6">Direct logs between admin, teachers, and guardians</p>
            <div className="flex flex-col items-center justify-center py-12 text-[#94a3b8] text-xs">
              No messages logged yet
            </div>
          </div>
        )}

        {/* VIEW 13: SETTINGS */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[#0f172a]">School Settings</h2>
              <p className="text-xs text-[#64748b] mt-0.5">Manage your school profile and logo</p>
            </div>

            {/* School Logo */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-4">School Logo</h3>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl border border-dashed border-[#cbd5e1] flex items-center justify-center text-slate-300">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs text-[#64748b] mb-2">PNG, JPG up to 500KB. Will display in sidebar and report cards.</p>
                  <button
                    type="button"
                    onClick={() => alert("Upload logo triggered")}
                    className="bg-white border border-[#cbd5e1] hover:bg-[#f8fafc] text-xs font-bold text-[#334155] px-4 py-2 rounded-xl cursor-pointer transition"
                  >
                    Choose Image
                  </button>
                </div>
              </div>
            </div>

            {/* School Information */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-4">School Information</h3>
              <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">School Name *</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#64748b] block mb-1 font-bold">Email</label>
                    <input
                      type="email"
                      required
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748b] block mb-1 font-bold">Phone</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Address</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">School Code</label>
                  <input
                    type="text"
                    disabled
                    value={settingsForm.code}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#94a3b8] font-mono"
                  />
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => router.push("/owner-dashboard")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl cursor-pointer transition text-xs"
                  >
                    Owner Dashboard
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl cursor-pointer transition text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Payment Details */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1">Payment Details</h3>
              <p className="text-[10px] text-[#94a3b8] mb-4">Enter your school's bank account. Fee payments from parents and teacher salary transfers will go directly to this account.</p>

              <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 text-xs">
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Bank</label>
                  <select
                    value={settingsForm.bank}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bank: e.target.value })}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option>Page MFBank</option>
                    <option>Guaranty Trust Bank (GTB)</option>
                    <option>Zenith Bank</option>
                    <option>Access Bank</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Account Number</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.accountNo}
                    onChange={(e) => setSettingsForm({ ...settingsForm, accountNo: e.target.value })}
                    placeholder="10-digit account number"
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Account Name</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.accountName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, accountName: e.target.value })}
                    placeholder="Auto-filled after entering account number"
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-3 text-xs text-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="bg-[#eff6ff] text-[#1e40af] p-4 rounded-2xl border border-[#bfdbfe]">
                  <p className="font-bold mb-1">How it works:</p>
                  <p className="text-[10px] leading-relaxed text-[#1e3a8a]">
                    When you save, a secure payment account is created linked to your bank. All school fee collections go directly to your account. Teacher salaries are also transferred from this account.
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl cursor-pointer transition text-xs mt-2"
                >
                  Save Payment Details
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative text-xs">
            <h3 className="font-bold text-sm text-[#0f172a] mb-4">Add Student</h3>
            <form onSubmit={handleCreateStudent} className="flex flex-col gap-3">
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Student Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Student's name"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Class</label>
                <select
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Parent Name</label>
                <input
                  type="text"
                  required
                  value={newStudent.parentName}
                  onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                  placeholder="Parent's name"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Parent Email</label>
                <input
                  type="email"
                  required
                  value={newStudent.parentEmail}
                  onChange={(e) => setNewStudent({ ...newStudent, parentEmail: e.target.value })}
                  placeholder="you@email.com"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Family Code</label>
                <input
                  type="text"
                  required
                  value={newStudent.familyCode}
                  onChange={(e) => setNewStudent({ ...newStudent, familyCode: e.target.value })}
                  placeholder="e.g. FAM-902"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="bg-white border border-[#cbd5e1] text-[#334155] font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Teacher Modal */}
      {showAddTeacher && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative text-xs">
            <h3 className="font-bold text-sm text-[#0f172a] mb-4">Add Teacher</h3>
            <form onSubmit={handleCreateTeacher} className="flex flex-col gap-3">
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Teacher Name</label>
                <input
                  type="text"
                  required
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="Teacher's name"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Email</label>
                <input
                  type="email"
                  required
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  placeholder="teacher@school.com"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Subject</label>
                <input
                  type="text"
                  required
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                  placeholder="e.g. English"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Assigned Class</label>
                <select
                  value={newTeacher.class}
                  onChange={(e) => setNewTeacher({ ...newTeacher, class: e.target.value })}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Salary (₦)</label>
                  <input
                    type="number"
                    required
                    value={newTeacher.salary}
                    onChange={(e) => setNewTeacher({ ...newTeacher, salary: Number(e.target.value) })}
                    placeholder="20000"
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Bank</label>
                  <input
                    type="text"
                    required
                    value={newTeacher.bank}
                    onChange={(e) => setNewTeacher({ ...newTeacher, bank: e.target.value })}
                    placeholder="Page MFBank"
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Account Number</label>
                <input
                  type="text"
                  required
                  value={newTeacher.accountNo}
                  onChange={(e) => setNewTeacher({ ...newTeacher, accountNo: e.target.value })}
                  placeholder="10-digit number"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="bg-white border border-[#cbd5e1] text-[#334155] font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative text-xs">
            <h3 className="font-bold text-sm text-[#0f172a] mb-4">Add Class</h3>
            <form onSubmit={handleCreateClass} className="flex flex-col gap-3">
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Class Name</label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. Jss1 or Ss3"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="bg-white border border-[#cbd5e1] text-[#334155] font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative text-xs">
            <h3 className="font-bold text-sm text-[#0f172a] mb-4">Add Subject</h3>
            <form onSubmit={handleCreateSubject} className="flex flex-col gap-3">
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSub.name}
                  onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                  placeholder="e.g. English"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Class Assigned</label>
                <select
                  value={newSub.className}
                  onChange={(e) => setNewSub({ ...newSub, className: e.target.value })}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none font-semibold"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">CA Maximum Score</label>
                  <input
                    type="number"
                    required
                    value={newSub.caMax}
                    onChange={(e) => setNewSub({ ...newSub, caMax: Number(e.target.value) })}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#64748b] block mb-1 font-bold">Exam Maximum Score</label>
                  <input
                    type="number"
                    required
                    value={newSub.examMax}
                    onChange={(e) => setNewSub({ ...newSub, examMax: Number(e.target.value) })}
                    className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="bg-white border border-[#cbd5e1] text-[#334155] font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Schedule PTA Meeting Modal */}
      {showAddPta && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative text-xs text-[#334155]">
            <h3 className="font-bold text-sm text-[#0f172a] mb-4">Schedule PTA Meeting</h3>
            <form onSubmit={handleCreatePta} className="flex flex-col gap-3">
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newPta.title}
                  onChange={(e) => setNewPta({ ...newPta, title: e.target.value })}
                  placeholder="e.g. End of Term Consultations"
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Meeting Type (Admin Choice)</label>
                <select
                  value={newPta.type}
                  onChange={(e) => setNewPta({ ...newPta, type: e.target.value as any })}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none font-semibold"
                >
                  <option value="Video">Video Call (Google Meet / Jitsi Style)</option>
                  <option value="Audio">Audio Call Only</option>
                </select>
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={newPta.dateTime}
                  onChange={(e) => setNewPta({ ...newPta, dateTime: e.target.value })}
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none font-semibold"
                />
              </div>
              <div>
                <label className="text-[#64748b] block mb-1 font-bold">Description / Agenda</label>
                <textarea
                  rows={3}
                  value={newPta.description}
                  onChange={(e) => setNewPta({ ...newPta, description: e.target.value })}
                  placeholder="Agenda points for parents..."
                  className="w-full bg-white border border-[#e2e8f0] rounded-xl p-2.5 text-[#334155] focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddPta(false)}
                  className="bg-white border border-[#cbd5e1] text-[#334155] font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Active Live Virtual Meeting (Jitsi embed) Fullscreen Window */}
      {activeMeeting && (
        <div className="fixed inset-0 bg-[#0f172a] z-50 flex flex-col">
          <header className="bg-slate-900 border-b border-white/10 px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h3 className="font-bold text-sm">{activeMeeting.title}</h3>
              <p className="text-[10px] text-white/50">
                Live {activeMeeting.type === "Video" ? "Video Conference" : "Audio Call Only"}
              </p>
            </div>
            <button
              onClick={() => setActiveMeeting(null)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition"
            >
              Leave Call
            </button>
          </header>

          <div className="flex-1 bg-[#1e293b] relative">
            <iframe
              src={`${activeMeeting.meetingUrl}${
                activeMeeting.type === "Audio" ? "#config.startWithVideoMuted=true" : ""
              }`}
              allow="camera; microphone; display-capture; autoplay"
              className="absolute inset-0 w-full h-full border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
