import { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Command,
} from "lucide-react";

function Navbar({ onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-[76px] border-b border-slate-200 bg-white/90 backdrop-blur-xl">

      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LEFT ================= */}

        <div className="flex items-center gap-4">

          {/* Mobile Menu */}

          <button
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div>
            <h2 className="text-[17px] font-bold tracking-tight text-slate-900 sm:text-lg">
              Dashboard
            </h2>

            <p className="hidden text-xs text-slate-500 sm:block">
              Overview of your school
            </p>
          </div>

        </div>

        {/* ================= RIGHT ================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search */}

          <button className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 transition hover:border-indigo-200 hover:bg-white hover:text-indigo-600 md:flex">

            <Search size={17} />

            <span className="text-xs">
              Search
            </span>

            <span className="ml-4 flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-400">
              <Command size={9} />
              K
            </span>

          </button>

          {/* Mobile Search */}

          <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 md:hidden">
            <Search size={19} />
          </button>

          {/* Notification */}

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-slate-200 hover:bg-slate-50 hover:text-indigo-600">

            <Bell size={19} />

            <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />

          </button>

          {/* Divider */}

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile */}

          <div className="relative">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            >

              {/* Avatar */}

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">
                A
              </div>

              {/* User Info */}

              <div className="hidden text-left lg:block">

                <p className="text-xs font-bold text-slate-800">
                  Admin
                </p>

                <p className="text-[10px] text-slate-500">
                  Administrator
                </p>

              </div>

              <ChevronDown
                size={15}
                className="hidden text-slate-400 lg:block"
              />

            </button>

            {/* ================= PROFILE DROPDOWN ================= */}

            {profileOpen && (
              <div className="absolute right-0 top-14 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">

                <div className="border-b border-slate-100 px-3 py-3">

                  <p className="text-sm font-semibold text-slate-900">
                    Admin
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    admin@schoolflow.com
                  </p>

                </div>

                <div className="py-1">

                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600">

                    <User size={17} />

                    Profile

                  </button>

                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600">

                    <Settings size={17} />

                    Settings

                  </button>

                </div>

                <div className="border-t border-slate-100 pt-1">

                  <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50">

                    <LogOut size={17} />

                    Sign out

                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;