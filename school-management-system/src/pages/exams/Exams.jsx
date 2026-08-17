import { useState } from 'react';
import { Plus, Search, FileText, Eye, Edit, Trash2, Download } from 'lucide-react';

const examsList = [
  { id: 1, name: 'Mid Term Examination', class: '10-A', date: '15 Aug 2026', status: 'Completed', totalStudents: 42 },
  { id: 2, name: 'Unit Test - 2', class: '9-B', date: '18 Aug 2026', status: 'Upcoming', totalStudents: 38 },
  { id: 3, name: 'Final Examination', class: '8-A', date: '25 Aug 2026', status: 'Upcoming', totalStudents: 45 },
  { id: 4, name: 'Monthly Test', class: '10-B', date: '10 Aug 2026', status: 'Completed', totalStudents: 40 },
];

const resultsData = [
  { id: 1, name: 'Rahul Sharma', roll: '101', marks: 87, grade: 'A', status: 'Pass' },
  { id: 2, name: 'Ananya Patel', roll: '102', marks: 92, grade: 'A+', status: 'Pass' },
  { id: 3, name: 'Arjun Singh', roll: '103', marks: 64, grade: 'B', status: 'Pass' },
  { id: 4, name: 'Priya Verma', roll: '104', marks: 41, grade: 'C', status: 'Pass' },
  { id: 5, name: 'Karan Mehta', roll: '105', marks: 28, grade: 'F', status: 'Fail' },
];

export default function Exams() {
  const [activeTab, setActiveTab] = useState('exams'); // exams | results
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Results</h1>
          <p className="text-slate-500 mt-1">Manage examinations and student results</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Create Exam
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'exams'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Exams
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'results'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Results
        </button>
      </div>

      {/* ===================== EXAMS TAB ===================== */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Exam Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Class</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Students</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {examsList.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-50 transition">
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
                  <td className="px-6 py-4 text-slate-600">{exam.totalStudents}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        exam.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===================== RESULTS TAB ===================== */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Mid Term Examination</option>
              <option>Unit Test - 2</option>
              <option>Final Examination</option>
            </select>
            <select className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Class 10-A</option>
              <option>Class 9-B</option>
              <option>Class 8-A</option>
            </select>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Student</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Roll No</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Marks</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Grade</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {resultsData.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{result.name}</td>
                    <td className="px-6 py-4 text-slate-600">{result.roll}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{result.marks}</td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-indigo-600">{result.grade}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          result.status === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {result.status}
                      </span>
                    </td>
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
      )}

      {/* Create Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Exam</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mid Term Examination"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>8-A</option>
                    <option>9-B</option>
                    <option>10-A</option>
                    <option>10-B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                Create Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}