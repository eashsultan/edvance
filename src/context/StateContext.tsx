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
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  class: string;
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

interface StateContextType {
  school: School | null;
  registerSchool: (school: Omit<School, "id">) => void;
  students: Student[];
  addStudent: (student: Omit<Student, "id" | "attendanceRate" | "feesPaid" | "feesTotal">) => void;
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  invoices: FeeInvoice[];
  addInvoice: (invoice: Omit<FeeInvoice, "id" | "status">) => void;
  payInvoice: (invoiceId: string, reference: string) => void;
  grades: Grade[];
  submitGrade: (grade: Omit<Grade, "id" | "total" | "grade" | "approved">) => void;
  approveGrade: (gradeId: string) => void;
  messages: Message[];
  sendMessage: (msg: Omit<Message, "id" | "timestamp">) => void;
  currentUser: { role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null };
  setCurrentUser: (user: { role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null }) => void;
  logout: () => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

const initialStudents: Student[] = [
  { id: "S001", name: "Chinedu Okafor", rollNumber: "EDV/2026/012", class: "JSS 1", parentEmail: "parent@school.com", parentName: "Adebayo Okafor", attendanceRate: 95, feesPaid: 150000, feesTotal: 150000 },
  { id: "S002", name: "Amina Bello", rollNumber: "EDV/2026/034", class: "JSS 2", parentEmail: "amina.parent@school.com", parentName: "Ibrahim Bello", attendanceRate: 88, feesPaid: 75000, feesTotal: 150000 },
  { id: "S003", name: "Oluwaseun Adebayo", rollNumber: "EDV/2026/056", class: "SSS 1", parentEmail: "seun.parent@school.com", parentName: "Samuel Adebayo", attendanceRate: 91, feesPaid: 0, feesTotal: 180000 },
];

const initialTeachers: Teacher[] = [
  { id: "T001", name: "Mrs. Ngozi Ezenwa", email: "teacher@school.com", subject: "Mathematics", class: "JSS 1" },
  { id: "T002", name: "Mr. Babajide Sowande", email: "sowande@school.com", subject: "English Language", class: "JSS 2" },
  { id: "T003", name: "Dr. Chioma Nwachukwu", email: "nwachukwu@school.com", subject: "Basic Science", class: "SSS 1" },
];

const initialInvoices: FeeInvoice[] = [
  { id: "INV-001", studentId: "S001", studentName: "Chinedu Okafor", amount: 150000, type: "1st Term Tuition", status: "Paid", dueDate: "2026-09-10", paidDate: "2026-09-02", reference: "FLW-MOCK-12345" },
  { id: "INV-002", studentId: "S002", studentName: "Amina Bello", amount: 150000, type: "1st Term Tuition", status: "Unpaid", dueDate: "2026-09-10" },
  { id: "INV-003", studentId: "S003", studentName: "Oluwaseun Adebayo", amount: 180000, type: "1st Term Tuition", status: "Unpaid", dueDate: "2026-09-15" },
];

const initialGrades: Grade[] = [
  { id: "G001", studentId: "S001", studentName: "Chinedu Okafor", subject: "Mathematics", class: "JSS 1", caScore: 28, examScore: 55, total: 83, grade: "A", term: "First Term", approved: true },
  { id: "G002", studentId: "S002", studentName: "Amina Bello", subject: "English Language", class: "JSS 2", caScore: 24, examScore: 42, total: 66, grade: "B", term: "First Term", approved: false },
];

const initialMessages: Message[] = [
  { id: "M001", sender: "Admin", recipient: "All Parents", text: "Welcome to the new academic term. Please ensure school fees are cleared on or before September 15th.", timestamp: "2026-08-15 10:00" },
  { id: "M002", sender: "Mrs. Ngozi Ezenwa", recipient: "Parent: Adebayo Okafor", text: "Chinedu has done exceptionally well in the Mathematics assessment tests this week.", timestamp: "2026-08-15 14:20" },
];

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoice[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<{ role: "admin" | "teacher" | "parent" | null; email: string | null; name: string | null }>({ role: null, email: null, name: null });

  // Load from local storage
  useEffect(() => {
    const localSchool = localStorage.getItem("edvance_school");
    if (localSchool) setSchool(JSON.parse(localSchool));
    else {
      const defaultSchool = { id: "SCH-993", name: "Greenfield Academy", phone: "+2348012345678", address: "12, Herbert Macaulay Way, Yaba, Lagos", adminName: "Principal Davies", adminEmail: "admin@school.com" };
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

    const localInvoices = localStorage.getItem("edvance_invoices");
    if (localInvoices) setInvoices(JSON.parse(localInvoices));
    else {
      setInvoices(initialInvoices);
      localStorage.setItem("edvance_invoices", JSON.stringify(initialInvoices));
    }

    const localGrades = localStorage.getItem("edvance_grades");
    if (localGrades) setGrades(JSON.parse(localGrades));
    else {
      setGrades(initialGrades);
      localStorage.setItem("edvance_grades", JSON.stringify(initialGrades));
    }

    const localMessages = localStorage.getItem("edvance_messages");
    if (localMessages) setMessages(JSON.parse(localMessages));
    else {
      setMessages(initialMessages);
      localStorage.setItem("edvance_messages", JSON.stringify(initialMessages));
    }

    const localUser = localStorage.getItem("edvance_current_user");
    if (localUser) setCurrentUser(JSON.parse(localUser));
  }, []);

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
    };
    const updatedInvoices = [...invoices, newInv];
    setInvoices(updatedInvoices);
    localStorage.setItem("edvance_invoices", JSON.stringify(updatedInvoices));
  };

  const addTeacher = (teacherData: Omit<Teacher, "id">) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: "T" + Math.floor(Math.random() * 900 + 100),
    };
    const updated = [...teachers, newTeacher];
    setTeachers(updated);
    localStorage.setItem("edvance_teachers", JSON.stringify(updated));
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
        registerSchool,
        students,
        addStudent,
        teachers,
        addTeacher,
        invoices,
        addInvoice,
        payInvoice,
        grades,
        submitGrade,
        approveGrade,
        messages,
        sendMessage,
        currentUser,
        setCurrentUser: updateCurrentUser,
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
