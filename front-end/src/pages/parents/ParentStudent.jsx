import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Users,
  X,
  Search,
} from "lucide-react";

const PARENT_API = "http://localhost:5000/api/parents";
const STUDENT_API = "http://localhost:5000/api/students";
const RELATION_API = "http://localhost:5000/api/parent-students";

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

export default function ParentStudent() {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    parentId: "",
    studentId: "",
    relation: "Father",
  });

  const [error, setError] = useState("");

  // ==========================================
  // FETCH DATA
  // ==========================================

  const fetchData = async () => {
    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Get parents
      const parentResponse = await fetch(PARENT_API, {
        method: "GET",
        headers,
      });

      const parentResult = await parentResponse.json();

      if (parentResponse.status === 401) {
        localStorage.removeItem("token");
        setError("Your session has expired. Please login again.");
        return;
      }

      if (!parentResponse.ok) {
        throw new Error(
          parentResult.message || "Failed to fetch parents"
        );
      }

      // Get students
      const studentResponse = await fetch(STUDENT_API, {
        method: "GET",
        headers,
      });

      const studentResult = await studentResponse.json();

      if (studentResponse.status === 401) {
        localStorage.removeItem("token");
        setError("Your session has expired. Please login again.");
        return;
      }

      if (!studentResponse.ok) {
        throw new Error(
          studentResult.message || "Failed to fetch students"
        );
      }

      const parentData = parentResult.data || [];
      const studentData = studentResult.data || [];

      setParents(parentData);
      setStudents(studentData);

      // ==========================================
      // GET RELATIONSHIPS FOR EACH PARENT
      // ==========================================

      const relationshipResults = await Promise.all(
        parentData.map(async (parent) => {
          try {
            const response = await fetch(
              `${RELATION_API}/${parent.id}/students`,
              {
                method: "GET",
                headers,
              }
            );

            const result = await response.json();

            if (!response.ok) {
              console.error(
                `Failed to fetch students for parent ${parent.id}:`,
                result.message
              );

              return [];
            }

            return result.data || [];
          } catch (error) {
            console.error(
              `Relationship fetch error for parent ${parent.id}:`,
              error
            );

            return [];
          }
        })
      );

      // Combine all parent relationships
      const allRelationships = relationshipResults.flat();

      setRelationships(allRelationships);
    } catch (err) {
      console.error("PARENT STUDENT FETCH ERROR:", err);

      setError(
        err.message || "Failed to load parent-student data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openAddModal = () => {
    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    setForm({
      parentId: "",
      studentId: "",
      relation: "Father",
    });

    setShowModal(true);
  };

  // ==========================================
  // CREATE RELATIONSHIP
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.parentId || !form.studentId) {
      alert("Please select both parent and student.");
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

      // ==========================================
      // ACTUAL BACKEND ROUTE:
      // POST /api/parent-students/:parentId/students
      // ==========================================

      const response = await fetch(
        `${RELATION_API}/${form.parentId}/students`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: Number(form.studentId),
            relation: form.relation,
          }),
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

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create relationship"
        );
      }

      alert("Parent linked with student successfully.");

      setShowModal(false);

      setForm({
        parentId: "",
        studentId: "",
        relation: "Father",
      });

      await fetchData();
    } catch (err) {
      console.error("CREATE RELATIONSHIP ERROR:", err);

      alert(
        err.message || "Failed to link parent with student"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE RELATIONSHIP
  // ==========================================

  const handleDelete = async (parentId, studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this parent-student relationship?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }

    try {
      // ==========================================
      // ACTUAL BACKEND ROUTE:
      // DELETE /api/parent-students/:parentId/students/:studentId
      // ==========================================

      const response = await fetch(
        `${RELATION_API}/${parentId}/students/${studentId}`,
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

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete relationship"
        );
      }

      alert(
        "Parent-student relationship removed successfully."
      );

      await fetchData();
    } catch (err) {
      console.error("DELETE RELATIONSHIP ERROR:", err);

      alert(
        err.message ||
          "Failed to remove parent-student relationship"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRelationships = relationships.filter((item) => {
    const parentName =
      item.parent?.name?.toLowerCase() || "";

    const studentName =
      item.student?.name?.toLowerCase() || "";

    const relation =
      item.relation?.toLowerCase() || "";

    const searchText = search.toLowerCase().trim();

    return (
      parentName.includes(searchText) ||
      studentName.includes(searchText) ||
      relation.includes(searchText)
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
            Parent-Student Relationship
          </h1>

          <p className="text-slate-500 mt-1">
            Link parents or guardians with students
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
        >
          <Plus className="w-5 h-5" />
          Link Parent
        </button>
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
          placeholder="Search parent, student or relation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            Loading relationships...
          </div>
        ) : filteredRelationships.length === 0 ? (
          <div className="py-16 text-center">

            <Users className="w-10 h-10 mx-auto text-slate-300 mb-3" />

            <p className="text-slate-500">
              No parent-student relationships found.
            </p>

            <button
              onClick={openAddModal}
              className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
            >
              Link a parent with a student
            </button>
          </div>
        ) : (
          <table className="w-full">

            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Parent
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Student
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Relation
                </th>

                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Linked On
                </th>

                <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-4">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">

              {filteredRelationships.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition"
                >

                  {/* PARENT */}

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-900">
                      {item.parent?.name || "Unknown Parent"}
                    </div>

                    {item.parent?.email && (
                      <div className="text-sm text-slate-500">
                        {item.parent.email}
                      </div>
                    )}

                  </td>

                  {/* STUDENT */}

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-900">
                      {item.student?.name || "Unknown Student"}
                    </div>

                    {item.student?.class && (
                      <div className="text-sm text-slate-500">
                        Class: {item.student.class}
                      </div>
                    )}

                  </td>

                  {/* RELATION */}

                  <td className="px-6 py-4">

                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {item.relation || "Guardian"}
                    </span>

                  </td>

                  {/* DATE */}

                  <td className="px-6 py-4 text-slate-600">

                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  {/* DELETE */}

                  <td className="px-6 py-4">

                    <div className="flex justify-end">

                      <button
                        onClick={() =>
                          handleDelete(
                            item.parentId,
                            item.studentId
                          )
                        }
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-rose-600"
                        title="Remove relationship"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        )}

      </div>

      {/* ADD RELATIONSHIP MODAL */}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Link Parent with Student
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Select a parent and student
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
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

              {/* PARENT */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Parent / Guardian
                </label>

                <select
                  value={form.parentId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      parentId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >

                  <option value="">
                    Select Parent
                  </option>

                  {parents.map((parent) => (
                    <option
                      key={parent.id}
                      value={parent.id}
                    >
                      {parent.name}
                      {parent.email
                        ? ` - ${parent.email}`
                        : ""}
                    </option>
                  ))}

                </select>

              </div>

              {/* STUDENT */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Student
                </label>

                <select
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      studentId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >

                  <option value="">
                    Select Student
                  </option>

                  {students.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                    >
                      {student.name}
                      {student.class
                        ? ` - ${student.class}`
                        : ""}
                    </option>
                  ))}

                </select>

              </div>

              {/* RELATION */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Relation
                </label>

                <select
                  value={form.relation}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      relation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >

                  <option value="Father">
                    Father
                  </option>

                  <option value="Mother">
                    Mother
                  </option>

                  <option value="Guardian">
                    Guardian
                  </option>

                  <option value="Brother">
                    Brother
                  </option>

                  <option value="Sister">
                    Sister
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  {saving ? "Linking..." : "Link Parent"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}