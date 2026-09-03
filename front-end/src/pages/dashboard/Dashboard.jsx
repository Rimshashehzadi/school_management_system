import { useEffect, useState } from "react";
import {
  Users,
  ClipboardCheck,
  CreditCard,
  TrendingUp,
  Wallet,
  GraduationCap,
  UserRound,
  BookOpen,
  FileText,
  Bell,
  CalendarDays,
} from "lucide-react";
import StatCard from "../../components/ui/StatCard";

const DASHBOARD_API = "http://localhost:5000/api/dashboard/stats";

// ==================================================
// GET AUTH TOKEN
// ==================================================

const getToken = () => {
  const token = localStorage.getItem("token");

  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token.trim() === ""
  ) {
    return null;
  }

  return token.trim();
};

// ==================================================
// DASHBOARD
// ==================================================

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    parents: 0,
    classes: 0,
    subjects: 0,
    exams: 0,
    notices: 0,
    users: 0,
    timetables: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH DASHBOARD STATISTICS
  // ==================================================

  const fetchDashboardStats = async () => {
    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(DASHBOARD_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      // ==================================================
      // AUTHENTICATION ERROR
      // ==================================================

      if (response.status === 401) {
        localStorage.removeItem("token");
        setError("Your session has expired. Please login again.");
        return;
      }

      // ==================================================
      // PERMISSION ERROR
      // ==================================================

      if (response.status === 403) {
        setError(
          "You do not have permission to view dashboard statistics."
        );
        return;
      }

      // ==================================================
      // OTHER API ERRORS
      // ==================================================

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch dashboard statistics"
        );
      }

      // ==================================================
      // SET API DATA
      // ==================================================

      setStats({
        students: Number(result.data?.students || 0),
        teachers: Number(result.data?.teachers || 0),
        parents: Number(result.data?.parents || 0),
        classes: Number(result.data?.classes || 0),
        subjects: Number(result.data?.subjects || 0),
        exams: Number(result.data?.exams || 0),
        notices: Number(result.data?.notices || 0),
        users: Number(result.data?.users || 0),
        timetables: Number(result.data?.timetables || 0),
      });
    } catch (err) {
      console.error("DASHBOARD STATS FETCH ERROR:", err);

      setError(
        err.message || "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            Loading dashboard statistics...
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center text-slate-400">
          Loading statistics...
        </div>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="space-y-8">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ==================================================
          MAIN STATISTICS
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={Users}
          color="bg-indigo-600"
        />

        <StatCard
          title="Total Teachers"
          value={stats.teachers}
          icon={GraduationCap}
          color="bg-emerald-600"
        />

        <StatCard
          title="Total Parents"
          value={stats.parents}
          icon={UserRound}
          color="bg-amber-500"
        />

        <StatCard
          title="Total Classes"
          value={stats.classes}
          icon={ClipboardCheck}
          color="bg-rose-500"
        />
      </div>

      {/* ==================================================
          ACADEMIC STATISTICS
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Subjects"
          value={stats.subjects}
          icon={BookOpen}
          color="bg-blue-600"
        />

        <StatCard
          title="Total Exams"
          value={stats.exams}
          icon={FileText}
          color="bg-purple-600"
        />

        <StatCard
          title="Total Notices"
          value={stats.notices}
          icon={Bell}
          color="bg-orange-500"
        />

        <StatCard
          title="Timetables"
          value={stats.timetables}
          icon={CalendarDays}
          color="bg-cyan-600"
        />
      </div>

      {/* ==================================================
          SYSTEM SUMMARY
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SYSTEM SUMMARY */}

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>

            <h2 className="font-semibold text-slate-900">
              System Summary
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Students
              </span>

              <span className="font-semibold text-slate-900">
                {stats.students}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Teachers
              </span>

              <span className="font-semibold text-slate-900">
                {stats.teachers}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Parents
              </span>

              <span className="font-semibold text-slate-900">
                {stats.parents}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Users
              </span>

              <span className="font-semibold text-slate-900">
                {stats.users}
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <span className="font-medium text-slate-900">
                Total Records
              </span>

              <span className="font-bold text-indigo-600">
                {stats.students +
                  stats.teachers +
                  stats.parents +
                  stats.classes +
                  stats.subjects +
                  stats.exams}
              </span>
            </div>
          </div>
        </div>

        {/* QUICK TIPS */}

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>

            <h2 className="font-semibold text-slate-900">
              Quick Tips
            </h2>
          </div>

          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Keep student records updated regularly.
            </li>

            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Mark attendance daily for accurate reports.
            </li>

            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Keep exams and timetable information updated.
            </li>

            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Publish important notices for parents and students.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}