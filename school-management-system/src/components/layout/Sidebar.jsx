import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  BriefcaseBusiness,
  Calculator,
  BarChart3,
  Settings,
  DatabaseBackup,
  UserCog,
  X,
  School,
  ChevronRight,
  LogOut,
} from "lucide-react";

const mainMenu = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    path: "/students",
    icon: Users,
  },
  {
    name: "Admissions",
    path: "/admissions",
    icon: UserPlus,
  },
  {
    name: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
  },
  {
    name: "Fees",
    path: "/fees",
    icon: CreditCard,
  },
  {
    name: "Exams & Results",
    path: "/exams",
    icon: GraduationCap,
  },
  {
    name: "Staff",
    path: "/staff",
    icon: BriefcaseBusiness,
  },
  {
    name: "Accounting",
    path: "/accounting",
    icon: Calculator,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
];

const managementMenu = [
  {
    name: "Users & Roles",
    path: "/users",
    icon: UserCog,
  },
  {
    name: "Backup & Restore",
    path: "/backup",
    icon: DatabaseBackup,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[270px] flex-col
          bg-[#0F172A]
          text-white
          shadow-2xl
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ================= LOGO ================= */}

        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <School
                size={23}
                strokeWidth={2.2}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-white">
                SchoolFlow
              </h1>

              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                School Management
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}

        <div className="flex-1 overflow-y-auto px-3 py-6">

          {/* Main Menu */}

          <div>
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Main Menu
            </p>

            <nav className="space-y-1">
              {mainMenu.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/30"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          size={18}
                          strokeWidth={isActive ? 2.3 : 1.8}
                          className={
                            isActive
                              ? "text-white"
                              : "text-slate-500 group-hover:text-slate-300"
                          }
                        />

                        <span className="flex-1">
                          {item.name}
                        </span>

                        {isActive && (
                          <ChevronRight
                            size={15}
                            className="text-white/70"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Management */}

          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Management
            </p>

            <nav className="space-y-1">
              {managementMenu.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/30"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`
                    }
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                    />

                    <span>
                      {item.name}
                    </span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ================= SCHOOL INFO ================= */}

        <div className="border-t border-white/10 p-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                <School
                  size={19}
                  className="text-indigo-400"
                />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  SchoolFlow
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Administration Panel
                </p>
              </div>

            </div>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[0.08] hover:text-white">
              <LogOut size={14} />
              Sign out
            </button>

          </div>

          <p className="mt-4 text-center text-[10px] text-slate-600">
            SchoolFlow v1.0.0
          </p>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;