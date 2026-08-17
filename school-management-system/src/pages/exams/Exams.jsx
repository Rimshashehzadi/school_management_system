import { useState, useEffect } from 'react';
import { Plus, Search, FileText, Eye, Edit, Trash2, X } from 'lucide-react';
import { getData, saveData } from '../../utils/storage';

const initialExams = [
  { id: 1, name: 'Mid Term Examination', class: '10-A', date: '2026-08-15', status: 'Completed', totalMarks: 100 },
  { id: 2, name: 'Unit Test - 2', class: '9-B', date: '2026-08-18', status: 'Upcoming', totalMarks: 50 },
  { id: 3, name: 'Final Examination', class: '8-A', date: '2026-08-25', status: 'Upcoming', totalMarks: 100 },
  { id: 4, name: 'Monthly Test', class: '10-B', date: '2026-08-10', status: 'Completed', totalMarks: 40 },
];

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [viewExam, setViewExam] = useState(null);

  const [form, setForm] = useState({
    name: '',
    class: '',
    date: '',
    totalMarks: '',
    status: 'Upcoming',
  });

  useEffect(() => {
    const data = getData('exams', initialExams);
    setExams(data);
  }, []);

  const saveExams = (data) => {
    setExams(data);
    saveData('exams', data);
  };

  const filtered = exams.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.class.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingExam(null);
    setForm({ name: '', class: '', date: '', totalMarks: '', status: 'Upcoming' });
    setShowModal(true);
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setForm({ ...exam });
    setShowModal(true);
  };

  const openView = (exam) => {
    setViewExam(exam);
    setShowView(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.class || !form.date) return;

    if (editingExam) {
      const updated = exams.map((e) =>
        e.id === editingExam.id ? { ...form, id: e.id } : e
      );
      saveExams(updated);
    } else {
      const newExam = { ...form, id: Date.now(), totalMarks: Number(form.totalMarks) || 100 };
      saveExams([newExam, ...exams]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      saveExams(exams.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Results</h1>
          <p className="text-slate-500 mt-1">Manage examinations</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Exam
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search exams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Exam Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Class</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Marks</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((exam) => (
              <tr key={exam.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="font-medium text-slate-900">{exam.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{exam.class}</td>
                <td className="px-6 py-4 text-slate-600">{exam.date}</td>
                <td className="px-6 py-4 text-slate-600">{exam.totalMarks}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openView(exam)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(exam)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingExam ? 'Edit Exam' : 'Create New Exam'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    value={form.class}
                    onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={form.totalMarks}
                    onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                {editingExam ? 'Update Exam' : 'Create Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showView && viewExam && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Exam Details</h2>
              <button onClick={() => setShowView(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Exam Name</span>
                <span className="font-medium">{viewExam.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class</span>
                <span className="font-medium">{viewExam.class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium">{viewExam.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Marks</span>
                <span className="font-medium">{viewExam.totalMarks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className={`font-medium ${viewExam.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {viewExam.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowView(false)}
              className="w-full mt-8 px-4 py-2.5 bg-slate-100 rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}