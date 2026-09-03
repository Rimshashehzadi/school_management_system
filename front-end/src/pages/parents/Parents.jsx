
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Users,
  Eye,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  User,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/parents";

// ==================================================
// GET AUTH TOKEN
// ==================================================

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

export default function Parents() {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingParent, setEditingParent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ==================================================
  // AUTH CHECK
  // ==================================================

  const requireToken = () => {
    const token = getToken();

    if (!token) {
      setError(
        "Authentication token not found. Please login again."
      );

      return null;
    }

    return token;
  };

  // ==================================================
  // HANDLE UNAUTHORIZED
  // ==================================================

  const handleUnauthorized = () => {
    localStorage.removeItem("token");

    setParents([]);

    setError(
      "Your session has expired or the token is invalid. Please login again."
    );
  };

  // ==================================================
  // FETCH PARENTS
  // ==================================================

  const fetchParents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = requireToken();

      if (!token) {
        return;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to get parents"
        );
      }

      setParents(result.data || []);
    } catch (err) {
      console.error("GET PARENTS ERROR:", err);

      setError(
        err.message || "Failed to get parents"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    fetchParents();
  }, []);

  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // OPEN ADD MODAL
  // ==================================================

  const openAddModal = () => {
    const token = requireToken();

    if (!token) {
      return;
    }

    setEditingParent(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setShowModal(true);
  };

  // ==================================================
  // OPEN EDIT MODAL
  // ==================================================

  const openEditModal = (parent) => {
    const token = requireToken();

    if (!token) {
      return;
    }

    setEditingParent(parent);

    setFormData({
      name: parent.name || "",
      email: parent.email || "",
      phone: parent.phone || "",
    });

    setShowModal(true);
  };

  // ==================================================
  // OPEN VIEW MODAL
  // ==================================================

  const openViewModal = (parent) => {
    setSelectedParent(parent);
    setShowViewModal(true);
  };

  // ==================================================
  // CLOSE MODAL
  // ==================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingParent(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  // ==================================================
  // CREATE / UPDATE PARENT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Parent name is required");
      return;
    }

    const token = requireToken();

    if (!token) {
      return;
    }

    try {
      setSaving(true);

      setError("");

      const url = editingParent
        ? `${API_URL}/${editingParent.id}`
        : API_URL;

      const method = editingParent
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        handleUnauthorized();

        setShowModal(false);

        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Operation failed"
        );
      }

      alert(
        editingParent
          ? "Parent updated successfully"
          : "Parent added successfully"
      );

      closeModal();

      await fetchParents();
    } catch (err) {
      console.error("SAVE PARENT ERROR:", err);

      alert(
        err.message || "Failed to save parent"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // DELETE PARENT
  // ==================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this parent?"
    );

    if (!confirmed) {
      return;
    }

    const token = requireToken();

    if (!token) {
      return;
    }

    try {
      setError("");

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
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete parent"
        );
      }

      alert("Parent deleted successfully");

      await fetchParents();
    } catch (err) {
      console.error(
        "DELETE PARENT ERROR:",
        err
      );

      alert(
        err.message ||
          "Failed to delete parent"
      );
    }
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const filteredParents = parents.filter(
    (parent) => {
      const searchText =
        search.toLowerCase().trim();

      return (
        parent.name
          ?.toLowerCase()
          .includes(searchText) ||
        parent.email
          ?.toLowerCase()
          .includes(searchText) ||
        parent.phone
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Parents
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage parents and guardians
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Parent
        </button>
      </div>

      {/* ================= STATS ================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Parents
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-800">
                {parents.length}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={22} />
            </div>

          </div>

        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search parents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[750px] text-left">

            <thead className="border-b border-gray-200 bg-gray-50">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Parent
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (

                <tr>

                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    Loading parents...
                  </td>

                </tr>

              ) : filteredParents.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    No parents found
                  </td>

                </tr>

              ) : (

                filteredParents.map(
                  (parent) => (

                    <tr
                      key={parent.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Parent */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <User size={18} />
                          </div>

                          <div>

                            <p className="font-medium text-gray-800">
                              {parent.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID #{parent.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Email */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <Mail
                            size={15}
                            className="text-gray-400"
                          />

                          {parent.email || "—"}

                        </div>

                      </td>

                      {/* Phone */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">

                          <Phone
                            size={15}
                            className="text-gray-400"
                          />

                          {parent.phone || "—"}

                        </div>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              openViewModal(parent)
                            }
                            title="View"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            onClick={() =>
                              openEditModal(parent)
                            }
                            title="Edit"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                parent.id
                              )
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {editingParent
                    ? "Edit Parent"
                    : "Add Parent"}
                </h2>

                <p className="text-sm text-gray-500">
                  {editingParent
                    ? "Update parent information"
                    : "Enter parent information"}
                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              <div className="space-y-4">

                {/* Name */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Parent Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter parent name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Email */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

                {/* Phone */}

                <div>

                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Buttons */}

              <div className="mt-6 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingParent
                    ? "Update Parent"
                    : "Add Parent"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ==================================================
          VIEW MODAL
      ================================================== */}

      {showViewModal && selectedParent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

              <h2 className="text-lg font-semibold text-gray-800">
                Parent Details
              </h2>

              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>

            </div>

            {/* Details */}

            <div className="p-6">

              <div className="mb-5 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <User size={25} />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedParent.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Parent ID #{selectedParent.id}
                  </p>

                </div>

              </div>

              <div className="space-y-3">

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedParent.email ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedParent.phone ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-lg bg-gray-50 p-3">

                  <p className="text-xs text-gray-400">
                    Created
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {selectedParent.createdAt
                      ? new Date(
                          selectedParent.createdAt
                        ).toLocaleDateString()
                      : "—"}
                  </p>

                </div>

              </div>

              <div className="mt-6 flex justify-end">

                <button
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

