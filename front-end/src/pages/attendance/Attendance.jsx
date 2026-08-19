import { useState, useEffect } from 'react';
import { Calendar, Check, X, Save } from 'lucide-react';
import { getData, saveData } from  '../../utils/storage'

const classList = ['8-A', '8-B', '9-A', '9-B', '10-A', '10-B'];

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const allStudents = getData('students', []);
    const classStudents = allStudents.filter((s) => s.class === selectedClass && s.status === 'Active');
    setStudents(classStudents);

    // Load saved attendance for this class + date
    const allAttendance = getData('attendance', {});
    const key = `${selectedClass}_${selectedDate}`;
    setAttendance(allAttendance[key] || {});
  }, [selectedClass, selectedDate]);

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSave = () => {
    const allAttendance = getData('attendance', {});
    const key = `${selectedClass}_${selectedDate}`;
    allAttendance[key] = attendance;
    saveData('attendance', allAttendance);

    setMessage('Attendance saved successfully!');
    setTimeout(() => setMessage(''), 2500);
  };

  const presentCount = Object.values(attendance).filter((v) => v === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="text-slate-500 mt-1">Mark and save daily student attendance</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm focus:outline-none"
          />
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {classList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {message && (
          <span className="text-sm text-emerald-600 font-medium">{message}</span>
        )}
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm">
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl">
          Present: <strong>{presentCount}</strong>
        </div>
        <div className="bg-rose-50 text-rose-700 px-4 py-2 rounded-xl">
          Absent: <strong>{absentCount}</strong>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">Class {selectedClass}</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save Attendance
          </button>
        </div>

        {students.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No active students found in this class.
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}