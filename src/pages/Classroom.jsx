import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Classroom = () => {
  const { user } = useUser();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", code: "" });
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
    // eslint-disable-next-line
  }, [user]);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const res = await API.get("/classrooms/my");
      setClassrooms(res.data);
    } catch {
      toast.error("Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/classrooms/create", {
        name: form.name,
        description: form.description,
      });
      toast.success("Classroom created");
      setShowCreate(false);
      setForm({ name: "", description: "", code: "" });
      fetchClassrooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create classroom");
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await API.post("/classrooms/join", { code: form.code });
      toast.success("Joined classroom");
      setShowJoin(false);
      setForm({ name: "", description: "", code: "" });
      fetchClassrooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join classroom");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/classroom/${id}`);
  };

  const handleLeaveClassroom = async (e, id) => {
    e.stopPropagation();
    try {
      await API.delete(`/classrooms/${id}/leave`);
      toast.success("Left classroom");
      setClassrooms((classrooms) => classrooms.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to leave classroom");
    }
  };

  if (!user) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        Please log in to view communities.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto animate-fade-in">
      <div
        className={`rounded-xl shadow-xl p-6 ${
          theme === "light"
            ? "bg-color1 border-dcolor3"
            : "bg-dcolor3 border-color2"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Classrooms</h1>
          {user?.user_role === "teacher" || user?.user_role === "admin" ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setShowCreate(true)}
            >
              Create Classroom
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowJoin(true)}
            >
              Join Classroom
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : classrooms.length === 0 ? (
          <div className="text-center py-10">No classrooms found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {classrooms.map((c) => (
              <div
                key={c._id}
                // className="border rounded-lg p-4 shadow cursor-pointer hover:shadow-lg transition"
                className={`min-h-60 rounded-xl shadow border cursor-pointer hover:scale-105 transform transition duration-300 ${
                  theme === "light" ? "border-dcolor3" : "border-color2"
                }`}
                onClick={() => handleCardClick(c._id)}
              >
                <div className="py-3 flex justify-between items-center border-b">
                  <div className="space-y-1 px-6">
                    <div className="font-semibold text-lg">{c.name}</div>
                    <div className="">{c.description}</div>
                    {user.user_role === "teacher" ||
                      (user.user_role === "admin" && (
                        <div className="text-xs text-blue-700">
                          Code: {c.code}
                        </div>
                      ))}
                  </div>
                  {user.user_role === "student" && c.createdBy && (
                    <div className="p-4">
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium  border border-red  text-red-600 hover:bg-red-200 transition-colors"
                        onClick={(e) => handleLeaveClassroom(e, c._id)}
                      >
                        Leave
                      </button>
                    </div>
                  )}
                </div>

                {user.user_role === "student" && c.createdBy && (
                  <div className="mt-30 py-4 border-t flex items-center gap-2">
                    {c.createdBy.profilePic && (
                      <img
                        src={c.createdBy.profilePic}
                        alt="Teacher"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    )}
                    <span className="px-6 text-sm">
                      Created by : {c.createdBy.user_name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Classroom Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onSubmit={handleCreate}
            >
              <h2 className="text-xl font-bold mb-4">Create Classroom</h2>
              <input
                type="text"
                placeholder="Classroom Name"
                className="w-full mb-3 p-2 border rounded"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full mb-3 p-2 border rounded"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Join Classroom Modal */}
        {showJoin && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <form
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onSubmit={handleJoin}
            >
              <h2 className="text-xl font-bold mb-4">Join Classroom</h2>
              <input
                type="text"
                placeholder="Enter Classroom Code"
                className="w-full mb-3 p-2 border rounded"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value }))
                }
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setShowJoin(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classroom;
