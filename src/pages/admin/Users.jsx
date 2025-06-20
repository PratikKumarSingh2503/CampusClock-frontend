import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, students, teachers

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    let url = "/user/admin/users";
    if (filter === "students") url = "user/admin/users/students";
    if (filter === "teachers") url = "user/admin/users/teachers";
    try {
      const res = await API.get(url);
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === "students" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("students")}
        >
          Students
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === "teachers" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("teachers")}
        >
          Teachers
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border px-2 py-1">{u.user_name}</td>
              <td className="border px-2 py-1">{u.user_email}</td>
              <td className="border px-2 py-1">{u.user_role}</td>
              <td className="border px-2 py-1">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users; 