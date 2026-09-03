import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Megaphone,
  Eye,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/notices";

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
// GET USER ROLE
// ==========================================

const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    return user?.role || "";
  } catch (error) {
    return "";
  }
};

export default function Notices() {
  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingNotice, setEditingNotice] = useState(null);
  const [viewingNotice, setViewingNotice] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
  });

  const userRole = getUserRole();

  // ==========================================
  // PERMISSIONS
  // ==========================================

  const canCreate =
    userRole === "ADMIN" || userRole === "TEACHER";

  const canUpdate =
    userRole === "ADMIN" || userRole === "TEACHER";

  const canDelete =
    userRole === "ADMIN";

  // ==========================================
  // FETCH NOTICES
  // ==========================================

  const fetchNotices = async () => {
    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your session has expired or the token is invalid. Please login again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch notices"
        );
      }

      setNotices(result.data || []);
    } catch (err) {
      console.error("GET NOTICES ERROR:", err);

      setError(
        err.message || "Failed to load notices"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchNotices();
  }, []);

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingNotice(null);

    setForm({
      title: "",
      message: "",
    });

    setError("");
    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (notice) => {
    setEditingNotice(notice);

    setForm({
      title: notice.title || "",
      message: notice.message || "",
    });

    setError("");
    setShowModal(true);
  };

  // ==========================================
  // CLOSE FORM MODAL
  // ==========================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingNotice(null);

    setForm({
      title: "",
      message: "",
    });
  };

  // ==========================================
  // CREATE / UPDATE NOTICE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      alert("Title and message are required.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = Boolean(editingNotice);

      const url = isEditing
        ? `${API_URL}/${editingNotice.id}`
        : API_URL;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (response.status === 403) {
        setError(
          result.message ||
            "You do not have permission to perform this action."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            (isEditing
              ? "Failed to update notice"
              : "Failed to create notice")
        );
      }

      alert(
        isEditing
          ? "Notice updated successfully."
          : "Notice created successfully."
      );

      closeModal();

      await fetchNotices();
    } catch (err) {
      console.error("NOTICE SAVE ERROR:", err);

      alert(
        err.message ||
          "Failed to save notice"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE NOTICE
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");

        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      if (response.status === 403) {
        setError(
          result.message ||
            "Only admin can delete notices."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete notice"
        );
      }

      alert("Notice deleted successfully.");

      await fetchNotices();
    } catch (err) {
      console.error("DELETE NOTICE ERROR:", err);

      alert(
        err.message ||
          "Failed to delete notice"
      );
    }
  };

  // ==========================================
  // VIEW NOTICE
  // ==========================================

  const openViewModal = (notice) => {
    setViewingNotice(notice);
    setShowViewModal(true);
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredNotices = notices.filter((notice) => {
    const title =
      notice.title?.toLowerCase() || "";

    const message =
      notice.message?.toLowerCase() || "";

    const searchText =
      search.toLowerCase().trim();

    return (
      title.includes(searchText) ||
      message.includes(searchText)
    );
  });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notices & Announcements
          </h1>

          <p className="text-slate-500 mt-1">
            Manage school notices and announcements
          </p>
        </div>

        {canCreate && (
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Create Notice
          </button>
        )}

      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="relative max-w-md">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

        <input
          type="text"
          placeholder="Search notices..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

      </div>

      {/* NOTICES */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Loading notices...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="py-16 text-center">

            <Megaphone className="w-10 h-10 mx-auto text-slate-300 mb-3" />

            <p className="text-slate-500">
              No notices found.
            </p>

            {canCreate && (
              <button
                onClick={openCreateModal}
                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
              >
                Create your first notice
              </button>
            )}

          </div>
        ) : (

          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-100">

              <tr>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Title
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Message
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

              {filteredNotices.map((notice) => (

                <tr
                  key={notice.id}
                  className="hover:bg-slate-50 transition"
                >

                  {/* TITLE */}

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-900">
                      {notice.title}
                    </div>

                  </td>

                  {/* MESSAGE */}

                  <td className="px-6 py-4 max-w-md">

                    <p className="text-sm text-slate-600 truncate">
                      {notice.message}
                    </p>

                  </td>

                  {/* DATE */}

                  <td className="px-6 py-4 text-sm text-slate-600">

                    {notice.createdAt
                      ? new Date(
                          notice.createdAt
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">

                    <div className="flex justify-end gap-2">

                      {/* VIEW */}

                      <button
                        onClick={() =>
                          openViewModal(notice)
                        }
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600"
                        title="View notice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* EDIT */}

                      {canUpdate && (
                        <button
                          onClick={() =>
                            openEditModal(notice)
                          }
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600"
                          title="Edit notice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {/* DELETE */}

                      {canDelete && (
                        <button
                          onClick={() =>
                            handleDelete(notice.id)
                          }
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                          title="Delete notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* ==========================================
          CREATE / EDIT MODAL
      ========================================== */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingNotice
                    ? "Edit Notice"
                    : "Create Notice"}

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  {editingNotice
                    ? "Update notice information"
                    : "Create a new school announcement"}

                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter notice title"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

              </div>

              {/* MESSAGE */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>

                <textarea
                  rows="6"
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Write your announcement..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving
                    ? editingNotice
                      ? "Updating..."
                      : "Creating..."
                    : editingNotice
                    ? "Update Notice"
                    : "Create Notice"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==========================================
          VIEW NOTICE MODAL
      ========================================== */}

      {showViewModal && viewingNotice && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">

            {/* HEADER */}

            <div className="flex items-start justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  {viewingNotice.title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  {viewingNotice.createdAt
                    ? new Date(
                        viewingNotice.createdAt
                      ).toLocaleString()
                    : ""}

                </p>

              </div>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

            </div>

            {/* MESSAGE */}

            <div className="bg-slate-50 rounded-xl p-4">

              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {viewingNotice.message}
              </p>

            </div>

            {/* CLOSE */}

            <div className="flex justify-end mt-5">

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}