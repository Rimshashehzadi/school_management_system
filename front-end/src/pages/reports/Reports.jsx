
import { useEffect, useState } from "react";
import {
  Users,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  Download,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function Reports() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);
  const [marks, setMarks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // GET TOKEN
  // ==========================================
  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ==========================================
  // FETCH STUDENTS
  // GET /api/students
  // ==========================================
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch students");
      }

      setStudents(result.data || []);
    } catch (error) {
      console.error("STUDENT REPORT ERROR:", error);
    }
  };

  // ==========================================
  // FETCH ATTENDANCE
  // GET /api/attendance
  // ==========================================
  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch attendance");
      }

      setAttendance(result.data || []);
    } catch (error) {
      console.error("ATTENDANCE REPORT ERROR:", error);
    }
  };

  // ==========================================
  // FETCH FEES
  // GET /api/fees
  // ==========================================
  const fetchFees = async () => {
    try {
      const response = await fetch(`${API_URL}/fees`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch fees");
      }

      setFees(result.data || []);
    } catch (error) {
      console.error("FEE REPORT ERROR:", error);
    }
  };

  // ==========================================
  // FETCH MARKS / RESULTS
  // GET /api/marks
  // ==========================================
  const fetchMarks = async () => {
    try {
      const response = await fetch(`${API_URL}/marks`, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch marks");
      }

      setMarks(result.data || []);
    } catch (error) {
      console.error("MARKS REPORT ERROR:", error);
    }
  };

  // ==========================================
  // LOAD ALL REPORT DATA
  // ==========================================
  useEffect(() => {
    const loadReportsData = async () => {
      setLoading(true);
      setMessage("");

      await Promise.all([
        fetchStudents(),
        fetchAttendance(),
        fetchFees(),
        fetchMarks(),
      ]);

      setLoading(false);
    };

    loadReportsData();
  }, []);

  // ==========================================
  // CSV VALUE HELPER
  // ==========================================
  const csvValue = (value) => {
    if (value === null || value === undefined) {
      return '""';
    }

    const stringValue = String(value).replace(/"/g, '""');

    return `"${stringValue}"`;
  };

  // ==========================================
  // DOWNLOAD CSV
  // ==========================================
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = [
      headers.map(csvValue).join(","),
      ...rows.map((row) => row.map(csvValue).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  // ==========================================
  // STUDENT REPORT
  // ==========================================
  const downloadStudentReport = () => {
    if (!students.length) {
      setMessage("No student data available.");
      return;
    }

    const rows = students.map((student) => [
      student.id,
      student.name,
      student.email || "",
      student.createdAt
        ? new Date(student.createdAt).toLocaleDateString()
        : "",
    ]);

    downloadCSV(
      "student-report.csv",
      ["ID", "Student Name", "Email", "Created Date"],
      rows
    );

    setMessage("Student report downloaded successfully!");
  };

  // ==========================================
  // ATTENDANCE REPORT
  // ==========================================
  const downloadAttendanceReport = () => {
    if (!attendance.length) {
      setMessage("No attendance data available.");
      return;
    }

    const rows = attendance.map((record) => [
      record.id,
      record.student?.id || record.studentId || "",
      record.student?.name || "",
      record.student?.email || "",
      record.date
        ? new Date(record.date).toLocaleDateString()
        : "",
      record.status || "",
    ]);

    downloadCSV(
      "attendance-report.csv",
      [
        "Attendance ID",
        "Student ID",
        "Student Name",
        "Email",
        "Date",
        "Status",
      ],
      rows
    );

    setMessage("Attendance report downloaded successfully!");
  };

  // ==========================================
  // FEE REPORT
  // ==========================================
  const downloadFeeReport = () => {
    if (!fees.length) {
      setMessage("No fee data available.");
      return;
    }

    const rows = fees.map((fee) => {
      const totalAmount = Number(fee.amount || 0);
      const paidAmount = Number(fee.paidAmount || 0);
      const remainingAmount = totalAmount - paidAmount;

      return [
        fee.id,
        fee.student?.id || fee.studentId || "",
        fee.student?.name || "",
        fee.student?.email || "",
        totalAmount,
        paidAmount,
        remainingAmount,
        fee.status || "",
        fee.dueDate
          ? new Date(fee.dueDate).toLocaleDateString()
          : "",
      ];
    });

    downloadCSV(
      "fee-report.csv",
      [
        "Fee ID",
        "Student ID",
        "Student Name",
        "Email",
        "Total Amount",
        "Paid Amount",
        "Remaining Amount",
        "Status",
        "Due Date",
      ],
      rows
    );

    setMessage("Fee report downloaded successfully!");
  };

  // ==========================================
  // EXAM / RESULT REPORT
  // GET /api/marks
  // ==========================================
  const downloadExamReport = () => {
    if (!marks.length) {
      setMessage("No marks/result data available.");
      return;
    }

    const rows = marks.map((mark) => {
      const totalMarks = Number(
        mark.examSubject?.totalMarks || 0
      );

      const obtainedMarks = Number(
        mark.obtainedMarks || 0
      );

      const passingMarks = Number(
        mark.examSubject?.passingMarks || 0
      );

      const percentage =
        totalMarks > 0
          ? ((obtainedMarks / totalMarks) * 100).toFixed(2)
          : "0.00";

      const result =
        obtainedMarks >= passingMarks
          ? "PASS"
          : "FAIL";

      return [
        mark.id,
        mark.student?.id || mark.studentId || "",
        mark.student?.name || "",
        mark.student?.email || "",
        mark.examSubject?.exam?.id || "",
        mark.examSubject?.exam?.name || "",
        mark.examSubject?.subject?.id || "",
        mark.examSubject?.subject?.name || "",
        mark.examSubject?.subject?.code || "",
        totalMarks,
        passingMarks,
        obtainedMarks,
        `${percentage}%`,
        result,
      ];
    });

    downloadCSV(
      "exam-result-report.csv",
      [
        "Marks ID",
        "Student ID",
        "Student Name",
        "Email",
        "Exam ID",
        "Exam Name",
        "Subject ID",
        "Subject Name",
        "Subject Code",
        "Total Marks",
        "Passing Marks",
        "Obtained Marks",
        "Percentage",
        "Result",
      ],
      rows
    );

    setMessage(
      "Exam / Result report downloaded successfully!"
    );
  };

  // ==========================================
  // REPORTS LIST
  // ==========================================
  const reports = [
    {
      id: "students",
      title: "Student Report",
      desc: "Complete list of all students",
      icon: Users,
      count: students.length,
      download: downloadStudentReport,
    },
    {
      id: "attendance",
      title: "Attendance Report",
      desc: "Student attendance records",
      icon: CalendarCheck,
      count: attendance.length,
      download: downloadAttendanceReport,
    },
    {
      id: "fees",
      title: "Fee Report",
      desc: "Paid, pending and overdue fees",
      icon: CreditCard,
      count: fees.length,
      download: downloadFeeReport,
    },
    {
      id: "exams",
      title: "Exam / Result Report",
      desc: "Student marks, subjects and results",
      icon: GraduationCap,
      count: marks.length,
      download: downloadExamReport,
    },
  ];

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="space-y-6">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Reports
        </h1>

        <p className="text-slate-500 mt-1">
          Download school reports in CSV format
        </p>
      </div>

      {/* ==========================================
          MESSAGE
      ========================================== */}
      {message && (
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}
      {loading && (
        <div className="bg-slate-50 border border-slate-100 text-slate-600 rounded-xl px-4 py-3 text-sm">
          Loading report data...
        </div>
      )}

      {/* ==========================================
          REPORT CARDS
      ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">
            Available Reports
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Select a report to download its CSV file
          </p>
        </div>

        <div className="divide-y divide-slate-50">

          {reports.map((report) => {
            const Icon = report.icon;

            return (
              <div
                key={report.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition"
              >

                {/* REPORT INFO */}
                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>

                  <div>
                    <p className="font-medium text-slate-900">
                      {report.title}
                    </p>

                    <p className="text-sm text-slate-500">
                      {report.desc}
                    </p>

                    <p className="text-xs text-indigo-600 mt-1">
                      {report.count} record
                      {report.count !== 1 ? "s" : ""}
                    </p>
                  </div>

                </div>

                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={report.download}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}

