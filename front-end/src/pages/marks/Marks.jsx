
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  FileText,
} from "lucide-react";

const MARKS_API_URL = "http://localhost:5000/api/marks";
const STUDENTS_API_URL = "http://localhost:5000/api/students";
const EXAMS_API_URL = "http://localhost:5000/api/exams";
const SUBJECTS_API_URL = "http://localhost:5000/api/subjects";
const EXAM_SUBJECTS_API_URL =
  "http://localhost:5000/api/exam-subjects";

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examSubjects, setExamSubjects] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    studentName: "",
    examName: "",
    subjectName: "",
    obtainedMarks: "",
  });

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchAllData();
  }, []);

  // ==========================================
  // FETCH ALL DATA
  // ==========================================
  const fetchAllData = async () => {
    await Promise.all([
      fetchMarks(),
      fetchStudents(),
      fetchExams(),
      fetchSubjects(),
      fetchExamSubjects(),
    ]);
  };

  // ==========================================
  // FETCH MARKS
  // ==========================================
  const fetchMarks = async () => {
    try {
      const response = await fetch(MARKS_API_URL);
      const result = await response.json();

      if (result.success) {
        setMarks(result.data);
      } else {
        setError(result.message || "Failed to fetch marks");
      }
    } catch (err) {
      console.error("MARKS ERROR:", err);
      setError("Unable to connect to marks API");
    }
  };

  // ==========================================
  // FETCH STUDENTS
  // ==========================================
  const fetchStudents = async () => {
    try {
      const response = await fetch(STUDENTS_API_URL);
      const result = await response.json();

      if (result.success) {
        setStudents(result.data);
      }
    } catch (err) {
      console.error("STUDENTS ERROR:", err);
    }
  };

  // ==========================================
  // FETCH EXAMS
  // ==========================================
  const fetchExams = async () => {
    try {
      const response = await fetch(EXAMS_API_URL);
      const result = await response.json();

      if (result.success) {
        setExams(result.data);
      }
    } catch (err) {
      console.error("EXAMS ERROR:", err);
    }
  };

  // ==========================================
  // FETCH SUBJECTS
  // ==========================================
  const fetchSubjects = async () => {
    try {
      const response = await fetch(SUBJECTS_API_URL);
      const result = await response.json();

      if (result.success) {
        setSubjects(result.data);
      }
    } catch (err) {
      console.error("SUBJECTS ERROR:", err);
    }
  };

  // ==========================================
  // FETCH EXAM SUBJECTS
  // ==========================================
  const fetchExamSubjects = async () => {
    try {
      const response = await fetch(EXAM_SUBJECTS_API_URL);
      const result = await response.json();

      if (result.success) {
        setExamSubjects(result.data);
      }
    } catch (err) {
      console.error("EXAM SUBJECTS ERROR:", err);
    }
  };

  // ==========================================
  // NORMALIZE TEXT
  // ==========================================
  const normalizeText = (value) => {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  };

  // ==========================================
  // FIND STUDENT
  // ==========================================
  const findStudent = (name) => {
    const searchName = normalizeText(name);

    const matchedStudents = students.filter(
      (student) =>
        normalizeText(student.name) === searchName
    );

    if (matchedStudents.length === 0) {
      return {
        success: false,
        data: null,
      };
    }

    const sortedStudents = [...matchedStudents].sort(
      (a, b) => Number(b.id) - Number(a.id)
    );

    return {
      success: true,
      data: sortedStudents[0],
    };
  };

  // ==========================================
  // CREATE STUDENT
  // ==========================================
  const createStudent = async (name) => {
    const response = await fetch(STUDENTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to create student"
      );
    }

    return result.data;
  };

  // ==========================================
  // FIND EXAM
  // ==========================================
  const findExam = (name) => {
    const searchName = normalizeText(name);

    const matchedExams = exams.filter(
      (exam) =>
        normalizeText(exam.name) === searchName
    );

    if (matchedExams.length === 0) {
      return {
        success: false,
        data: null,
      };
    }

    const sortedExams = [...matchedExams].sort(
      (a, b) => Number(b.id) - Number(a.id)
    );

    return {
      success: true,
      data: sortedExams[0],
    };
  };

  // ==========================================
  // CREATE EXAM
  // ==========================================
  const createExam = async (name) => {
    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);

    const response = await fetch(EXAMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to create exam"
      );
    }

    return result.data;
  };

  // ==========================================
  // FIND SUBJECT
  // ==========================================
  const findSubject = (name) => {
    const searchName = normalizeText(name);

    const matchedSubjects = subjects.filter(
      (subject) =>
        normalizeText(subject.name) === searchName
    );

    if (matchedSubjects.length === 0) {
      return {
        success: false,
        data: null,
      };
    }

    const sortedSubjects = [...matchedSubjects].sort(
      (a, b) => Number(b.id) - Number(a.id)
    );

    return {
      success: true,
      data: sortedSubjects[0],
    };
  };

  // ==========================================
  // CREATE SUBJECT
  // ==========================================
  const createSubject = async (name) => {
    const subjectName = name.trim();

    const baseCode =
      subjectName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 8) || "SUB";

    let subjectCode = baseCode;
    let counter = 1;

    while (
      subjects.some(
        (subject) =>
          normalizeText(subject.code) ===
          normalizeText(subjectCode)
      )
    ) {
      subjectCode = `${baseCode}${counter}`;
      counter++;
    }

    const response = await fetch(SUBJECTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subjectName,
        code: subjectCode,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message || "Failed to create subject"
      );
    }

    return result.data;
  };

  // ==========================================
  // FIND EXAM SUBJECT
  // ==========================================
  const findExamSubject = (
    examId,
    subjectId,
    subjectName
  ) => {
    const matchedById = examSubjects.filter(
      (item) =>
        String(item.examId) === String(examId) &&
        String(item.subjectId) === String(subjectId)
    );

    if (matchedById.length > 0) {
      return {
        success: true,
        data: matchedById[0],
      };
    }

    const searchSubject = normalizeText(subjectName);

    const matchedByName = examSubjects.filter(
      (item) =>
        String(item.examId) === String(examId) &&
        normalizeText(item.subject?.name) ===
          searchSubject
    );

    if (matchedByName.length > 0) {
      return {
        success: true,
        data: matchedByName[0],
      };
    }

    return {
      success: false,
      data: null,
    };
  };

  // ==========================================
  // CREATE EXAM SUBJECT
  // ==========================================
  const createExamSubject = async (
    examId,
    subjectId
  ) => {
    const response = await fetch(
      EXAM_SUBJECTS_API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          examId: Number(examId),
          subjectId: Number(subjectId),
          totalMarks: 100,
          passingMarks: 40,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "Failed to create exam subject"
      );
    }

    return result.data;
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================
  const openAddModal = async () => {
    setEditingMark(null);

    setForm({
      studentName: "",
      examName: "",
      subjectName: "",
      obtainedMarks: "",
    });

    setMessage("");
    setError("");

    await Promise.all([
      fetchStudents(),
      fetchExams(),
      fetchSubjects(),
      fetchExamSubjects(),
    ]);

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const openEditModal = (mark) => {
    setEditingMark(mark);

    setForm({
      studentName: mark.student?.name || "",
      examName:
        mark.examSubject?.exam?.name || "",
      subjectName:
        mark.examSubject?.subject?.name || "",
      obtainedMarks: String(
        mark.obtainedMarks ?? ""
      ),
    });

    setMessage("");
    setError("");

    setShowModal(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================
  const closeModal = () => {
    setShowModal(false);
    setEditingMark(null);

    setForm({
      studentName: "",
      examName: "",
      subjectName: "",
      obtainedMarks: "",
    });

    setMessage("");
    setError("");
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // ==========================================
  // CURRENT EXAM
  // ==========================================
  const currentExamResult = form.examName
    ? findExam(form.examName)
    : null;

  const currentExam =
    currentExamResult?.success
      ? currentExamResult.data
      : null;

  // ==========================================
  // CURRENT SUBJECT
  // ==========================================
  const currentSubjectResult = form.subjectName
    ? findSubject(form.subjectName)
    : null;

  const currentSubject =
    currentSubjectResult?.success
      ? currentSubjectResult.data
      : null;

  // ==========================================
  // CURRENT EXAM SUBJECT
  // ==========================================
  const currentExamSubject =
    currentExam && currentSubject
      ? findExamSubject(
          currentExam.id,
          currentSubject.id,
          form.subjectName
        )
      : null;

  const totalMarks =
    currentExamSubject?.success
      ? currentExamSubject.data?.totalMarks
      : "";

  const passingMarks =
    currentExamSubject?.success
      ? currentExamSubject.data?.passingMarks
      : "";

  // ==========================================
  // CREATE / UPDATE MARK
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!form.studentName.trim()) {
      setError("Please enter student name");
      return;
    }

    if (!form.examName.trim()) {
      setError("Please enter exam name");
      return;
    }

    if (!form.subjectName.trim()) {
      setError("Please enter subject name");
      return;
    }

    if (form.obtainedMarks === "") {
      setError("Please enter obtained marks");
      return;
    }

    const obtained = Number(form.obtainedMarks);

    if (Number.isNaN(obtained)) {
      setError("Obtained marks must be a number");
      return;
    }

    if (obtained < 0) {
      setError("Obtained marks cannot be negative");
      return;
    }

    // ==========================================
    // UPDATE EXISTING MARK
    // ==========================================
    if (editingMark) {
      setLoading(true);

      try {
        // ========================================
        // 1. FIND OR CREATE STUDENT
        // ========================================
        let studentResult =
          findStudent(form.studentName);

        let student;

        if (studentResult.success) {
          student = studentResult.data;
        } else {
          setMessage(
            `Student "${form.studentName}" not found. Creating student...`
          );

          student = await createStudent(
            form.studentName
          );

          setStudents((previous) => [
            ...previous,
            student,
          ]);
        }

        // ========================================
        // 2. FIND OR CREATE EXAM
        // ========================================
        let examResult =
          findExam(form.examName);

        let exam;

        if (examResult.success) {
          exam = examResult.data;
        } else {
          setMessage(
            `Exam "${form.examName}" not found. Creating exam...`
          );

          exam = await createExam(
            form.examName
          );

          setExams((previous) => [
            ...previous,
            exam,
          ]);
        }

        // ========================================
        // 3. FIND OR CREATE SUBJECT
        // ========================================
        let subjectResult =
          findSubject(form.subjectName);

        let subject;

        if (subjectResult.success) {
          subject = subjectResult.data;
        } else {
          setMessage(
            `Subject "${form.subjectName}" not found. Creating subject...`
          );

          subject = await createSubject(
            form.subjectName
          );

          setSubjects((previous) => [
            ...previous,
            subject,
          ]);
        }

        // ========================================
        // 4. FIND OR CREATE EXAM SUBJECT
        // ========================================
        let examSubjectResult =
          findExamSubject(
            exam.id,
            subject.id,
            subject.name
          );

        let examSubject;

        if (examSubjectResult.success) {
          examSubject =
            examSubjectResult.data;
        } else {
          setMessage(
            "Creating exam subject..."
          );

          examSubject =
            await createExamSubject(
              exam.id,
              subject.id
            );

          setExamSubjects((previous) => [
            ...previous,
            examSubject,
          ]);
        }

        // ========================================
        // 5. VALIDATE TOTAL MARKS
        // ========================================
        const total =
          Number(examSubject.totalMarks) || 100;

        if (obtained > total) {
          setError(
            `Obtained marks cannot be greater than ${total}`
          );
          return;
        }

        // ========================================
        // 6. UPDATE MARK
        // ========================================
        setMessage(
          "Updating student, exam, subject and marks..."
        );

        const response = await fetch(
          `${MARKS_API_URL}/${editingMark.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: Number(student.id),
              examId: Number(exam.id),
              subjectId: Number(subject.id),
              obtainedMarks: obtained,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          setError(
            result.message ||
              "Failed to update marks"
          );
          return;
        }

        // ========================================
        // 7. REFRESH ALL DATA
        // ========================================
        setMessage(
          "Student, exam, subject and marks updated successfully"
        );

        await Promise.all([
          fetchMarks(),
          fetchStudents(),
          fetchExams(),
          fetchSubjects(),
          fetchExamSubjects(),
        ]);

        // ========================================
        // 8. CLOSE MODAL
        // ========================================
        setTimeout(() => {
          closeModal();
        }, 800);
      } catch (err) {
        console.error(
          "UPDATE MARK ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to update marks"
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // ==========================================
    // CREATE FLOW
    // ==========================================
    setLoading(true);

    try {
      // ========================================
      // 1. FIND OR CREATE STUDENT
      // ========================================
      let studentResult =
        findStudent(form.studentName);

      let student;

      if (studentResult.success) {
        student = studentResult.data;

        setMessage(
          `Using existing student "${student.name}"`
        );
      } else {
        setMessage(
          "Student not found. Creating student..."
        );

        student = await createStudent(
          form.studentName
        );

        setStudents((previous) => [
          ...previous,
          student,
        ]);
      }

      // ========================================
      // 2. FIND OR CREATE EXAM
      // ========================================
      let examResult =
        findExam(form.examName);

      let exam;

      if (examResult.success) {
        exam = examResult.data;

        setMessage(
          `Using existing exam "${exam.name}"`
        );
      } else {
        setMessage(
          `Exam "${form.examName}" not found. Creating exam...`
        );

        exam = await createExam(
          form.examName
        );

        setExams((previous) => [
          ...previous,
          exam,
        ]);

        setMessage(
          `Exam "${exam.name}" created successfully`
        );
      }

      // ========================================
      // 3. FIND OR CREATE SUBJECT
      // ========================================
      let subjectResult =
        findSubject(form.subjectName);

      let subject;

      if (subjectResult.success) {
        subject = subjectResult.data;

        setMessage(
          `Using existing subject "${subject.name}"`
        );
      } else {
        setMessage(
          `Subject "${form.subjectName}" not found. Creating subject...`
        );

        subject = await createSubject(
          form.subjectName
        );

        setSubjects((previous) => [
          ...previous,
          subject,
        ]);

        setMessage(
          `Subject "${subject.name}" created successfully`
        );
      }

      // ========================================
      // 4. FIND OR CREATE EXAM SUBJECT
      // ========================================
      let examSubjectResult =
        findExamSubject(
          exam.id,
          subject.id,
          subject.name
        );

      let examSubject;

      if (examSubjectResult.success) {
        examSubject =
          examSubjectResult.data;

        setMessage(
          "Exam subject already exists"
        );
      } else {
        setMessage(
          "Creating exam subject..."
        );

        examSubject =
          await createExamSubject(
            exam.id,
            subject.id
          );

        setExamSubjects((previous) => [
          ...previous,
          examSubject,
        ]);

        setMessage(
          "Exam subject created successfully"
        );
      }

      // ========================================
      // 5. VALIDATE TOTAL MARKS
      // ========================================
      const total = Number(
        examSubject.totalMarks
      );

      if (total && obtained > total) {
        setError(
          `Obtained marks cannot be greater than ${total}`
        );
        return;
      }

      // ========================================
      // 6. CREATE MARK
      // ========================================
      setMessage("Saving marks...");

      const response = await fetch(
        MARKS_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            examId: Number(exam.id),
            studentId: Number(student.id),
            subjectId: Number(subject.id),
            obtainedMarks: obtained,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Failed to create marks"
        );
        return;
      }

      // ========================================
      // SUCCESS
      // ========================================
      setMessage(
        "Marks saved successfully in database"
      );

      await Promise.all([
        fetchMarks(),
        fetchStudents(),
        fetchExams(),
        fetchSubjects(),
        fetchExamSubjects(),
      ]);

      setTimeout(() => {
        closeModal();
      }, 800);
    } catch (err) {
      console.error(
        "CREATE MARK ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to save marks"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE MARK
  // ==========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete these marks?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${MARKS_API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Failed to delete marks"
        );
        return;
      }

      setMessage(
        "Marks deleted successfully"
      );

      await fetchMarks();

      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (err) {
      console.error(
        "DELETE MARK ERROR:",
        err
      );

      setError(
        "Unable to connect to marks API"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredMarks = marks.filter(
    (mark) => {
      const searchText =
        search.toLowerCase();

      return (
        mark.student?.name
          ?.toLowerCase()
          .includes(searchText) ||
        mark.examSubject?.exam?.name
          ?.toLowerCase()
          .includes(searchText) ||
        mark.examSubject?.subject?.name
          ?.toLowerCase()
          .includes(searchText) ||
        mark.examSubject?.subject?.code
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  // ==========================================
  // RESULT STATUS
  // ==========================================
  const getStatus = (mark) => {
    const obtained = Number(
      mark.obtainedMarks
    );

    const passing = Number(
      mark.examSubject?.passingMarks
    );

    return obtained >= passing
      ? "Pass"
      : "Fail";
  };

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Marks
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student examination marks
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Marks
        </button>
      </div>

      {/* ALERTS */}
      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && !showModal && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search student, exam or subject..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Exam
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Subject
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Marks
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Passing
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMarks.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <FileText
                      size={40}
                      className="mx-auto mb-3 text-slate-300"
                    />

                    <p className="text-sm font-medium text-slate-500">
                      No marks found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add marks using the button above
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMarks.map((mark) => {
                  const status = getStatus(mark);

                  return (
                    <tr
                      key={mark.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* STUDENT */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800">
                          {mark.student?.name || "-"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {mark.student?.email || ""}
                        </div>
                      </td>

                      {/* EXAM */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {mark.examSubject?.exam?.name || "-"}
                      </td>

                      {/* SUBJECT */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-slate-700">
                          {mark.examSubject?.subject?.name || "-"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {mark.examSubject?.subject?.code || ""}
                        </div>
                      </td>

                      {/* MARKS */}
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800">
                          {mark.obtainedMarks}
                        </span>

                        <span className="text-slate-400">
                          {" / "}
                          {mark.examSubject?.totalMarks}
                        </span>
                      </td>

                      {/* PASSING */}
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {mark.examSubject?.passingMarks}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            status === "Pass"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              openEditModal(mark)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(mark.id)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingMark
                    ? "Edit Marks"
                    : "Add Marks"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingMark
                    ? "Update student, exam, subject and obtained marks"
                    : "Enter student examination marks"}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* ERROR */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {message && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {/* STUDENT */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Student Name
                </label>

                <input
                  type="text"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <p className="mt-1 text-xs text-slate-400">
                  If student does not exist, it will be created automatically.
                </p>
              </div>

              {/* EXAM */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Exam Name
                </label>

                <input
                  type="text"
                  name="examName"
                  value={form.examName}
                  onChange={handleChange}
                  placeholder="e.g. Mid Term Examination"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {currentExam ? (
                  <p className="mt-1 text-xs text-indigo-600">
                    Existing exam found:{" "}
                    {currentExam.name}{" "}
                    (ID: {currentExam.id})
                  </p>
                ) : form.examName.trim() ? (
                  <p className="mt-1 text-xs text-green-600">
                    New exam will be created automatically.
                  </p>
                ) : null}
              </div>

              {/* SUBJECT */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject Name
                </label>

                <input
                  type="text"
                  name="subjectName"
                  value={form.subjectName}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {currentSubject ? (
                  <p className="mt-1 text-xs text-indigo-600">
                    Existing subject found:{" "}
                    {currentSubject.name}{" "}
                    ({currentSubject.code})
                  </p>
                ) : form.subjectName.trim() ? (
                  <p className="mt-1 text-xs text-green-600">
                    New subject will be created automatically.
                  </p>
                ) : null}
              </div>

              {/* MARKS INFO */}
              {currentExamSubject?.success ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Total Marks
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {totalMarks}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Passing Marks
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-800">
                      {passingMarks}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                  <p className="text-xs font-medium text-indigo-700">
                    New exam subject
                  </p>

                  <p className="mt-1 text-xs text-indigo-600">
                    Default marks structure will be:
                    <strong>
                      {" "}
                      100 Total / 40 Passing
                    </strong>
                  </p>
                </div>
              )}

              {/* OBTAINED MARKS */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Obtained Marks
                </label>

                <input
                  type="number"
                  name="obtainedMarks"
                  min="0"
                  step="0.01"
                  value={form.obtainedMarks}
                  onChange={handleChange}
                  placeholder="Enter obtained marks"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                {totalMarks ? (
                  <p className="mt-1 text-xs text-slate-400">
                    Maximum marks: {totalMarks}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">
                    New exam subjects use maximum marks of 100.
                  </p>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : editingMark
                    ? "Update Marks"
                    : "Save Marks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

