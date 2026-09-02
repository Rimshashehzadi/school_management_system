
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/exams";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);

  const [editingExam, setEditingExam] = useState(null);
  const [viewExam, setViewExam] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  // ==========================================
  // GET ALL EXAMS
  // ==========================================
  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch exams");
      }

      setExams(result.data || []);
    } catch (error) {
      console.error("Fetch Exams Error:", error);
      setError(error.message || "Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD EXAMS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchExams();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================
  const filtered = exams.filter((exam) =>
    exam.name.toLowerCase().includes(search.toLowerCase())
  );

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================
  const openAdd = () => {
    setEditingExam(null);

    setForm({
      name: "",
      startDate: "",
      endDate: "",
    });

    setError("");
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEdit = (exam) => {
    setEditingExam(exam);

    setForm({
      name: exam.name,
      startDate: exam.startDate
        ? exam.startDate.substring(0, 10)
        : "",
      endDate: exam.endDate
        ? exam.endDate.substring(0, 10)
        : "",
    });

    setError("");
    setShowModal(true);
  };

  // ==========================================
  // OPEN VIEW MODAL
  // ==========================================
  const openView = (exam) => {
    setViewExam(exam);
    setShowView(true);
  };

  // ==========================================
  // CREATE / UPDATE EXAM
  // ==========================================
  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.endDate) {
      setError("Exam name, start date and end date are required.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        name: form.name,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      let response;

      // ========================================
      // UPDATE
      // ========================================
      if (editingExam) {
        response = await fetch(`${API_URL}/${editingExam.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      // ========================================
      // CREATE
      // ========================================
      else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save exam");
      }

      // Refresh data from MySQL
      await fetchExams();

      setShowModal(false);

      setForm({
        name: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Save Exam Error:", error);
      setError(error.message || "Failed to save exam");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE EXAM
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete exam");
      }

      // Refresh data from MySQL
      await fetchExams();
    } catch (error) {
      console.error("Delete Exam Error:", error);
      setError(error.message || "Failed to delete exam");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Exams & Results
          </h1>

          <p className="text-slate-500 mt-1">
            Manage examinations
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Exam
        </button>
      </div>

      {/* ======================================
          ERROR MESSAGE
      ====================================== */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* ======================================
          SEARCH
      ====================================== */}
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

      {/* ======================================
          TABLE
      ====================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {loading && (
          <div className="text-center py-6 text-slate-500">
            Loading...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No exams found.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Exam Name
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Start Date
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  End Date
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Status
                </th>

                <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">

              {filtered.map((exam) => {

                const today = new Date();
                const endDate = new Date(exam.endDate);

                const status =
                  endDate < today ? "Completed" : "Upcoming";

                return (
                  <tr
                    key={exam.id}
                    className="hover:bg-slate-50"
                  >

                    {/* EXAM NAME */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center">

                          <FileText className="w-4 h-4 text-indigo-600" />

                        </div>

                        <span className="font-medium text-slate-900">
                          {exam.name}
                        </span>

                      </div>

                    </td>

                    {/* START DATE */}
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(exam.startDate)}
                    </td>

                    {/* END DATE */}
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(exam.endDate)}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {status}
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* VIEW */}
                        <button
                          onClick={() => openView(exam)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* EDIT */}
                        <button
                          onClick={() => openEdit(exam)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>
        )}

      </div>

      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                {editingExam
                  ? "Edit Exam"
                  : "Create New Exam"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            <div className="space-y-4">

              {/* EXAM NAME */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Exam Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Mid Term Examination"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

              </div>

              {/* DATES */}
              <div className="grid grid-cols-2 gap-4">

                {/* START DATE */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

                {/* END DATE */}
                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-8">

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingExam
                  ? "Update Exam"
                  : "Create Exam"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ======================================
          VIEW MODAL
      ====================================== */}
      {showView && viewExam && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-bold text-slate-900">
                Exam Details
              </h2>

              <button
                onClick={() => setShowView(false)}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Exam Name
                </span>

                <span className="font-medium">
                  {viewExam.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Start Date
                </span>

                <span className="font-medium">
                  {formatDate(viewExam.startDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  End Date
                </span>

                <span className="font-medium">
                  {formatDate(viewExam.endDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Status
                </span>

                <span className="font-medium">
                  {new Date(viewExam.endDate) < new Date()
                    ? "Completed"
                    : "Upcoming"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">
                  Exam ID
                </span>

                <span className="font-medium">
                  {viewExam.id}
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

