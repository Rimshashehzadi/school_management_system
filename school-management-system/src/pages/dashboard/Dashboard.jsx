import { Users, ClipboardCheck, CreditCard, TrendingUp } from 'lucide-react';
import StatCard from  '../../components/ui/StatCard';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value="1,248"
          icon={Users}
          color="bg-indigo-600"
        />
        <StatCard
          title="Today's Attendance"
          value="94%"
          icon={ClipboardCheck}
          color="bg-emerald-600"
        />
        <StatCard
          title="Fees Collected"
          value="₹4.2L"
          icon={CreditCard}
          color="bg-amber-500"
        />
        <StatCard
          title="Pending Fees"
          value="₹86K"
          icon={TrendingUp}
          color="bg-rose-500"
        />
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100 transition">
              + Add New Student
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 transition">
              Mark Attendance
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 transition">
              Collect Fees
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 transition">
              Generate Report
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { text: 'Fee received from Rahul Sharma (Class 10-A)', time: '10 min ago', type: 'success' },
              { text: 'New student admitted: Ananya Patel', time: '25 min ago', type: 'info' },
              { text: 'Attendance marked for Class 8-B', time: '1 hour ago', type: 'info' },
              { text: 'Exam results published - Mid Term', time: '2 hours ago', type: 'warning' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  item.type === 'success' ? 'bg-emerald-500' :
                  item.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}