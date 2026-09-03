
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  X,
  UserPlus,
  Users,
} from "lucide-react";

const EXAM_SUBJECT_API = "http://localhost:5000/api/exam-subjects";
const EXAM_API = "http://localhost:5000/api/exams";
const SUBJECT_API = "http://localhost:5000/api/subjects";
const STUDENT_API = "http://localhost:5000/api/students";
const MARKS_API = "http://localhost:5000/api/marks";

export default function ExamSubject() {
  const [examSubjects, setExamSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Add/Edit Exam Subject Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    examName: "",
    subjectName: "",
    totalMarks: "",
    passingMarks: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // View Students Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewExamSubject, setViewExamSubject] = useState(null);

  // Student Modal
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentEditingId, setStudentEditingId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentError, setStudentError] = useState("");

  // =========================================================
  // FETCH EXAM SUBJECTS
  // =========================================================

  const fetchExamSubjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(EXAM_SUBJECT_API);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch exam subjects"
        );
      }

      setExamSubjects(result.data || []);
    } catch (err) {
      console.error("Fetch Exam Subjects Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamSubjects();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredExamSubjects = examSubjects.filter((item) => {
    const examName = item.exam?.name || item.examName || "";
    const subjectName = item.subject?.name || item.subjectName || "";

    return (
      examName.toLowerCase().includes(search.toLowerCase()) ||
      subjectName.toLowerCase().includes(search.toLowerCase())
    );
  });

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);

    setForm({
      examName: "",
      subjectName: "",
      totalMarks: "",
      passingMarks: "",
    });

    setError("");
    setSuccess("");
  };

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const openAddModal = () => {
    setEditingId(null);

    setForm({
      examName: "",
      subjectName: "",
      totalMarks: "",
      passingMarks: "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      examName: item.exam?.name || item.examName || "",
      subjectName: item.subject?.name || item.subjectName || "",
      totalMarks: item.totalMarks ?? "",
      passingMarks: item.passingMarks ?? "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================================================
  // FIND OR CREATE EXAM
  // ONLY USED WHILE ADDING
  // =========================================================

  const findOrCreateExam = async (examName) => {
    const response = await fetch(EXAM_API);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to fetch exams"
      );
    }

    const exams = result.data || [];

    const existingExam = exams.find(
      (exam) =>
        exam.name.trim().toLowerCase() ===
        examName.trim().toLowerCase()
    );

    if (existingExam) {
      return existingExam;
    }

    const createResponse = await fetch(EXAM_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: examName.trim(),
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      }),
    });

    const createResult = await createResponse.json();

    if (!createResponse.ok) {
      throw new Error(
        createResult.message || "Failed to create exam"
      );
    }

    return createResult.data;
  };

  // =========================================================
  // FIND OR CREATE SUBJECT
  // ONLY USED WHILE ADDING
  // =========================================================

  const findOrCreateSubject = async (subjectName) => {
    const response = await fetch(SUBJECT_API);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to fetch subjects"
      );
    }

    const subjects = result.data || [];

    const existingSubject = subjects.find(
      (subject) =>
        subject.name.trim().toLowerCase() ===
        subjectName.trim().toLowerCase()
    );

    if (existingSubject) {
      return existingSubject;
    }

    const code = subjectName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 8);

    const createResponse = await fetch(SUBJECT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subjectName.trim(),
        code: code || `SUB${Date.now()}`,
      }),
    });

    const createResult = await createResponse.json();

    if (!createResponse.ok) {
      throw new Error(
        createResult.message || "Failed to create subject"
      );
    }

    return createResult.data;
  };

  // =========================================================
  // ADD / UPDATE EXAM SUBJECT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.examName.trim()) {
      setError("Exam name is required");
      return;
    }

    if (!form.subjectName.trim()) {
      setError("Subject name is required");
      return;
    }

    if (form.totalMarks === "") {
      setError("Total marks are required");
      return;
    }

    if (form.passingMarks === "") {
      setError("Passing marks are required");
      return;
    }

    const totalMarks = Number(form.totalMarks);
    const passingMarks = Number(form.passingMarks);

    if (totalMarks <= 0) {
      setError("Total marks must be greater than 0");
      return;
    }

    if (
      passingMarks < 0 ||
      passingMarks > totalMarks
    ) {
      setError(
        "Passing marks must be between 0 and total marks"
      );
      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // UPDATE
      // =====================================================

      if (editingId) {
        const response = await fetch(
          `${EXAM_SUBJECT_API}/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              examName: form.examName.trim(),
              subjectName: form.subjectName.trim(),
              totalMarks,
              passingMarks,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to update exam subject"
          );
        }

        // Immediately update the item in React state
        const updatedItem = result.data;

        setExamSubjects((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? updatedItem
              : item
          )
        );

        setSuccess(
          "Exam subject updated successfully"
        );

        // Refresh data from database
        await fetchExamSubjects();

        setTimeout(() => {
          closeModal();
        }, 500);

        return;
      }

      // =====================================================
      // ADD
      // =====================================================

      const exam = await findOrCreateExam(
        form.examName
      );

      const subject = await findOrCreateSubject(
        form.subjectName
      );

      if (!exam?.id) {
        throw new Error("Exam ID not found");
      }

      if (!subject?.id) {
        throw new Error("Subject ID not found");
      }

      const response = await fetch(
        EXAM_SUBJECT_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examId: exam.id,
            subjectId: subject.id,
            totalMarks,
            passingMarks,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to add exam subject"
        );
      }

      await fetchExamSubjects();

      setSuccess(
        "Exam subject added successfully"
      );

      setTimeout(() => {
        closeModal();
      }, 500);
    } catch (err) {
      console.error("Submit Error:", err);
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE EXAM SUBJECT
  // =========================================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam subject?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${EXAM_SUBJECT_API}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete exam subject"
        );
      }

      setExamSubjects((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (viewExamSubject?.id === id) {
        setViewExamSubject(null);
        setShowViewModal(false);
      }

      setSuccess(
        "Exam subject deleted successfully"
      );
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VIEW STUDENTS
  // =========================================================

  const openViewModal = (item) => {
    setViewExamSubject(item);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewExamSubject(null);
  };

  // =========================================================
  // OPEN ADD STUDENT
  // =========================================================

  const openAddStudent = () => {
    setStudentEditingId(null);
    setStudentName("");
    setStudentError("");
    setShowStudentModal(true);
  };

  // =========================================================
  // OPEN EDIT STUDENT
  // =========================================================

  const openEditStudent = (mark) => {
    setStudentEditingId(mark.id);
    setStudentName(
      mark.student?.name || ""
    );
    setStudentError("");
    setShowStudentModal(true);
  };

  // =========================================================
  // CLOSE STUDENT MODAL
  // =========================================================

  const closeStudentModal = () => {
    setShowStudentModal(false);
    setStudentEditingId(null);
    setStudentName("");
    setStudentError("");
  };

  // =========================================================
  // FIND OR CREATE STUDENT
  // =========================================================

  const findOrCreateStudent = async (name) => {
    const response = await fetch(STUDENT_API);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch students"
      );
    }

    const students = result.data || [];

    const existingStudent = students.find(
      (student) =>
        student.name.trim().toLowerCase() ===
        name.trim().toLowerCase()
    );

    if (existingStudent) {
      return existingStudent;
    }

    const createResponse = await fetch(
      STUDENT_API,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      }
    );

    const createResult =
      await createResponse.json();

    if (!createResponse.ok) {
      throw new Error(
        createResult.message ||
          "Failed to create student"
      );
    }

    return createResult.data;
  };

  // =========================================================
  // ADD / UPDATE STUDENT
  // =========================================================

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    setStudentError("");

    if (!studentName.trim()) {
      setStudentError(
        "Student name is required"
      );
      return;
    }

    if (!viewExamSubject) {
      setStudentError(
        "Exam subject not selected"
      );
      return;
    }

    try {
      // =====================================================
      // UPDATE EXISTING STUDENT / MARK
      // =====================================================

      if (studentEditingId) {
        const student =
          await findOrCreateStudent(
            studentName
          );

        const currentMark =
          viewExamSubject.marks?.find(
            (mark) =>
              mark.id === studentEditingId
          );

        const response = await fetch(
          `${MARKS_API}/${studentEditingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              examId:
                viewExamSubject.examId,
              subjectId:
                viewExamSubject.subjectId,
              studentId: student.id,
              obtainedMarks: Number(
                currentMark?.obtainedMarks || 0
              ),
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to update student"
          );
        }

        setViewExamSubject((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            marks: (prev.marks || []).map(
              (mark) =>
                mark.id === studentEditingId
                  ? {
                      ...mark,
                      student: {
                        ...mark.student,
                        ...student,
                        name: student.name,
                      },
                    }
                  : mark
            ),
          };
        });

        await fetchExamSubjects();

        closeStudentModal();

        return;
      }

      // =====================================================
      // ADD NEW STUDENT
      // =====================================================

      const student =
        await findOrCreateStudent(
          studentName
        );

      const response = await fetch(
        MARKS_API,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examId:
              viewExamSubject.examId,
            studentId: student.id,
            subjectId:
              viewExamSubject.subjectId,
            obtainedMarks: 0,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to add student"
        );
      }

      setViewExamSubject((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          marks: [
            ...(prev.marks || []),
            result.data,
          ],
        };
      });

      await fetchExamSubjects();

      closeStudentModal();
    } catch (err) {
      console.error(
        "Student Submit Error:",
        err
      );

      setStudentError(
        err.message ||
          "Something went wrong"
      );
    }
  };

  // =========================================================
  // DELETE STUDENT FROM EXAM
  // =========================================================

  const handleDeleteStudent = async (
    markId
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to remove this student from the exam?"
      );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${MARKS_API}/${markId}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to remove student"
        );
      }

      setViewExamSubject((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          marks: (prev.marks || []).filter(
            (mark) =>
              mark.id !== markId
          ),
        };
      });

      await fetchExamSubjects();
    } catch (err) {
      console.error(
        "Delete Student Error:",
        err
      );

      setError(err.message);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-6">
      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Exam Subjects
          </h1>

          <p className="text-gray-500 mt-1">
            Manage exams, subjects, marks and students
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Add Exam Subject
        </button>
      </div>

      {/* =====================================================
          SEARCH
          ===================================================== */}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search exam or subject..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* =====================================================
          MESSAGES
          ===================================================== */}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* =====================================================
          MAIN TABLE
          ===================================================== */}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading &&
        examSubjects.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : filteredExamSubjects.length ===
          0 ? (
          <div className="p-10 text-center text-gray-500">
            No exam subjects found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    #
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    Exam
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    Subject
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    Total Marks
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    Passing Marks
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    Students
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredExamSubjects.map(
                  (item, index) => {
                    const examName =
                      item.exam?.name ||
                      item.examName ||
                      "N/A";

                    const subjectName =
                      item.subject?.name ||
                      item.subjectName ||
                      "N/A";

                    const studentCount =
                      item.marks?.length || 0;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-700 border border-gray-200">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4 border border-gray-200">
                          <div className="flex items-center gap-2">
                            <FileText
                              size={18}
                              className="text-blue-500"
                            />

                            <span className="font-medium text-gray-800">
                              {examName}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-700 border border-gray-200">
                          {subjectName}
                        </td>

                        <td className="px-6 py-4 text-gray-700 border border-gray-200">
                          {item.totalMarks}
                        </td>

                        <td className="px-6 py-4 text-gray-700 border border-gray-200">
                          {item.passingMarks}
                        </td>

                        <td className="px-6 py-4 border border-gray-200">
                          <button
                            onClick={() =>
                              openViewModal(item)
                            }
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                          >
                            <Users size={18} />

                            <span>
                              {studentCount} Student
                              {studentCount !== 1
                                ? "s"
                                : ""}
                            </span>
                          </button>
                        </td>

                        <td className="px-6 py-4 border border-gray-200">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                openViewModal(item)
                              }
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Students"
                            >
                              <Eye size={18} />
                            </button>

                            <button
                              onClick={() =>
                                openEditModal(item)
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(item.id)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =====================================================
          ADD / EDIT EXAM SUBJECT MODAL
          ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId
                  ? "Edit Exam Subject"
                  : "Add Exam Subject"}
              </h2>

              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {error && (
                <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* EXAM NAME */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Name
                </label>

                <input
                  type="text"
                  value={form.examName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      examName:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Mid Term Examination"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SUBJECT NAME */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>

                <input
                  type="text"
                  value={form.subjectName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subjectName:
                        e.target.value,
                    })
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* TOTAL MARKS */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Marks
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.totalMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      totalMarks:
                        e.target.value,
                    })
                  }
                  placeholder="100"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* PASSING MARKS */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passing Marks
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.passingMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      passingMarks:
                        e.target.value,
                    })
                  }
                  placeholder="40"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          VIEW STUDENTS MODAL
          ===================================================== */}

      {showViewModal &&
        viewExamSubject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* HEADER */}

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Students
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {viewExamSubject.exam
                      ?.name ||
                      viewExamSubject.examName ||
                      "N/A"}{" "}
                    —{" "}
                    {viewExamSubject
                      .subject?.name ||
                      viewExamSubject.subjectName ||
                      "N/A"}
                  </p>
                </div>

                <button
                  onClick={closeViewModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={22} />
                </button>
              </div>

              {/* ADD STUDENT */}

              <div className="px-6 py-4 border-b border-gray-200">
                <button
                  onClick={openAddStudent}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  <UserPlus size={18} />
                  Add Student
                </button>
              </div>

              {/* STUDENTS */}

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {!viewExamSubject.marks ||
                viewExamSubject.marks
                  .length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No students added to this exam yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                            #
                          </th>

                          <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                            Student Name
                          </th>

                          <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                            Obtained Marks
                          </th>

                          <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600 border border-gray-200">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {viewExamSubject.marks.map(
                          (mark, index) => (
                            <tr key={mark.id}>
                              <td className="px-4 py-3 border border-gray-200">
                                {index + 1}
                              </td>

                              <td className="px-4 py-3 font-medium text-gray-800 border border-gray-200">
                                {mark.student
                                  ?.name ||
                                  "N/A"}
                              </td>

                              <td className="px-4 py-3 border border-gray-200">
                                {Number(
                                  mark.obtainedMarks ||
                                    0
                                )}
                              </td>

                              <td className="px-4 py-3 border border-gray-200">
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() =>
                                      openEditStudent(
                                        mark
                                      )
                                    }
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                    title="Edit Student"
                                  >
                                    <Edit
                                      size={17}
                                    />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteStudent(
                                        mark.id
                                      )
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                    title="Remove Student"
                                  >
                                    <Trash2
                                      size={17}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* =====================================================
          ADD / EDIT STUDENT MODAL
          ===================================================== */}

      {showStudentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {studentEditingId
                  ? "Edit Student"
                  : "Add Student"}
              </h2>

              <button
                onClick={closeStudentModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleStudentSubmit}
              className="p-6"
            >
              {studentError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {studentError}
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>

              <input
                type="text"
                value={studentName}
                onChange={(e) =>
                  setStudentName(
                    e.target.value
                  )
                }
                placeholder="Enter student name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeStudentModal}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  {studentEditingId
                    ? "Update Student"
                    : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

