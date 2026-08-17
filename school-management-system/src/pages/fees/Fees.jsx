import { CreditCard, Download } from 'lucide-react';

const feeRecords = [
  { id: 1, name: 'Rahul Sharma', class: '10-A', amount: 4500, status: 'Paid', date: '12 Aug 2026' },
  { id: 2, name: 'Ananya Patel', class: '9-B', amount: 4200, status: 'Pending', date: '-' },
  { id: 3, name: 'Arjun Singh', class: '8-A', amount: 3800, status: 'Paid', date: '10 Aug 2026' },
  { id: 4, name: 'Priya Verma', class: '10-B', amount: 4500, status: 'Overdue', date: '-' },
];

export default function Fees() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-500 mt-1">Track and collect student fees</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium">
          <CreditCard className="w-5 h-5" />
          Collect Fee
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₹8,300</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹4,200</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">₹4,500</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Student</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Class</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Amount</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Date</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {feeRecords.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{fee.name}</td>
                <td className="px-6 py-4 text-slate-600">{fee.class}</td>
                <td className="px-6 py-4 text-slate-900 font-medium">₹{fee.amount}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                    fee.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {fee.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{fee.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}