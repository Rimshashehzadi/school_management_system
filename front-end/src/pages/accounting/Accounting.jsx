import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Wallet, Trash2 } from 'lucide-react';
import { getData, saveData } from '../../utils/storage'

export default function Accounting() {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: 'income',
    title: '',
    amount: '',
    category: 'Fees',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    setTransactions(getData('accounting', []));
  }, []);

  const saveTransactions = (data) => {
    setTransactions(data);
    saveData('accounting', data);
  };

  const handleAdd = () => {
    if (!form.title || !form.amount) return;

    const newTransaction = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
    };

    const updated = [newTransaction, ...transactions];
    saveTransactions(updated);
    setShowModal(false);
    setForm({
      type: 'income',
      title: '',
      amount: '',
      category: 'Fees',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      const updated = transactions.filter((t) => t.id !== id);
      saveTransactions(updated);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accounting</h1>
          <p className="text-slate-500 mt-1">Track school income and expenses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Expense</p>
              <p className="text-2xl font-bold text-rose-600 mt-1">₹{totalExpense.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <TrendingDown className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Wallet className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Title</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Category</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Type</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">Amount</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                  No transactions yet. Add your first income or expense.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{t.title}</td>
                  <td className="px-6 py-4 text-slate-600">{t.category}</td>
                  <td className="px-6 py-4 text-slate-600">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      t.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Add Transaction</h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setForm({ ...form, type: 'income' })}
                  className={`flex-1 py-2.5 rounded-xl font-medium ${
                    form.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Income
                </button>
                <button
                  onClick={() => setForm({ ...form, type: 'expense' })}
                  className={`flex-1 py-2.5 rounded-xl font-medium ${
                    form.type === 'expense' ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  Expense
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Monthly Fees Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Fees</option>
                  <option>Salary</option>
                  <option>Maintenance</option>
                  <option>Utilities</option>
                  <option>Transport</option>
                  <option>Other</option>
                </select>
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

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}