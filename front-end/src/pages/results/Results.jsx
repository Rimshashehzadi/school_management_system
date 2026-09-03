import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  User,
  GraduationCap,
  Award,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const RESULT_API = "http://localhost:5000/api/results";
const STUDENT_API = "http://localhost:5000/api/students";
const EXAM_API = "http://localhost:5000/api/exams";

export default function Result() {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH STUDENTS
  // ==========================================

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);

      const response = await fetch(STUDENT_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch students");
      }

      setStudents(data.data || []);
    } catch (error) {
      console.error("Fetch Students Error:", error);
      setError("Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  // ==========================================
  // FETCH EXAMS
  // ==========================================

  const fetchExams = async () => {
    try {
      setLoadingExams(true);

      const response = await fetch(EXAM_API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch exams");
      }

      setExams(data.data || []);
    } catch (error) {
      console.error("Fetch Exams Error:", error);
      setError("Failed to load exams");
    } finally {
      setLoadingExams(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchStudents();
    fetchExams();
  }, []);

  // ==========================================
  // FETCH RESULT
  // ==========================================

  const fetchResult = async () => {
    if (!studentId || !examId) {
      setError("Please select both student and exam");
      setResult(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(
        `${RESULT_API}/student/${studentId}/exam/${examId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch result");
      }

      setResult(data.data);
    } catch (error) {
      console.error("Fetch Result Error:", error);
      setError(error.message || "Failed to load result");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {
    setStudentId("");
    setExamId("");
    setResult(null);
    setError("");
  };

  // ==========================================
  // GRADE STYLE
  // ==========================================

  const getGradeStyle = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-green-100 text-green-700";

      case "A":
        return "bg-green-100 text-green-700";

      case "B":
        return "bg-blue-100 text-blue-700";

      case "C":
        return "bg-yellow-100 text-yellow-700";

      case "D":
        return "bg-orange-100 text-orange-700";

      case "E":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-red-100 text-red-700";
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    return status === "PASS"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Results
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View student examination results and grades
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw size={17} />
            Reset
          </button>

        </div>
      </div>

      {/* ======================================
          SEARCH / FILTER CARD
      ====================================== */}

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">

        <div className="flex items-center gap-2 mb-5">
          <Search size={20} className="text-gray-600" />

          <h2 className="font-semibold text-gray-800">
            Search Result
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* STUDENT */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>

            <div className="relative">

              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  setResult(null);
                  setError("");
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              >
                <option value="">
                  {loadingStudents
                    ? "Loading students..."
                    : "Select Student"}
                </option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                    {student.email ? ` - ${student.email}` : ""}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* EXAM */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exam
            </label>

            <div className="relative">

              <GraduationCap
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={examId}
                onChange={(e) => {
                  setExamId(e.target.value);
                  setResult(null);
                  setError("");
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              >
                <option value="">
                  {loadingExams
                    ? "Loading exams..."
                    : "Select Exam"}
                </option>

                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>

            </div>
          </div>

        </div>

        {/* SEARCH BUTTON */}

        <div className="mt-5 flex justify-end">

          <button
            onClick={fetchResult}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            <Search size={17} />

            {loading ? "Loading..." : "View Result"}
          </button>

        </div>

      </div>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <XCircle size={18} />

          <span>{error}</span>
        </div>
      )}

      {/* ======================================
          RESULT
      ====================================== */}

      {result && (
        <>

          {/* ==================================
              STUDENT + EXAM INFORMATION
          ================================== */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">

            <div className="flex items-center gap-2 mb-5">
              <FileText size={20} className="text-gray-600" />

              <h2 className="font-semibold text-gray-800">
                Result Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Student
                </p>

                <p className="font-semibold text-gray-800">
                  {result.student?.name}
                </p>

                {result.student?.email && (
                  <p className="text-sm text-gray-500 mt-1">
                    {result.student.email}
                  </p>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Examination
                </p>

                <p className="font-semibold text-gray-800">
                  {result.exam?.name}
                </p>

                {result.exam?.startDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(
                      result.exam.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      result.exam.endDate
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* ==================================
              SUMMARY CARDS
          ================================== */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* TOTAL SUBJECTS */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    Total Subjects
                  </p>

                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {result.summary?.totalSubjects || 0}
                  </p>
                </div>

                <div className="p-2.5 bg-gray-100 rounded-lg">
                  <FileText
                    size={20}
                    className="text-gray-600"
                  />
                </div>

              </div>

            </div>

            {/* TOTAL MARKS */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    Total Marks
                  </p>

                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {result.summary?.totalMarks || 0}
                  </p>
                </div>

                <div className="p-2.5 bg-gray-100 rounded-lg">
                  <Award
                    size={20}
                    className="text-gray-600"
                  />
                </div>

              </div>

            </div>

            {/* OBTAINED */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    Obtained Marks
                  </p>

                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {result.summary?.obtainedMarks || 0}
                  </p>
                </div>

                <div className="p-2.5 bg-gray-100 rounded-lg">
                  <GraduationCap
                    size={20}
                    className="text-gray-600"
                  />
                </div>

              </div>

            </div>

            {/* PERCENTAGE */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    Percentage
                  </p>

                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {result.summary?.percentage || 0}%
                  </p>
                </div>

                <div
                  className={`px-3 py-2 rounded-lg font-bold ${getGradeStyle(
                    result.summary?.grade
                  )}`}
                >
                  {result.summary?.grade || "-"}
                </div>

              </div>

            </div>

          </div>

          {/* ==================================
              SUBJECT MARKS TABLE
          ================================== */}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            <div className="p-5 border-b border-gray-200 flex items-center justify-between">

              <div>
                <h2 className="font-semibold text-gray-800">
                  Subject-wise Result
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Marks and performance by subject
                </p>
              </div>

              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                  result.summary?.status
                )}`}
              >
                {result.summary?.status === "PASS" ? (
                  <CheckCircle size={15} />
                ) : (
                  <XCircle size={15} />
                )}

                {result.summary?.status}
              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>
                  <tr className="bg-gray-50">

                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      #
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Subject
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-left text-xs font-semibold text-gray-600">
                      Code
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Obtained
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Total
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Passing
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Percentage
                    </th>

                    <th className="border border-gray-200 px-4 py-3 text-center text-xs font-semibold text-gray-600">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {result.subjects?.map((subject, index) => (

                    <tr
                      key={`${subject.subjectId}-${index}`}
                      className="hover:bg-gray-50"
                    >

                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="border border-gray-200 px-4 py-3">

                        <p className="font-medium text-gray-800">
                          {subject.subjectName}
                        </p>

                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-sm text-gray-500">
                        {subject.subjectCode}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-800">
                        {subject.obtainedMarks}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-center text-gray-600">
                        {subject.totalMarks}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-center text-gray-600">
                        {subject.passingMarks}
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                        {subject.percentage}%
                      </td>

                      <td className="border border-gray-200 px-4 py-3 text-center">

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            subject.status
                          )}`}
                        >
                          {subject.status === "PASS" ? (
                            <CheckCircle size={13} />
                          ) : (
                            <XCircle size={13} />
                          )}

                          {subject.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* ==================================
                FINAL RESULT
            ================================== */}

            <div className="border-t border-gray-200 p-5 bg-gray-50">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-sm text-gray-500">
                    Final Result
                  </p>

                  <div className="flex items-center gap-3 mt-1">

                    <span className="text-xl font-bold text-gray-800">
                      {result.summary?.obtainedMarks} /{" "}
                      {result.summary?.totalMarks}
                    </span>

                    <span className="text-gray-500">
                      ({result.summary?.percentage}%)
                    </span>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-bold ${getGradeStyle(
                      result.summary?.grade
                    )}`}
                  >
                    Grade: {result.summary?.grade}
                  </span>

                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${getStatusStyle(
                      result.summary?.status
                    )}`}
                  >
                    {result.summary?.status === "PASS" ? (
                      <CheckCircle size={17} />
                    ) : (
                      <XCircle size={17} />
                    )}

                    {result.summary?.status}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {!result && !loading && !error && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center shadow-sm">

          <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">

            <FileText
              size={25}
              className="text-gray-500"
            />

          </div>

          <h3 className="font-semibold text-gray-800">
            No Result Selected
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Select a student and exam to view the result.
          </p>

        </div>
      )}

    </div>
  );
}