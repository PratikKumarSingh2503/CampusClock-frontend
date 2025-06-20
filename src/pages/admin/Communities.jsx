import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-hot-toast";

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await API.get("/communities/admin/communities");
      setCommunities(res.data);
    } catch {
      toast.error("Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this community?")) return;
    try {
      await API.delete(`/admin/communities/${id}`);
      toast.success("Community deleted");
      setCommunities(communities.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to delete community");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Communities</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Teacher</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {communities.map((c) => (
            <tr key={c._id}>
              <td className="border px-2 py-1">{c.name}</td>
              <td className="border px-2 py-1">
                {c.teacherId?.user_name} <br />
                <span className="text-xs text-gray-500">{c.teacherId?.user_email}</span>
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

export default Communities; 