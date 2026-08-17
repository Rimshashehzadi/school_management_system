import { Users, ClipboardCheck, CreditCard, BarChart3, Download } from 'lucide-react';
import { getData } from '../../utils/storage'

export default function Reports() {
  const students = getData('students', []);
  const fees = getData('fees', []);
  const staff = getData('staff', []);
  const accounting = getData('accounting', []);

  const downloadReport = (type) => {
    let content = '';
    let filename = '';

    if (type === 'students') {
      filename = 'students-report.csv';
      content = 'Name,Class,Roll No,Phone,Status\n';
      students.forEach((s) => {
        content += `${s.name},${s.class},${s.roll},${s.phone},${s.status}\n`;
      });
    }

    if (type === 'fees') {
      filename = 'fees-report.csv';
      content = 'Student,Class,Amount,Status,Date\n';
      fees.forEach((f) => {
        content += `${f.name},${f.class},${f.amount},${f.status},${f.date}\n`;
      });
    }

    if (type === 'staff') {
      filename = 'staff-report.csv';
      content = 'Name,Role,Subject,Phone,Status\n';
      staff.forEach((s) => {
        content += `${s.name},${s.role},${s.subject},${s.phone},${s.status}\n`;
      });
    }

    if (type === 'accounting') {
      filename = 'accounting-report.csv';
      content = 'Title,Category,Type,Amount,Date\n';
      accounting.forEach((t) => {
        content += `${t.title},${t.category},${t.type},${t.amount},${t.date}\n`;
      });
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const reports = [
    { id: 'students', title: 'Student Strength Report', desc: 'Complete list of all students', icon: Users },
    { id: 'fees', title: 'Fee Collection Report', desc: 'Paid and pending fees', icon: CreditCard },
    { id: 'staff', title: 'Staff Report', desc: 'Teaching and non-teaching staff', icon: Users },
    { id: 'accounting', title: 'Accounting Report', desc: 'Income and expense summary', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500 mt-1">Download school reports</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Available Reports</h2>
        </div>

        <div className="divide-y divide-slate-50">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <report.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{report.title}</p>
                  <p className="text-sm text-slate-500">{report.desc}</p>
                </div>
              </div>
              <button
                onClick={() => downloadReport(report.id)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-sm font-medium transition"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}