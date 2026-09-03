
import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  X,
  Clock,
  Save,
  RefreshCw,
} from "lucide-react";

const ATTENDANCE_API = "http://localhost:5000/api/attendance";
const STUDENTS_API = "http://localhost:5000/api/students";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // TOKEN
  // ========================================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ========================================
  // HEADERS
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
        throw new Error(
          result.message || "Failed to fetch students"
        );
      }

      setStudents(result.data || []);
    } catch (err) {
      console.error("FETCH STUDENTS ERROR:", err);
      setError(err.message || "Failed to load students");
    }
  };

  // ========================================
  // FETCH ALL ATTENDANCE
  // ========================================
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(ATTENDANCE_API, {
        method: "GET",
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch attendance"
        );
      }

      const records = result.data || [];

      setAttendanceRecords(
        records.reduce((acc, record) => {
          const recordDate = new Date(record.date)
            .toISOString()
            .split("T")[0];

          const key = `${record.studentId}_${recordDate}`;

          acc[key] = record;

          return acc;
        }, {})
      );
    } catch (err) {
      console.error("FETCH ATTENDANCE ERROR:", err);
      setError(
        err.message || "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================
  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  // ========================================
  // LOAD SELECTED DATE ATTENDANCE
  // ========================================
  useEffect(() => {
    const dateAttendance = {};

    students.forEach((student) => {
      const key = `${student.id}_${selectedDate}`;
      const record = attendanceRecords[key];

      if (record) {
        dateAttendance[student.id] = record.status;
      }
    });

    setAttendance(dateAttendance);
  }, [students, attendanceRecords, selectedDate]);

  // ========================================
  // CHANGE ATTENDANCE
  // ========================================
  const setStudentAttendance = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ========================================
  // SAVE ATTENDANCE
  // ========================================
  const handleSave = async () => {
    if (students.length === 0) {
      alert("No students found.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setError("");

      for (const student of students) {
        const status = attendance[student.id] || "PRESENT";

        const key = `${student.id}_${selectedDate}`;
        const existingRecord = attendanceRecords[key];

        // ========================================
        // UPDATE EXISTING RECORD
        // ========================================
        if (existingRecord) {
          const response = await fetch(
            `${ATTENDANCE_API}/${existingRecord.id}`,
            {
              method: "PUT",
              headers: getHeaders(),
              body: JSON.stringify({
                date: selectedDate,
                status,
              }),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                `Failed to update attendance for ${student.name}`
            );
          }

          setAttendanceRecords((prev) => ({
            ...prev,
            [key]: result.data,
          }));
        }

        // ========================================
        // CREATE NEW RECORD
        // ========================================
        else {
          const response = await fetch(ATTENDANCE_API, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
              studentId: student.id,
              date: selectedDate,
              status,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(
              result.message ||
                `Failed to create attendance for ${student.name}`
            );
          }

          setAttendanceRecords((prev) => ({
            ...prev,
            [key]: result.data,
          }));
        }
      }

      setMessage("Attendance saved successfully!");

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error("SAVE ATTENDANCE ERROR:", err);

      setError(
        err.message || "Failed to save attendance"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // REFRESH
  // ========================================
  const handleRefresh = async () => {
    await fetchStudents();
    await fetchAttendance();

    setMessage("Attendance refreshed.");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  // ========================================
  // COUNTS
  // ========================================
  const presentCount = students.filter(
    (student) =>
      (attendance[student.id] || "PRESENT") === "PRESENT"
  ).length;

  const absentCount = students.filter(
    (student) =>
      attendance[student.id] === "ABSENT"
  ).length;

  const lateCount = students.filter(
    (student) =>
      attendance[student.id] === "LATE"
  ).length;

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Attendance
          </h1>

          <p className="text-slate-500 mt-1">
            Mark and save daily student attendance
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
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
          FILTER
      ======================================== */}
      <div className="flex flex-wrap gap-4 items-center">

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
          <Calendar className="w-4 h-4 text-slate-400" />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="text-sm focus:outline-none"
          />
        </div>

        {message && (
          <span className="text-sm text-emerald-600 font-medium">
            {message}
          </span>
        )}
      </div>

      {/* ========================================
          SUMMARY
      ======================================== */}
      <div className="flex flex-wrap gap-4 text-sm">

        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl">
          Present: <strong>{presentCount}</strong>
        </div>

        <div className="bg-rose-50 text-rose-700 px-4 py-2 rounded-xl">
          Absent: <strong>{absentCount}</strong>
        </div>

        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl">
          Late: <strong>{lateCount}</strong>
        </div>

      </div>

      {/* ========================================
          STUDENT LIST
      ======================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">

          <div>
            <h2 className="font-semibold text-slate-900">
              Student Attendance
            </h2>

            <p className="text-xs text-slate-400 mt-1">
              {selectedDate}
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || students.length === 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-medium"
          >
            <Save className="w-4 h-4" />

            {saving ? "Saving..." : "Save Attendance"}
          </button>

        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading students and attendance...
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No students found.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">

            {students.map((student) => {
              const status =
                attendance[student.id] || "PRESENT";

              return (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50"
                >

                  {/* Student */}
                  <div>
                    <p className="font-medium text-slate-900">
                      {student.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Student ID: {student.id}
                    </p>
                  </div>

                  {/* Attendance Buttons */}
                  <div className="flex flex-wrap gap-2">

                    {/* PRESENT */}
                    <button
                      onClick={() =>
                        setStudentAttendance(
                          student.id,
                          "PRESENT"
                        )
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                        status === "PRESENT"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      Present
                    </button>

                    {/* ABSENT */}
                    <button
                      onClick={() =>
                        setStudentAttendance(
                          student.id,
                          "ABSENT"
                        )
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                        status === "ABSENT"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                      }`}
                    >
                      <X className="w-4 h-4" />
                      Absent
                    </button>

                    {/* LATE */}
                    <button
                      onClick={() =>
                        setStudentAttendance(
                          student.id,
                          "LATE"
                        )
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                        status === "LATE"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      Late
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

