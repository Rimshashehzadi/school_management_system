
import { useState, useEffect } from "react";
import {
  CreditCard,
  Printer,
  X,
  Edit,
  RefreshCw,
} from "lucide-react";

const FEES_API = "http://localhost:5000/api/fees";
const STUDENTS_API = "http://localhost:5000/api/students";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [selectedFee, setSelectedFee] = useState(null);
  const [editingFee, setEditingFee] = useState(null);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    paidAmount: "",
    dueDate: "",
    status: "PAID",
  });

  // ========================================
  // TOKEN
  // ========================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ========================================
  // COMMON HEADERS
  // ========================================
  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ========================================
  // FETCH STUDENTS
  // ========================================
  const fetchStudents = async () => {
    try {
      const response = await fetch(STUDENTS_API, {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch students");
      }

      setStudents(result.data || []);
    } catch (err) {
      console.error("FETCH STUDENTS ERROR:", err);
      setError(err.message || "Failed to load students");
    }
  };

  // ========================================
  // FETCH FEES
  // ========================================
  const fetchFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(FEES_API, {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch fees");
      }

      setFees(result.data || []);
    } catch (err) {
      console.error("FETCH FEES ERROR:", err);
      setError(err.message || "Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  // ========================================
  // FORM CHANGE
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // FIND STUDENT BY NAME
  // ========================================
  const findStudentByName = (name) => {
    const enteredName = name.trim().toLowerCase();

    return students.find(
      (student) =>
        student.name?.trim().toLowerCase() === enteredName
    );
  };

  // ========================================
  // OPEN ADD MODAL
  // ========================================
  const openAddModal = () => {
    setEditingFee(null);

    setForm({
      name: "",
      amount: "",
      paidAmount: "",
      dueDate: "",
      status: "PAID",
    });

    setShowModal(true);
  };

  // ========================================
  // OPEN EDIT MODAL
  // ========================================
  const openEditModal = (fee) => {
    setEditingFee(fee);

    setForm({
      name: fee.student?.name || "",
      amount: fee.amount ?? "",
      paidAmount: fee.paidAmount ?? "",
      dueDate: fee.dueDate
        ? new Date(fee.dueDate).toISOString().split("T")[0]
        : "",
      status: fee.status || "PAID",
    });

    setShowModal(true);
  };

  // ========================================
  // ADD / UPDATE FEE
  // ========================================
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Please enter student name");
      return;
    }

    if (form.amount === "") {
      alert("Please enter total amount");
      return;
    }

    if (form.paidAmount === "") {
      alert("Please enter paid amount");
      return;
    }

    if (!form.dueDate) {
      alert("Please select due date");
      return;
    }

    const amount = Number(form.amount);
    const paidAmount = Number(form.paidAmount);

    if (Number.isNaN(amount) || amount < 0) {
      alert("Please enter a valid total amount");
      return;
    }

    if (Number.isNaN(paidAmount) || paidAmount < 0) {
      alert("Please enter a valid paid amount");
      return;
    }

    if (paidAmount > amount) {
      alert("Paid amount cannot be greater than total amount");
      return;
    }

    // ========================================
    // UPDATE EXISTING FEE
    // ========================================
    if (editingFee) {
      try {
        const response = await fetch(
          `${FEES_API}/${editingFee.id}`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify({
              amount,
              paidAmount,
              dueDate: form.dueDate,
              status: form.status,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to update fee"
          );
        }

        // Update UI
        setFees((prev) =>
          prev.map((fee) =>
            fee.id === editingFee.id ? result.data : fee
          )
        );

        setShowModal(false);
        setEditingFee(null);

        setForm({
          name: "",
          amount: "",
          paidAmount: "",
          dueDate: "",
          status: "PAID",
        });

        alert("Fee updated successfully");
      } catch (err) {
        console.error("UPDATE FEE ERROR:", err);
        alert(err.message || "Failed to update fee");
      }

      return;
    }

    // ========================================
    // ADD NEW FEE
    // ========================================

    const student = findStudentByName(form.name);

    if (!student) {
      alert(
        `Student "${form.name}" not found in database.\n\nPlease add this student first from the Student page.`
      );
      return;
    }

    try {
      const response = await fetch(FEES_API, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          studentId: student.id,
          amount,
          paidAmount,
          dueDate: form.dueDate,
          status: form.status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create fee"
        );
      }

      // Add to UI
      setFees((prev) => [result.data, ...prev]);

      // Show receipt
      setSelectedFee(result.data);
      setShowModal(false);
      setShowReceipt(true);

      // Reset form
      setForm({
        name: "",
        amount: "",
        paidAmount: "",
        dueDate: "",
        status: "PAID",
      });
    } catch (err) {
      console.error("CREATE FEE ERROR:", err);
      alert(err.message || "Failed to create fee");
    }
  };

  // ========================================
  // OPEN RECEIPT
  // ========================================
  const openReceipt = (fee) => {
    setSelectedFee(fee);
    setShowReceipt(true);
  };

  // ========================================
  // PRINT
  // ========================================
  const handlePrint = () => {
    window.print();
  };

  // ========================================
  // FORMAT DATE
  // ========================================
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // FORMAT AMOUNT
  // ========================================
  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  // ========================================
  // STATUS LABEL
  // ========================================
  const getStatusLabel = (status) => {
    switch (status) {
      case "PAID":
        return "Paid";
      case "PENDING":
        return "Pending";
      case "PARTIAL":
        return "Partial";
      case "OVERDUE":
        return "Overdue";
      default:
        return status || "-";
    }
  };

  // ========================================
  // STATUS CLASS
  // ========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      case "PARTIAL":
        return "bg-blue-50 text-blue-700";

      case "OVERDUE":
        return "bg-rose-50 text-rose-700";

      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  // ========================================
  // STATISTICS
  // ========================================
  const totalCollected = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const totalPending = fees
    .filter(
      (fee) =>
        fee.status === "PENDING" ||
        fee.status === "PARTIAL"
    )
    .reduce(
      (sum, fee) =>
        sum +
        Math.max(
          Number(fee.amount || 0) -
            Number(fee.paidAmount || 0),
          0
        ),
      0
    );

  const totalOverdue = fees
    .filter((fee) => fee.status === "OVERDUE")
    .reduce(
      (sum, fee) =>
        sum +
        Math.max(
          Number(fee.amount || 0) -
            Number(fee.paidAmount || 0),
          0
        ),
      0
    );

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fee Management
          </h1>

          <p className="text-slate-500 mt-1">
            Track and collect student fees
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              fetchFees();
              fetchStudents();
            }}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
          >
            <CreditCard className="w-5 h-5" />
            Collect Fee
          </button>
        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ========================================
          STATISTICS
      ======================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Collected
          </p>

          <p className="text-2xl font-bold text-emerald-600 mt-1">
            ₹{formatAmount(totalCollected)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Pending
          </p>

          <p className="text-2xl font-bold text-amber-600 mt-1">
            ₹{formatAmount(totalPending)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500">
            Overdue
          </p>

          <p className="text-2xl font-bold text-rose-600 mt-1">
            ₹{formatAmount(totalOverdue)}
          </p>
        </div>

      </div>

      {/* ========================================
          FEE TABLE
      ======================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading fees...
          </div>
        ) : fees.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No fee records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Student
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Total
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Paid
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Remaining
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Status
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Due Date
                  </th>

                  <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">

                {fees.map((fee) => {
                  const remaining =
                    Number(fee.amount || 0) -
                    Number(fee.paidAmount || 0);

                  return (
                    <tr
                      key={fee.id}
                      className="hover:bg-slate-50"
                    >

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {fee.student?.name ||
                              "Unknown Student"}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID: {fee.studentId}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        ₹{formatAmount(fee.amount)}
                      </td>

                      <td className="px-6 py-4 font-medium text-emerald-600">
                        ₹{formatAmount(fee.paidAmount)}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        ₹{formatAmount(Math.max(remaining, 0))}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            fee.status
                          )}`}
                        >
                          {getStatusLabel(fee.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(fee.dueDate)}
                      </td>

                      <td className="px-6 py-4 text-right">

                        <button
                          onClick={() => openEditModal(fee)}
                          className="p-2 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 mr-1"
                          title="Edit Fee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => openReceipt(fee)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                          title="View Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ========================================
          ADD / UPDATE MODAL
      ======================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                {editingFee ? "Update Fee" : "Collect Fee"}
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingFee(null);
                }}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            <div className="space-y-4">

              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={!!editingFee}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                />

                {!editingFee && (
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the exact name of a student already
                    added in Student Management.
                  </p>
                )}
              </div>

              {/* Total Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Total Amount
                </label>

                <input
                  type="number"
                  min="0"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter total amount"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Paid Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Paid Amount
                </label>

                <input
                  type="number"
                  min="0"
                  name="paidAmount"
                  value={form.paidAmount}
                  onChange={handleChange}
                  placeholder="Enter paid amount"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingFee(null);
                }}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                {editingFee ? "Update Fee" : "Add Fee"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ========================================
          RECEIPT MODAL
      ======================================== */}
      {showReceipt && selectedFee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">

            <div id="receipt" className="p-8">

              <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">

                <h2 className="text-xl font-bold text-slate-900">
                  EduManage School
                </h2>

                <p className="text-sm text-slate-500">
                  Fee Receipt
                </p>

              </div>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Fee ID:
                  </span>

                  <span className="font-medium">
                    {selectedFee.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Student Name:
                  </span>

                  <span className="font-medium">
                    {selectedFee.student?.name ||
                      "Unknown Student"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Student ID:
                  </span>

                  <span className="font-medium">
                    {selectedFee.studentId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Due Date:
                  </span>

                  <span className="font-medium">
                    {formatDate(selectedFee.dueDate)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Total Amount:
                  </span>

                  <span className="font-medium">
                    ₹{formatAmount(selectedFee.amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Status:
                  </span>

                  <span className="font-medium">
                    {getStatusLabel(selectedFee.status)}
                  </span>
                </div>

                <div className="flex justify-between border-t border-dashed border-slate-300 pt-3 mt-3">

                  <span className="text-slate-500">
                    Amount Paid:
                  </span>

                  <span className="font-bold text-lg text-emerald-600">
                    ₹{formatAmount(selectedFee.paidAmount)}
                  </span>

                </div>

              </div>

              <div className="mt-8 text-center text-xs text-slate-400">
                Thank you for your payment!
              </div>

            </div>

            <div className="flex gap-3 p-4 bg-slate-50 border-t">

              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium"
              >
                Close
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
              >
                <Printer className="w-4 h-4" />
                Print Receipt
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
