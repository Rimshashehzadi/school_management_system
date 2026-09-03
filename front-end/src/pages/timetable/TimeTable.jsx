import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  CalendarDays,
  Clock,
  User,
  BookOpen,
  School,
  MapPin,
} from "lucide-react";

const TIMETABLE_API = "http://localhost:5000/api/timetables";

const emptyForm = {
  className: "",
  subjectName: "",
  teacherName: "",
  day: "Monday",
  startTime: "",
  endTime: "",
  room: "",
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Timetable() {
  const [timetables, setTimetables] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  // =====================================================
  // FETCH TIMETABLES
  // =====================================================
  const fetchTimetables = async () => {
    try {
      setLoading(true);

      const response = await fetch(TIMETABLE_API);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch timetables");
      }

      setTimetables(result.data || []);
    } catch (error) {
      console.error("Fetch timetable error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================
  useEffect(() => {
    fetchTimetables();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================
  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================
  const openEditModal = (item) => {
    setEditingId(item.id);

    setFormData({
      className: item.className || "",
      subjectName: item.subjectName || "",
      teacherName: item.teacherName || "",
      day: item.day || "Monday",
      startTime: item.startTime || "",
      endTime: item.endTime || "",
      room: item.room || "",
    });

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // =====================================================
  // SUBMIT ADD / UPDATE
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (
      !formData.className.trim() ||
      !formData.subjectName.trim() ||
      !formData.teacherName.trim() ||
      !formData.day ||
      !formData.startTime ||
      !formData.endTime
    ) {
      alert(
        "Please fill Class, Subject, Teacher, Day, Start Time and End Time."
      );
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert("Start time must be earlier than end time.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        className: formData.className.trim(),
        subjectName: formData.subjectName.trim(),
        teacherName: formData.teacherName.trim(),
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room.trim() || null,
      };

      const url = editingId
        ? `${TIMETABLE_API}/${editingId}`
        : TIMETABLE_API;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      alert(
        editingId
          ? "Timetable updated successfully!"
          : "Timetable added successfully!"
      );

      closeModal();
      await fetchTimetables();
    } catch (error) {
      console.error("Save timetable error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch(`${TIMETABLE_API}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete timetable");
      }

      alert("Timetable deleted successfully!");

      await fetchTimetables();
    } catch (error) {
      console.error("Delete timetable error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VIEW
  // =====================================================
  const handleView = (item) => {
    setSelectedTimetable(item);
    setShowViewModal(true);
  };

  // =====================================================
  // FILTER
  // =====================================================
  const filteredTimetables = timetables.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      item.className?.toLowerCase().includes(searchText) ||
      item.subjectName?.toLowerCase().includes(searchText) ||
      item.teacherName?.toLowerCase().includes(searchText) ||
      item.day?.toLowerCase().includes(searchText) ||
      item.room?.toLowerCase().includes(searchText);

    const matchesClass =
      !classFilter ||
      item.className?.toLowerCase().includes(classFilter.toLowerCase());

    const matchesTeacher =
      !teacherFilter ||
      item.teacherName
        ?.toLowerCase()
        .includes(teacherFilter.toLowerCase());

    const matchesDay =
      !dayFilter ||
      item.day?.toLowerCase() === dayFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesClass &&
      matchesTeacher &&
      matchesDay
    );
  });

  // =====================================================
  // CLEAR FILTERS
  // =====================================================
  const clearFilters = () => {
    setSearch("");
    setClassFilter("");
    setTeacherFilter("");
    setDayFilter("");
  };

  // =====================================================
  // FORMAT DAY ORDER
  // =====================================================
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const sortedTimetables = [...filteredTimetables].sort((a, b) => {
    const dayDifference =
      (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99);

    if (dayDifference !== 0) {
      return dayDifference;
    }

    return String(a.startTime).localeCompare(String(b.startTime));
  });

  return (
    <div className="p-6 space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-blue-600" />

            <h1 className="text-2xl font-bold text-gray-800">
              Timetable
            </h1>
          </div>

          <p className="text-gray-500 mt-1">
            Manage class, subject and teacher schedules
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition"
        >
          <Plus size={18} />
          Add Timetable
        </button>
      </div>

      {/* =================================================
          FILTERS
      ================================================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search timetable..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class text filter */}
          <div className="relative">
            <School
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Filter by class..."
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Teacher text filter */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Filter by teacher..."
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Day filter */}
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Days</option>

            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {(search || classFilter || teacherFilter || dayFilter) && (
          <button
            onClick={clearFilters}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* =================================================
          TABLE
      ================================================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Class
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Subject
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Teacher
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Day
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Time
                </th>

                <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                  Room
                </th>

                <th className="text-center px-5 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && timetables.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    Loading timetables...
                  </td>
                </tr>
              ) : sortedTimetables.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-500"
                  >
                    <CalendarDays className="mx-auto mb-2 text-gray-400" />

                    <p>No timetable found.</p>

                    <button
                      onClick={openAddModal}
                      className="mt-3 text-blue-600 hover:text-blue-800"
                    >
                      Add your first timetable
                    </button>
                  </td>
                </tr>
              ) : (
                sortedTimetables.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <School
                          size={17}
                          className="text-blue-500"
                        />

                        <span className="font-medium text-gray-800">
                          {item.className}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen
                          size={17}
                          className="text-purple-500"
                        />

                        <span className="text-gray-700">
                          {item.subjectName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User
                          size={17}
                          className="text-green-500"
                        />

                        <span className="text-gray-700">
                          {item.teacherName}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
                        {item.day}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock size={16} />

                        <span>
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />

                        <span>
                          {item.room || "Not assigned"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* View */}
                        <button
                          onClick={() => handleView(item)}
                          title="View"
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit"
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition"
                        >
                          <Edit size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete"
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId
                    ? "Update Timetable"
                    : "Add Timetable"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter class, subject and teacher names manually.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >
              {/* Class / Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Class *
                  </label>

                  <div className="relative">
                    <School
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="className"
                      value={formData.className}
                      onChange={handleChange}
                      placeholder="e.g. 9th"
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    You can enter any class name.
                  </p>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Subject *
                  </label>

                  <div className="relative">
                    <BookOpen
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="subjectName"
                      value={formData.subjectName}
                      onChange={handleChange}
                      placeholder="e.g. Physics"
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    You can enter any subject name.
                  </p>
                </div>
              </div>

              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Teacher *
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="teacherName"
                    value={formData.teacherName}
                    onChange={handleChange}
                    placeholder="e.g. Ahmed"
                    required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  You can enter any teacher name.
                </p>
              </div>

              {/* Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Day *
                </label>

                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Time *
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* End */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    End Time *
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Room */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Room
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    placeholder="e.g. Room 101"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                    ? "Update Timetable"
                    : "Add Timetable"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}
      {showViewModal && selectedTimetable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Timetable Details
                </h2>

                <p className="text-sm text-gray-500">
                  Complete timetable information
                </p>
              </div>

              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedTimetable(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <DetailRow
                icon={<School size={18} />}
                label="Class"
                value={selectedTimetable.className}
              />

              <DetailRow
                icon={<BookOpen size={18} />}
                label="Subject"
                value={selectedTimetable.subjectName}
              />

              <DetailRow
                icon={<User size={18} />}
                label="Teacher"
                value={selectedTimetable.teacherName}
              />

              <DetailRow
                icon={<CalendarDays size={18} />}
                label="Day"
                value={selectedTimetable.day}
              />

              <DetailRow
                icon={<Clock size={18} />}
                label="Time"
                value={`${selectedTimetable.startTime} - ${selectedTimetable.endTime}`}
              />

              <DetailRow
                icon={<MapPin size={18} />}
                label="Room"
                value={selectedTimetable.room || "Not assigned"}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedTimetable(null);
                }}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
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

// =====================================================
// DETAIL ROW COMPONENT
// =====================================================
function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <div className="text-blue-600">{icon}</div>

      <div>
        <p className="text-xs text-gray-500">{label}</p>

        <p className="font-medium text-gray-800">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}