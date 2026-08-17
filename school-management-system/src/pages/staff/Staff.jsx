import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserCog, X } from 'lucide-react';
import { getData, saveData } from '../../utils/storage';

const initialStaff = [
  { id: 1, name: 'Mrs. Sunita Sharma', role: 'Teacher', subject: 'Mathematics', phone: '9876543210', email: 'sunita@school.com', status: 'Active' },
  { id: 2, name: 'Mr. Rajesh Kumar', role: 'Teacher', subject: 'Science', phone: '9876543211', email: 'rajesh@school.com', status: 'Active' },
  { id: 3, name: 'Ms. Priya Singh', role: 'Teacher', subject: 'English', phone: '9876543212', email: 'priya@school.com', status: 'Active' },
  { id: 4, name: 'Mr. Amit Verma', role: 'Accountant', subject: '-', phone: '9876543213', email: 'amit@school.com', status: 'Active' },
  { id: 5, name: 'Mrs. Kavita Joshi', role: 'Admin', subject: '-', phone: '9876543214', email: 'kavita@school.com', status: 'Inactive' },
];

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Teacher',
    subject: '',
    phone: '',
    email: '',
    status: 'Active',
  });

  useEffect(() => {
    setStaffList(getData('staff', initialStaff));
  }, []);

  const saveStaff = (data) => {
    setStaffList(data);
    saveData('staff', data);
  };

  const filtered = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingStaff(null);
    setForm({ name: '', role: 'Teacher', subject: '', phone: '', email: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (staff) => {
    setEditingStaff(staff);
    setForm({ ...staff });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;

    if (editingStaff) {
      const updated = staffList.map((s) =>
        s.id === editingStaff.id ? { ...form, id: s.id } : s
      );
      saveStaff(updated);
    } else {
      const newStaff = { ...form, id: Date.now() };
      saveStaff([newStaff, ...staffList]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      saveStaff(staffList.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500 mt-1">Manage teachers and school staff</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, role or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Name</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Role</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Subject</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Phone</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Status</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center">
                      <UserCog className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{staff.name}</p>
                      <p className="text-xs text-slate-500">{staff.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{staff.subject}</td>
                <td className="px-6 py-4 text-slate-600">{staff.phone}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(staff)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(staff.id)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingStaff ? 'Edit Staff' : 'Add New Staff'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Teacher</option>
                    <option>Admin</option>
                    <option>Accountant</option>
                    <option>Principal</option>
                    <option>Librarian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject / Dept</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                {editingStaff ? 'Update Staff' : 'Save Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}