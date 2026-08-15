"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Data structures
export interface School {
  id: string;
  name: string;
  phone: string;
  address: string;
  adminName: string;
  adminEmail: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  parentEmail: string;
  parentName: string;
  attendanceRate: number; // e.g. 92
  feesPaid: number;
  feesTotal: number;
  familyCode: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  class: string; // Assigned class
  salary: number;
  bank: string;
  accountNo: string;
  status: "Paid" | "Unpaid";
}

export interface ClassItem {
  id: string;
  name: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  className: string;
  caMax: number;
  examMax: number;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  type: string; // e.g. "Tuition", "Exam Fee", "Library"
  status: "Paid" | "Unpaid";
  dueDate: string;
  paidDate?: string;
  reference?: string;
  term?: string;
  session?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  class: string;
  caScore: number; // Max 40
  examScore: number; // Max 60
  total: number; // ca + exam
  grade: string; // A, B, C, D, E, F
  term: string; // "First Term", "Second Term"
  approved: boolean;
}

export interface Message {
  id: string;
  sender: string; // "Admin", "Teacher: Name", "Parent: Name"
  recipient: string; // e.g. "All Parents", "Parent: Name", "Teacher: Name"
  text: string;
  timestamp: string;
}

export interface PtaMeeting {
  id: string;
  title: string;
  dateTime: string;
  type: "Video" | "Audio";
  description: string;
  meetingUrl: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface StateContextType {
  school: School | null;
  updateSchool: (school: School) => void;
  registerSchool: (school: Omit<School, "id">) => void;
  students: Student[];
  addStudent: (student: Omit<Student, "id" | "attendanceRate" | "feesPaid" | "feesTotal">) => void;
  removeStudent: (id: string) => void;
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, "id" | "status">) => void;
  removeTeacher: (id: string) => void;
  payTeacherSalary: (id: string) => void;
  classes: ClassItem[];
  addClass: (className: string) => void;
  removeClass: (id: string) => void;
  subjects: SubjectItem[];
  addSubject: (sub: Omit<SubjectItem, "id">) => void;
  removeSubject: (id: string) => void;
  invoices: FeeInvoice[];
  addInvoice: (invoice: Omit<FeeInvoice, "id" | "status">) => void;
  payInvoice: (invoiceId: string, reference: string) => void;
  grades: Grade[];
  submitGrade: (grade: Omit<Grade, "id" | "total" | "grade" | "approved">) => void;
  approveGrade: (gradeId: string) => void;
  messages: Message[];
  sendMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  ptaMeetings: PtaMeeting[];
  addPtaMeeting: (meeting: Omit<PtaMeeting, "id" | "meetingUrl">) => void;
  removePtaMeeting: (id: string) => void;
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, "id" | "date">) => void;
  removeAnnouncement: (id: string) => void;
  currentUser: { role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null };
  setCurrentUser: (user: { role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null }) => void;
  authLoading: boolean;
  logout: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const initialClasses: ClassItem[] = [
  { id: "C001", name: "Ss3" }
];

const initialSubjects: SubjectItem[] = [
  { id: "SUB001", name: "English", className: "Ss3", caMax: 40, examMax: 60 }
];

const initialStudents: Student[] = [
  { id: "S001", name: "Chinedu Okafor", rollNumber: "EDV/2026/012", class: "Ss3", parentEmail: "parent@school.com", parentName: "Adebayo Okafor", attendanceRate: 95, feesPaid: 150000, feesTotal: 150000, familyCode: "FAM-902" },
];

const initialTeachers: Teacher[] = [
  { id: "T001", name: "Ishaq", email: "teacher@school.com", subject: "English", class: "Ss3", salary: 20000, bank: "Page MFBank", accountNo: "222222222222222", status: "Unpaid" },
];

const initialInvoices: FeeInvoice[] = [
  { id: "INV-001", studentId: "S001", studentName: "Chinedu Okafor", amount: 150000, type: "1st Term Tuition", status: "Paid", dueDate: "2026-09-10", paidDate: "2026-09-02", reference: "FLW-MOCK-12345", term: "First Term", session: "2024/2025" },
];

