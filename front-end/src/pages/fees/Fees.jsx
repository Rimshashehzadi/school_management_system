import { useState, useEffect } from 'react';
import { CreditCard, Printer, X } from 'lucide-react';
import { getData, saveData } from '../../utils/storage';

const initialFees = [
  { id: 1, name: 'Rahul Sharma', class: '10-A', amount: 4500, status: 'Paid', date: '12 Aug 2026', receiptNo: 'RCP-1001' },
  { id: 2, name: 'Ananya Patel', class: '9-B', amount: 4200, status: 'Pending', date: '-', receiptNo: '-' },
  { id: 3, name: 'Arjun Singh', class: '8-A', amount: 3800, status: 'Paid', date: '10 Aug 2026', receiptNo: 'RCP-1002' },
  { id: 4, name: 'Priya Verma', class: '10-B', amount: 4500, status: 'Overdue', date: '-', receiptNo: '-' },
];

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const [form, setForm] = useState({
    name: '',
    class: '',
    amount: '',
  });

  useEffect(() => {
    setFees(getData('fees', initialFees));
  }, []);

  const saveFees = (data) => {
    setFees(data);
    saveData('fees', data);
  };

  const handleCollect = () => {
    if (!form.name || !form.amount) return;

    const newFee = {
      id: Date.now(),
      name: form.name,
      class: form.class || '-',
      amount: Number(form.amount),
      status: 'Paid',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      receiptNo: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updated = [newFee, ...fees];
    saveFees(updated);
    setSelectedFee(newFee);
    setShowCollectModal(false);
    setShowReceipt(true);
    setForm({ name: '', class: '', amount: '' });
  };

  const openReceipt = (fee) => {
    setSelectedFee(fee);
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + Number(f.amount), 0);
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + Number(f.amount), 0);
  const totalOverdue = fees.filter(f => f.status === 'Overdue').reduce((sum, f) => sum + Number(f.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-500 mt-1">Track and collect student fees</p>
        </div>
        <button
          onClick={() => setShowCollectModal(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <CreditCard className="w-5 h-5" />
          Collect Fee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Total Collected</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500">Overdue</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">₹{totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {fees.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No fee records found.</div>
        ) : (
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
              {fees.map((fee) => (
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
                    {fee.status === 'Paid' && (
                      <button
                        onClick={() => openReceipt(fee)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Collect Modal + Receipt Modal remain the same as before */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Collect Fee</h2>
              <button onClick={() => setShowCollectModal(false)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                <input type="text" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹)</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCollectModal(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium">Cancel</button>
              <button onClick={handleCollect} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">Collect & Print</button>
            </div>
          </div>
        </div>
      )}

      {showReceipt && selectedFee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div id="receipt" className="p-8">
              <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
                <h2 className="text-xl font-bold text-slate-900">EduManage School</h2>
                <p className="text-sm text-slate-500">Fee Receipt</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Receipt No:</span><span className="font-medium">{selectedFee.receiptNo}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-medium">{selectedFee.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Student Name:</span><span className="font-medium">{selectedFee.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Class:</span><span className="font-medium">{selectedFee.class}</span></div>
                <div className="flex justify-between border-t border-dashed border-slate-300 pt-3 mt-3">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-lg text-emerald-600">₹{selectedFee.amount}</span>
                </div>
              </div>
              <div className="mt-8 text-center text-xs text-slate-400">Thank you for your payment!</div>
            </div>
            <div className="flex gap-3 p-4 bg-slate-50 border-t">
              <button onClick={() => setShowReceipt(false)} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium">Close</button>
              <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700">
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}