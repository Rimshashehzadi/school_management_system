import { Users, ClipboardCheck, CreditCard, TrendingUp, Download, BarChart3 } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">View and download school reports</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">1,248</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Avg Attendance</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">92%</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <ClipboardCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Fees Collected</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">₹12.4L</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Fees</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">₹2.1L</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Report List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Available Reports</h2>
        </div>

        <div className="divide-y divide-slate-50">
          {[
            { title: 'Student Strength Report', desc: 'Class-wise student count', icon: Users },
            { title: 'Attendance Report', desc: 'Monthly attendance summary', icon: ClipboardCheck },
            { title: 'Fee Collection Report', desc: 'Paid vs Pending fees', icon: CreditCard },
            { title: 'Exam Performance Report', desc: 'Class-wise result analysis', icon: BarChart3 },
            { title: 'Staff Report', desc: 'Teaching & non-teaching staff', icon: Users },
          ].map((report, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <report.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{report.title}</p>
                  <p className="text-sm text-slate-500">{report.desc}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-sm font-medium transition">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}