const initialPtaMeetings: PtaMeeting[] = [
  {
    id: "PTA-101",
    title: "First Term Executive PTA Meeting",
    dateTime: "2026-08-20T10:00",
    type: "Video",
    description: "Discussion on school fees guidelines and terminal grading updates.",
    meetingUrl: "https://meet.jit.si/EdvancePTA-FirstTermExecutiveMeeting"
  }
];

const initialAnnouncements: Announcement[] = [
  {
    id: "ANN-101",
    title: "Resumption Guidelines for Term 1",
    content: "All students are expected to resume on September 10th. Make sure school fees invoices are settled.",
    date: "2026-08-15"
  }
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ptaMeetings, setPtaMeetings] = useState<PtaMeeting[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null }>({ role: null, email: null, name: null });
  const [authLoading, setAuthLoading] = useState(true);

  // Load from local storage
  useEffect(() => {
    const localSchool = localStorage.getItem("edvance_school");
    if (localSchool) setSchool(JSON.parse(localSchool));
    else {
      const defaultSchool = { id: "IRA85BAG", name: "Alpha", phone: "09075444148", address: "Gombe", adminName: "Ishaq", adminEmail: "ishaqsultan7541@gmail.com", bankName: "", accountNumber: "", accountName: "" };
      setSchool(defaultSchool);
      localStorage.setItem("edvance_school", JSON.stringify(defaultSchool));
    }

    const localStudents = localStorage.getItem("edvance_students");
    if (localStudents) setStudents(JSON.parse(localStudents));
    else {
      setStudents(initialStudents);
      localStorage.setItem("edvance_students", JSON.stringify(initialStudents));
    }

    const localTeachers = localStorage.getItem("edvance_teachers");
    if (localTeachers) setTeachers(JSON.parse(localTeachers));
    else {
      setTeachers(initialTeachers);
      localStorage.setItem("edvance_teachers", JSON.stringify(initialTeachers));
    }

    const localClasses = localStorage.getItem("edvance_classes");
    if (localClasses) setClasses(JSON.parse(localClasses));
    else {
      setClasses(initialClasses);
      localStorage.setItem("edvance_classes", JSON.stringify(initialClasses));
    }

    const localSubjects = localStorage.getItem("edvance_subjects");
    if (localSubjects) setSubjects(JSON.parse(localSubjects));
    else {
      setSubjects(initialSubjects);
      localStorage.setItem("edvance_subjects", JSON.stringify(initialSubjects));
    }

    const localInvoices = localStorage.getItem("edvance_invoices");
    if (localInvoices) setInvoices(JSON.parse(localInvoices));
    else {
      setInvoices(initialInvoices);
      localStorage.setItem("edvance_invoices", JSON.stringify(initialInvoices));
    }

    const localGrades = localStorage.getItem("edvance_grades");
    if (localGrades) setGrades(JSON.parse(localGrades));
    else {
      const initialGrades: Grade[] = [];
      setGrades(initialGrades);
      localStorage.setItem("edvance_grades", JSON.stringify(initialGrades));
    }

    const localMessages = localStorage.getItem("edvance_messages");
    if (localMessages) setMessages(JSON.parse(localMessages));
    else {
      const initialMessages: Message[] = [];
      setMessages(initialMessages);
      localStorage.setItem("edvance_messages", JSON.stringify(initialMessages));
    }

    const localMeetings = localStorage.getItem("edvance_meetings");
    if (localMeetings) setPtaMeetings(JSON.parse(localMeetings));
    else {
      setPtaMeetings(initialPtaMeetings);
      localStorage.setItem("edvance_meetings", JSON.stringify(initialPtaMeetings));
    }

    const localAnnouncements = localStorage.getItem("edvance_announcements");
    if (localAnnouncements) setAnnouncements(JSON.parse(localAnnouncements));
    else {
      setAnnouncements(initialAnnouncements);
      localStorage.setItem("edvance_announcements", JSON.stringify(initialAnnouncements));
    }

    const localUser = localStorage.getItem("edvance_current_user");
    if (localUser) setCurrentUser(JSON.parse(localUser));
    setAuthLoading(false);
  }, []);

  const updateSchool = (updatedSchool: School) => {
    setSchool(updatedSchool);
    localStorage.setItem("edvance_school", JSON.stringify(updatedSchool));
  };

  const registerSchool = (newSchool: Omit<School, "id">) => {
    const created: School = { ...newSchool, id: "SCH-" + Math.floor(Math.random() * 900 + 100) };
    setSchool(created);
    localStorage.setItem("edvance_school", JSON.stringify(created));
    setCurrentUser({ role: "admin", email: created.adminEmail, name: created.adminName });
    localStorage.setItem("edvance_current_user", JSON.stringify({ role: "admin", email: created.adminEmail, name: created.adminName }));
  };

  const addStudent = (studentData: Omit<Student, "id" | "attendanceRate" | "feesPaid" | "feesTotal">) => {
    const newStudent: Student = {
      ...studentData,
      id: "S" + Math.floor(Math.random() * 900 + 100),
      attendanceRate: 100,
      feesPaid: 0,
      feesTotal: 150000,
    };
    const updated = [...students, newStudent];
    setStudents(updated);
    localStorage.setItem("edvance_students", JSON.stringify(updated));

    // Auto create tuition fee invoice for student
    const newInv: FeeInvoice = {
      id: "INV-" + Math.floor(Math.random() * 9000 + 1000),
      studentId: newStudent.id,
      studentName: newStudent.name,
      amount: 150000,
      type: "1st Term Tuition",
      status: "Unpaid",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      term: "First Term",
      session: "2024/2025"
    };
    const updatedInvoices = [...invoices, newInv];
    setInvoices(updatedInvoices);
    localStorage.setItem("edvance_invoices", JSON.stringify(updatedInvoices));
  };

  const removeStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    setStudents(updated);
    localStorage.setItem("edvance_students", JSON.stringify(updated));
  };

  const addTeacher = (teacherData: Omit<Teacher, "id" | "status">) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: "T" + Math.floor(Math.random() * 900 + 100),
      status: "Unpaid",
    };
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    localStorage.setItem("edvance_teachers", JSON.stringify(updated));
  };

  const removeTeacher = (id: string) => {
    const updated = teachers.filter((t) => t.id !== id);
    setTeachers(updated);
    localStorage.setItem("edvance_teachers", JSON.stringify(updated));
  };

  const payTeacherSalary = (id: string) => {
    const updated = teachers.map((t) => {
      if (t.id === id) {
        return { ...t, status: "Paid" as const };
      }
      return t;
    });
    setTeachers(updated);
    localStorage.setItem("edvance_teachers", JSON.stringify(updated));
  };

  const addClass = (className: string) => {
    const newClass: ClassItem = {
      id: "C" + Math.floor(Math.random() * 900 + 100),
      name: className,
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem("edvance_classes", JSON.stringify(updated));
  };

  const removeClass = (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    setClasses(updated);
    localStorage.setItem("edvance_classes", JSON.stringify(updated));
  };

  const addSubject = (subData: Omit<SubjectItem, "id">) => {
    const newSub: SubjectItem = {
      ...subData,
      id: "SUB" + Math.floor(Math.random() * 900 + 100),
    };
    const updated = [...subjects, newSub];
    setSubjects(updated);
    localStorage.setItem("edvance_subjects", JSON.stringify(updated));
  };

  const removeSubject = (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    localStorage.setItem("edvance_subjects", JSON.stringify(updated));
  };

  const addInvoice = (invData: Omit<FeeInvoice, "id" | "status">) => {
    const newInvoice: FeeInvoice = {
      ...invData,
      id: "INV-" + Math.floor(Math.random() * 9000 + 1000),
      status: "Unpaid",
    };
    const updated = [...invoices, newInvoice];
    setInvoices(updated);
    localStorage.setItem("edvance_invoices", JSON.stringify(updated));
  };

  const payInvoice = (invoiceId: string, reference: string) => {
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        // Also update student profile fee stats
        const updatedStudents = students.map((std) => {
          if (std.id === inv.studentId) {
            return { ...std, feesPaid: std.feesPaid + inv.amount };
          }
          return std;
        });
        setStudents(updatedStudents);
        localStorage.setItem("edvance_students", JSON.stringify(updatedStudents));

        return { ...inv, status: "Paid" as const, paidDate: new Date().toISOString().split("T")[0], reference };
      }
      return inv;
    });
    setInvoices(updatedInvoices);
    localStorage.setItem("edvance_invoices", JSON.stringify(updatedInvoices));
  };

  const submitGrade = (gradeData: Omit<Grade, "id" | "total" | "grade" | "approved">) => {
    const total = gradeData.caScore + gradeData.examScore;
    let gradeLetter = "F";
    if (total >= 70) gradeLetter = "A";
    else if (total >= 60) gradeLetter = "B";
    else if (total >= 50) gradeLetter = "C";
    else if (total >= 45) gradeLetter = "D";
    else if (total >= 40) gradeLetter = "E";

    const newGrade: Grade = {
      ...gradeData,
      id: "G" + Math.floor(Math.random() * 900 + 100),
      total,
      grade: gradeLetter,
      approved: false,
    };
    const updated = [...grades, newGrade];
    setGrades(updated);
    localStorage.setItem("edvance_grades", JSON.stringify(updated));
  };

  const approveGrade = (gradeId: string) => {
    const updated = grades.map((g) => {
      if (g.id === gradeId) {
        return { ...g, approved: true };
      }
      return g;
    });
    setGrades(updated);
    localStorage.setItem("edvance_grades", JSON.stringify(updated));
  };

  const sendMessage = (msgData: Omit<Message, "id" | "timestamp">) => {
    const newMsg: Message = {
      ...msgData,
      id: "M" + Math.floor(Math.random() * 900 + 100),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem("edvance_messages", JSON.stringify(updated));
  };

  const addPtaMeeting = (meetingData: Omit<PtaMeeting, "id" | "meetingUrl">) => {
    const slug = meetingData.title.replace(/\s+/g, "");
    const newMeeting: PtaMeeting = {
      ...meetingData,
      id: "PTA-" + Math.floor(Math.random() * 900 + 100),
      meetingUrl: `https://meet.jit.si/EdvancePTA-${slug}-${Math.floor(Math.random() * 900 + 100)}`
    };
    const updated = [...ptaMeetings, newMeeting];
    setPtaMeetings(updated);
    localStorage.setItem("edvance_meetings", JSON.stringify(updated));

    // Send broadcast notification to all parents & teachers
    const newMsg: Message = {
      id: "M" + Math.floor(Math.random() * 900 + 100),
      sender: "Admin Notice",
      recipient: "All Parents & Teachers",
      text: `📅 NEW PTA MEETING: "${newMeeting.title}" has been scheduled for ${new Date(newMeeting.dateTime).toLocaleString()}. Join link: ${newMeeting.meetingUrl}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    localStorage.setItem("edvance_messages", JSON.stringify(updatedMsgs));
  };

  const removePtaMeeting = (id: string) => {
    const updated = ptaMeetings.filter((m) => m.id !== id);
    setPtaMeetings(updated);
    localStorage.setItem("edvance_meetings", JSON.stringify(updated));
  };

  const addAnnouncement = (annData: Omit<Announcement, "id" | "date">) => {
    const newAnn: Announcement = {
      ...annData,
      id: "ANN-" + Math.floor(Math.random() * 900 + 100),
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [...announcements, newAnn];
    setAnnouncements(updated);
    localStorage.setItem("edvance_announcements", JSON.stringify(updated));

    // Send broadcast notification to all parents & teachers
    const newMsg: Message = {
      id: "M" + Math.floor(Math.random() * 900 + 100),
      sender: "Admin Notice",
      recipient: "All Parents & Teachers",
      text: `📢 ANNOUNCEMENT: "${newAnn.title}" - ${newAnn.content}`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    };
    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    localStorage.setItem("edvance_messages", JSON.stringify(updatedMsgs));
  };

  const removeAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("edvance_announcements", JSON.stringify(updated));
  };

  const updateCurrentUser = (user: { role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null }) => {
    setCurrentUser(user);
    if (user.role) {
      localStorage.setItem("edvance_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("edvance_current_user");
    }
  };

  const logout = () => {
    setCurrentUser({ role: null, email: null, name: null });
    localStorage.removeItem("edvance_current_user");
  };

  return (
    <StateContext.Provider
      value={{
        school,
        updateSchool,
        registerSchool,
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
        submitGrade,
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
        setCurrentUser: updateCurrentUser,
        authLoading,
        logout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error("useAppState must be used within StateProvider");
  return context;
};
