
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Download,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/students";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // ==========================================
  // GET TOKEN
  // ==========================================
  const getToken = () => {
    const token = localStorage.getItem("token");

    if (
      !token ||
      token === "null" ||
      token === "undefined" ||
      token.trim() === ""
    ) {
      return null;
    }

    return token.trim();
  };

  // ==========================================
  // FETCH ALL STUDENTS
  // GET /api/students
  // ==========================================
  const fetchStudents = async () => {
    try {
      setFetching(true);
      setError("");

      const token = getToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch students");
      }

      setStudents(result.data || []);
    } catch (error) {
      console.error("FETCH STUDENTS ERROR:", error);
      setError(error.message || "Failed to fetch students");
    } finally {
      setFetching(false);
    }
  };

  // ==========================================
  // LOAD STUDENTS
  // ==========================================
  useEffect(() => {
    fetchStudents();
  }, []);

  // ==========================================
  // FILTER STUDENTS
  // ==========================================
  const filtered = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText)
    );
  });

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================
  const openAddModal = () => {
    setEditingStudent(null);

    setForm({
      name: "",
      email: "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEditModal = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      email: student.email || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ==========================================
  // ADD / UPDATE STUDENT
  // ==========================================
  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Student name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getToken();

      const url = editingStudent
        ? `${API_URL}/${editingStudent.id}`
        : API_URL;

      const method = editingStudent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save student");
      }

      await fetchStudents();

      setShowModal(false);

      setForm({
        name: "",
        email: "",
      });

      setEditingStudent(null);

      setSuccess(
        editingStudent
          ? "Student updated successfully"
          : "Student added successfully"
      );
    } catch (error) {
      console.error("SAVE STUDENT ERROR:", error);
      setError(error.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE STUDENT
  // DELETE /api/students/:id
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete student");
      }

      await fetchStudents();

      setSuccess("Student deleted successfully");
    } catch (error) {
      console.error("DELETE STUDENT ERROR:", error);
      setError(error.message || "Failed to delete student");
    }
  };

  // ==========================================
  // IMPORT CSV
  // POST /api/students/import
  // ==========================================
  const handleImportCSV = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check CSV extension
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a CSV file");
      event.target.value = "";
      return;
    }

    try {
      setImporting(true);
      setError("");
      setSuccess("");

      const token = getToken();

      const formData = new FormData();

      // IMPORTANT:
      // Backend uses upload.single("file")
      formData.append("file", file);

      const response = await fetch(`${API_URL}/import`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to import students");
      }

      // Refresh students from database
      await fetchStudents();

      setSuccess(
        `${result.importedCount || 0} student(s) imported successfully. ${
          result.skippedCount || 0
        } skipped.`
      );

      // Show skipped records in console
      if (result.skipped?.length > 0) {
        console.log("Skipped students:", result.skipped);
      }
    } catch (error) {
      console.error("IMPORT CSV ERROR:", error);
      setError(error.message || "Failed to import students");
    } finally {
      setImporting(false);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  // ==========================================
  // EXPORT CSV
  // ==========================================
  const handleExportCSV = () => {
    if (students.length === 0) {
      setError("No students available to export");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const headers = ["ID", "Name", "Email", "Created Date"];

      const rows = students.map((student) => [
        student.id,
        student.name || "",
        student.email || "",
        student.createdAt
          ? new Date(student.createdAt).toLocaleDateString()
          : "",
      ]);

      const csvContent = [
        headers,
        ...rows,
      ]
        .map((row) =>
          row
            .map((value) => {
              const text = String(value ?? "");

              // Escape quotes and wrap values containing commas/quotes
              if (
                text.includes(",") ||
                text.includes('"') ||
                text.includes("\n")
              ) {
                return `"${text.replace(/"/g, '""')}"`;
              }

              return text;
            })
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "students.csv";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      setSuccess("Students exported successfully");
    } catch (error) {
      console.error("EXPORT CSV ERROR:", error);
      setError("Failed to export students");
    }
  };

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Students
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all student records
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* IMPORT CSV */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleImportCSV}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />

            {importing ? "Importing..." : "Import CSV"}
          </button>

          {/* EXPORT CSV */}
          <button
            onClick={handleExportCSV}
            disabled={fetching || students.length === 0}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
          >
            <Download className="w-5 h-5" />

            Export CSV
          </button>

          {/* ADD STUDENT */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            <Plus className="w-5 h-5" />

            Add Student
          </button>
        </div>
      </div>

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* ==========================================
          SEARCH
      ========================================== */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ==========================================
          STUDENT TABLE
      ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {fetching ? (
          <div className="py-16 text-center text-slate-400">
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No students found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    ID
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Name
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Email
                  </th>

                  <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Created
                  </th>

                  <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 text-slate-600">
                      {student.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-900">
                      {student.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.email || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {student.createdAt
                        ? new Date(
                            student.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* EDIT */}
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                          title="Edit Student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(student.id)
                          }
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                          title="Delete Student"
                        >
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
      </div>

      {/* ==========================================
          ADD / EDIT MODAL
      ========================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingStudent
                  ? "Edit Student"
                  : "Add New Student"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
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
                  placeholder="Enter student name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter student email"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium disabled:opacity-50"
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
                  : editingStudent
                  ? "Update Student"
                  : "Save Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

