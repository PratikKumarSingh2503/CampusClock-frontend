import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const ClassroomDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [showDelete, setShowDelete] = useState(false);
  const [attendanceActive, setAttendanceActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [students, setStudents] = useState([]);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performance, setPerformance] = useState({ total: 0, attended: 0 });
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchClassroom();
    // eslint-disable-next-line
  }, [id]);

  const fetchClassroom = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/classrooms/${id}`);
      setClassroom(res.data);
      setEditForm({ name: res.data.name, description: res.data.description });
      if ((user.user_role === "teacher" || user.user_role === "admin")) fetchStudentScores();
    } catch {
      toast.error("Failed to load classroom");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentScores = async () => {
    try {
      const res = await API.get(`/attendance/classroom-score/${id}`);
      setStudents(res.data);
    } catch {
      setStudents([]);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/classrooms/${id}`, editForm);
      toast.success("Classroom updated");
      setEditMode(false);
      fetchClassroom();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update classroom");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/classrooms/${id}`);
      toast.success("Classroom deleted");
      setShowDelete(false);
      navigate("/classroom");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete classroom");
    }
  };

  // Attendance logic (teacher)
  const handleStartAttendance = async () => {
    try {
      await API.post("/attendance/start", { classroomId: id });
      toast.success("Attendance started (2 min)");
      setAttendanceActive(true);
      setTimer(120);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start attendance");
    }
  };

  // Attendance timer
  useEffect(() => {
    if (!attendanceActive || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) setAttendanceActive(false);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [attendanceActive, timer]);

  // Student: mark attendance
  const handleMarkAttendance = async () => {
    try {
      await API.post("/attendance/mark", { classroomId: id });
      toast.success("Attendance marked!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to mark attendance";
      if (msg.includes("already marked")) {
        toast.error("You have already marked attendance for this session.");
      } else if (msg.includes("geofence")) {
        toast.error("You are not within the allowed geofence (30m radius).");
      } else if (msg.includes("expired")) {
        toast.error("Attendance session has expired. Please wait for the next session.");
      } else {
        toast.error(msg);
      }
    }
  };

  // Student: fetch performance
  const fetchPerformance = async () => {
    try {
      const res = await API.get(`/attendance/score/${id}`);
      setPerformance({
        total: res.data.totalSessions,
        attended: res.data.attendedSessions,
      });
      setShowPerformance(true);
    } catch {
      toast.error("Failed to load performance");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await API.get(`/attendance/export/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attendance_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  if (loading || !classroom) return <div className="p-4">Loading...</div>;

  return (
    <div className="mx-auto animate-fade-in">
      <div
        className={`rounded-xl shadow-xl p-6 ${
          theme === "light"
            ? "bg-color1 border-dcolor3"
            : "bg-dcolor3 border-color2"
        }`}
      >
        <div className="border rounded-lg p-6 shadow mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-xl font-bold">{classroom.name}</h2>
              <h3 className="mt-2">{classroom.description}</h3>
            </div>
            <div>
              {(user.user_role === "teacher" || user.user_role === "admin") && (
                <span className="text-lg text-blue-700">
                  Code: {classroom.code}
                </span>
              )}
              {(user.user_role === "teacher" || user.user_role === "admin") && (
                <div className="flex mt-2 gap-2 mb-2">
                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => setShowDelete(true)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {user.user_role === "student" && classroom.createdBy && (
            <div className="flex items-center gap-2 mb-2">
              {classroom.createdBy.profilePic && (
                <img
                  src={classroom.createdBy.profilePic}
                  alt="Teacher"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              )}
              <span className="text-sm text-gray-700">
                {classroom.createdBy.user_name}
              </span>
            </div>
          )}
          {/* {classroom.createdBy && (
            <div className="flex items-center gap-2 mb-2">
              {classroom.createdBy.profilePic && (
                <img
                  src={classroom.createdBy.profilePic}
                  alt="Teacher"
                  className="w-8 h-8 rounded-full object-cover border"
                />
              )}
              <span className="text-sm text-gray-700">
                {classroom.createdBy.user_name}
              </span>
            </div>
          )} */}
        </div>

        {/* Teacher: Attendance and Students */}
        {(user.user_role === "teacher" || user.user_role === "admin") && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded mb-4"
                onClick={handleStartAttendance}
                disabled={attendanceActive}
              >
                {attendanceActive
                  ? `Attendance Active (${timer}s)`
                  : "Start Attendance"}
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded mb-4 ml-4"
                onClick={handleExportCSV}
              >
                Export Attendance CSV
              </button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Joined Students</h3>
              {students.length === 0 ? (
                <div className="text-gray-500">No students joined yet.</div>
              ) : (
                <table className="w-full text-left border">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Name</th>
                      <th className="border px-2 py-1">ID</th>
                      <th className="border px-2 py-1">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.studentId}>
                        <td className="border px-2 py-1">{s.name}</td>
                        <td className="border px-2 py-1">{s.studentId}</td>
                        <td className="border px-2 py-1">
                          {s.attended} / {s.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Student: Attendance and Performance */}
        {user.user_role === "student" && (
          <div className="mb-6 flex gap-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleMarkAttendance}
            >
              Mark Attendance
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={fetchPerformance}
            >
              Performance
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editMode && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-40">
            <form
              className={`p-6 rounded-xl w-full max-w-md animate-slide-in shadow-xl
              theme === "light"
                  ? "bg-color1 border-dcolor3"
                  : "dark:bg-gray-800 border-color2"
              }`}
              onSubmit={handleEdit}
            >
              <h2 className="text-xl font-bold mb-4">Edit Classroom</h2>
              <input
                type="text"
                placeholder="Classroom Name"
                className="w-full mb-3 p-2 border rounded"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full mb-3 p-2 border rounded"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="p-1 border border-color2 hover:bg-color2 rounded-lg transition-colors"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-1 border border-color2 hover:bg-yellow-500 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Delete Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Delete Classroom?</h2>
              <p className="mb-4">
                Are you sure you want to delete this classroom? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Performance Modal (Student) */}
        {showPerformance && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Attendance Performance</h2>
              <div className="mb-4">
                <div>Total Sessions: {performance.total}</div>
                <div>Attended: {performance.attended}</div>
                <div className="w-32 h-32 mx-auto">
                  {/* Pie chart placeholder */}
                  <svg viewBox="0 0 32 32" width="100%" height="100%">
                    <circle r="16" cx="16" cy="16" fill="#e5e7eb" />
                    {typeof performance.attended === "number" &&
                    typeof performance.total === "number" &&
                    performance.total > 0 ? (
                      performance.attended ===
                      0 ? null : performance.attended === performance.total ? (
                        <circle r="16" cx="16" cy="16" fill="#4f46e5" />
                      ) : (
                        <path
                          d={describeArc(
                            16,
                            16,
                            16,
                            0,
                            (performance.attended / performance.total) * 360
                          )}
                          fill="#4f46e5"
                        />
                      )
                    ) : null}
                  </svg>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => setShowPerformance(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for SVG pie chart
function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "Z",
  ].join(" ");
  return d;
}
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default ClassroomDetails;
