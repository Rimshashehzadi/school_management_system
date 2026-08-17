import { useState } from 'react';
import { Calendar, Check, X } from 'lucide-react';

const classes = ['8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];

const students = [
  { id: 1, name: 'Rahul Sharma', roll: '101' },
  { id: 2, name: 'Ananya Patel', roll: '102' },
  { id: 3, name: 'Arjun Singh', roll: '103' },
  { id: 4, name: 'Priya Verma', roll: '104' },
  { id: 5, name: 'Karan Mehta', roll: '105' },
];

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [attendance, setAttendance] = useState({});

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present',
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-500 mt-1">Mark daily student attendance</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input type="date" className="text-sm focus:outline-none" defaultValue={new Date().toISOString().split('T')[0]} />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">Class {selectedClass}</h2>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium">
            Save Attendance
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {students.map((student) => {
            const status = attendance[student.id] || 'present';
            return (
              <div key={student.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{student.name}</p>
                  <p className="text-sm text-slate-500">Roll: {student.roll}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      status === 'present'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Check className="w-4 h-4" /> Present
                  </button>
                  <button
                    onClick={() => toggleAttendance(student.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      status === 'absent'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <X className="w-4 h-4" /> Absent
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}