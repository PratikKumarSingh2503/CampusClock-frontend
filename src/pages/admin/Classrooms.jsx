import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-hot-toast";

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const res = await API.get("/classrooms/admin/classrooms");
      setClassrooms(res.data);
    } catch {
      toast.error("Failed to fetch classrooms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this classroom?")) return;
    try {
      await API.delete(`/admin/classrooms/${id}`);
      toast.success("Classroom deleted");
      setClassrooms(classrooms.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to delete classroom");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Classrooms</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Teacher</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((c) => (
            <tr key={c._id}>
              <td className="border px-2 py-1">{c.name}</td>
              <td className="border px-2 py-1">{c.description}</td>
              <td className="border px-2 py-1">
                {c.createdBy?.user_name} <br />
                <span className="text-xs text-gray-500">{c.createdBy?.user_email}</span>
                <span className="text-xs text-gray-400 ml-2">({c.createdBy?.user_role})</span>
              </td>
              <td className="border px-2 py-1">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(c._id)}
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

export default Classrooms; 