import { useState } from 'react';
import { Download, Upload, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { getData, saveData } from '../../utils/storage';

export default function Backup() {
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // ========== BACKUP ==========
  const handleBackup = () => {
    const backupData = {
      students: getData('students', []),
      fees: getData('fees', []),
      staff: getData('staff', []),
      exams: getData('exams', []),
      accounting: getData('accounting', []),
      attendance: getData('attendance', {}),
      backupDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `edumanage-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showMessage('success', 'Backup downloaded successfully!');
  };

  // ========== RESTORE ==========
  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (!data.students || !data.fees) {
          showMessage('error', 'Invalid backup file!');
          return;
        }

        // Restore all data
        saveData('students', data.students || []);
        saveData('fees', data.fees || []);
        saveData('staff', data.staff || []);
        saveData('exams', data.exams || []);
        saveData('accounting', data.accounting || []);
        saveData('attendance', data.attendance || {});

        showMessage('success', 'Data restored successfully! Please refresh the page.');
      } catch (err) {
        showMessage('error', 'Failed to restore. Invalid file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Backup & Restore</h1>
        <p className="text-slate-500 mt-1">Download or restore your school data</p>
      </div>

      {message.text && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
            <Download className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Backup Data</h2>
          <p className="text-sm text-slate-500 mb-6">
            Download all your students, fees, staff, exams and accounting data as a JSON file.
          </p>
          <button
            onClick={handleBackup}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition"
          >
            <Download className="w-5 h-5" />
            Download Backup
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Restore Data</h2>
          <p className="text-sm text-slate-500 mb-6">
            Upload a previously downloaded backup file to restore all your data.
          </p>
          <label className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-3 rounded-xl font-medium transition cursor-pointer">
            <Upload className="w-5 h-5" />
            Upload Backup File
            <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <div className="flex gap-3">
          <Database className="w-5 h-5 text-slate-400 mt-0.5" />
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-900 mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Backup file contains all your data (Students, Fees, Staff, Exams, Accounting, Attendance).</li>
              <li>Restoring will replace your current data.</li>
              <li>Keep your backup files safe.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}