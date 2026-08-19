import { useEffect, useState } from 'react';
import { Users, ClipboardCheck, CreditCard, TrendingUp, Wallet } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import { getData } from '../../utils/storage';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalFeesCollected: 0,
    pendingFees: 0,
    totalIncome: 0,
    totalExpense: 0,
  });

  useEffect(() => {
    const students = getData('students', []);
    const fees = getData('fees', []);
    const accounting = getData('accounting', []);

    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;

    const totalFeesCollected = fees
      .filter(f => f.status === 'Paid')
      .reduce((sum, f) => sum + Number(f.amount || 0), 0);

    const pendingFees = fees
      .filter(f => f.status === 'Pending' || f.status === 'Overdue')
      .reduce((sum, f) => sum + Number(f.amount || 0), 0);

    const totalIncome = accounting
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpense = accounting
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    setStats({
      totalStudents,
      activeStudents,
      totalFeesCollected,
      pendingFees,
      totalIncome,
      totalExpense,
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={ClipboardCheck}
          color="bg-emerald-600"
        />
        <StatCard
          title="Fees Collected"
          value={`₹${(stats.totalFeesCollected / 1000).toFixed(1)}K`}
          icon={CreditCard}
          color="bg-amber-500"
        />
        <StatCard
          title="Pending Fees"
          value={`₹${(stats.pendingFees / 1000).toFixed(1)}K`}
          icon={TrendingUp}
          color="bg-rose-500"
        />
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Accounting Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Income</span>
              <span className="font-semibold text-emerald-600">₹{stats.totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Expense</span>
              <span className="font-semibold text-rose-600">₹{stats.totalExpense.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-100">
              <span className="font-medium text-slate-900">Balance</span>
              <span className={`font-bold ${stats.totalIncome - stats.totalExpense >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                ₹{(stats.totalIncome - stats.totalExpense).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Quick Tips</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Collect pending fees regularly to improve cash flow.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Mark attendance daily for accurate reports.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-600">•</span>
              Keep accounting updated for better financial overview.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}