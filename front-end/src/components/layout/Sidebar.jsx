import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CreditCard,
  FileText,
  BookOpen,
  ClipboardList,
  GraduationCap,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  X,
  Wallet,
  Database,
  CalendarDays,
  Megaphone,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const menuItems = [
    // ==========================================
    // DASHBOARD
    // ==========================================
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["Admin", "Teacher", "Parent", "Student"],
    },

    // ==========================================
    // STUDENTS
    // ==========================================
    {
      name: "Students",
      path: "/students",
      icon: Users,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // PARENTS
    // ==========================================
    {
      name: "Parents",
      path: "/parents",
      icon: Users,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // PARENT-STUDENT RELATIONSHIP
    // ==========================================
    {
      name: "Parent-Student",
      path: "/parent-students",
      icon: Users,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // NOTICES
    // ==========================================
    {
      name: "Notices",
      path: "/notices",
      icon: Megaphone,
      roles: ["Admin", "Teacher", "Parent", "Student"],
    },

    // ==========================================
    // ATTENDANCE
    // ==========================================
    {
      name: "Attendance",
      path: "/attendance",
      icon: ClipboardCheck,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // FEES
    // ==========================================
    {
      name: "Fees",
      path: "/fees",
      icon: CreditCard,
      roles: ["Admin"],
    },

    // ==========================================
    // EXAMS
    // ==========================================
    {
      name: "Exams",
      path: "/exams",
      icon: FileText,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // EXAM SUBJECTS
    // ==========================================
    {
      name: "Exam Subjects",
      path: "/exam-subjects",
      icon: BookOpen,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // MARKS
    // ==========================================
    {
      name: "Marks",
      path: "/marks",
      icon: ClipboardList,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // RESULTS
    // ==========================================
    {
      name: "Results",
      path: "/results",
      icon: GraduationCap,
      roles: ["Admin", "Teacher", "Parent", "Student"],
    },

    // ==========================================
    // TIMETABLE
    // ==========================================
    {
      name: "Timetable",
      path: "/timetable",
      icon: CalendarDays,
      roles: ["Admin", "Teacher", "Student"],
    },

    // ==========================================
    // STAFF
    // ==========================================
    {
      name: "Staff",
      path: "/staff",
      icon: UserCog,
      roles: ["Admin"],
    },

    // ==========================================
    // ACCOUNTING
    // ==========================================
    {
      name: "Accounting",
      path: "/accounting",
      icon: Wallet,
      roles: ["Admin"],
    },

    // ==========================================
    // REPORTS
    // ==========================================
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
      roles: ["Admin", "Teacher"],
    },

    // ==========================================
    // BACKUP
    // ==========================================
    {
      name: "Backup",
      path: "/backup",
      icon: Database,
      roles: ["Admin"],
    },

    // ==========================================
    // SETTINGS
    // ==========================================
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["Admin"],
    },
  ];

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==========================================
  // DEFAULT ROLE
  // ==========================================

  const userRole = user?.role || "ADMIN";

  const normalizedRole =
    userRole.charAt(0).toUpperCase() +
    userRole.slice(1).toLowerCase();

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(normalizedRole)
  );
  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-white
          border-r border-slate-200
          shadow-sm
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ==========================================
            LOGO / HEADER
        ========================================== */}

        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-800">
                School
              </h1>

              <p className="text-xs text-slate-500">
                Management System
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}

          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* ==========================================
            USER ROLE
        ========================================== */}

        <div className="mx-4 mt-4 rounded-xl bg-blue-50 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">
            Logged in as
          </p>

          <p className="mt-1 text-sm font-semibold text-blue-700">
            {userRole}
          </p>
        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="mt-5 h-[calc(100vh-180px)] overflow-y-auto px-3 pb-5">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3
                    rounded-xl px-4 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }
                    `
                  }
                >
                  <Icon
                    size={20}
                    className="shrink-0"
                  />

                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* ==========================================
              LOGOUT
          ========================================== */}

          <div className="mt-5 border-t border-slate-200 pt-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="
                flex w-full items-center gap-3
                rounded-xl px-4 py-3
                text-sm font-medium
                text-red-600
                transition-all
                hover:bg-red-50
              "
            >
              <LogOut size={20} />

              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}