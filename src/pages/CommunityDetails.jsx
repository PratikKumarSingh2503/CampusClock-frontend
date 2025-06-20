import { useEffect, useState } from "react";
import API from "../utils/api";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import { FileText, Users, Trash2, Edit3, X, UploadCloud } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const CommunityDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [community, setCommunity] = useState(null);
  const [membersVisible, setMembersVisible] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [file, setFile] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (id) fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      const res = await API.get(`/communities/${id}`);
      setCommunity(res.data);
    } catch (err) {
      toast.error("Failed to load community");
    }
  };

  const handleDelete = async (msgId) => {
    try {
      // Check if token exists
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to delete messages");
        return;
      }

      console.log("Deleting message with ID:", msgId);
      console.log("Community ID:", id);

      const response = await API.delete(`/communities/${id}/message/${msgId}`);
      console.log("Delete response:", response);

      toast.success("Message deleted");
      fetchCommunity();
    } catch (error) {
      console.error("Delete error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      const errorMessage =
        error.response?.data?.message || "Failed to delete message";
      toast.error(errorMessage);
    }
  };

  const handleEdit = async (msgId) => {
    try {
      await API.put(`/communities/${id}/message/${msgId}`, { text: editText });
      toast.success("Message updated");
      setEditingMessageId(null);
      setEditText("");
      fetchCommunity();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      if (editText) formData.append("text", editText);
      if (file) formData.append("file", file);

      await API.post(`/communities/${id}/message`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Message posted");
      setEditText("");
      setFile(null);
      fetchCommunity();
    } catch {
      toast.error("Failed to post message");
    }
  };

  if (!community) return <div className="p-4">Loading...</div>;

  return (
    <div className="mx-auto animate-fade-in">
      <div
        className={`rounded-xl shadow-xl p-6 ${
          theme === "light"
            ? "bg-color1 border-dcolor3"
            : "bg-dcolor3 border-color2"
        }`}
      >
        <div className="flex">
          <div className="flex-7">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{community.name}</h2>
              <button
                onClick={() => setMembersVisible(!membersVisible)}
                className="text-sm hover:underline"
              >
                <Users className="inline-block mr-1 w-4 h-4" />{" "}
                {community.members.length} Members
              </button>
            </div>

            {membersVisible && (
              <div
                className={`mt-4 p-4 rounded shadow ${
                  theme === "light"
                    ? "bg-color1 border-dcolor3"
                    : "bg-dcolor3 border-color2"
                }`}
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Members
                  </h4>
                  <button
                    onClick={() => setMembersVisible(false)}
                    className="text-sm text-red-500"
                  >
                    <X className="inline-block w-4 h-4 mr-1" /> Close
                  </button>
                </div>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  {community.members.map((m) => (
                    <li key={m._id}>• {m.user_name}</li>
                  ))}
                </ul>
              </div>
            )}

            {user?.user_role === "teacher" || user.user_role === "admin" && (
              <div
                className={`mt-6 p-4 rounded shadow space-y-2 ${
                  theme === "light"
                    ? "bg-color2/50 border-dcolor3"
                    : "bg-dcolor2 border-color2"
                }`}
              >
                <h3 className="font-semibold">Post a Message or File</h3>
                <textarea
                  className="w-full p-2 border rounded-lg shadow-sm"
                  placeholder="Enter your message..."
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                ></textarea>
                <div className="flex items-center gap-3 p-2 border rounded-lg shadow-sm transition">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                    <span className="px-3 py-1.5 border border-blue-500 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                      Choose File
                    </span>
                  </label>

                  {file && (
                    <span className="truncate text-sm max-w-xs">
                      {file.name}
                    </span>
                  )}
                </div>
                <button
                  onClick={handlePost}
                  className="mt-2 px-4 py-2 border rounded-lg hover:underline cursor-pointer transition-colors"
                >
                  <UploadCloud className="inline-block w-4 h-4 mr-1" /> Post
                </button>
              </div>
            )}

            <div className="mt-6 space-y-4">
              {community.messages.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  No messages posted yet.
                </p>
              ) : (
                community.messages.map((m) => (
                  <div
                    key={m._id}
                    className={`rounded-lg shadow p-4 space-y-2 ${
                      theme === "light"
                        ? "bg-color2/50 border-dcolor3"
                        : "bg-dcolor2 border-color2"
                    }`}
                  >
                    {editingMessageId === m._id ? (
                      <div>
                        <textarea
                          className={`w-full p-2 border rounded ${
                            theme === "light"
                              ? "bg-color2 border-dcolor3"
                              : "bg-gray-700 border-color2"
                          }`}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={3}
                        ></textarea>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="text-sm px-3 py-1 b rounded"
                            onClick={() => handleEdit(m._id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-sm px-3 py-1 bg-color2 rounded"
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditText("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            {m.text && <p className="">{m.text}</p>}
                            {m.file && (
                              <a
                                href={m.file.url}
                                download
                                className="inline-flex items-center gap-2 hover:underline"
                              >
                                <FileText className="h-4 w-4" />{" "}
                                {m.file.filename}
                              </a>
                            )}
                            <div className="text-sm">
                              {new Date(m.createdAt).toLocaleString()}
                            </div>
                          </div>
                          {user?._id === m.uploadedBy && (
                            <div className="flex gap-3 mt-2 items-center">
                              <button
                                onClick={() => {
                                  setEditingMessageId(m._id);
                                  setEditText(m.text);
                                }}
                                className="flex text-yellow-600 rounded hover:underline"
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(m._id)}
                                className="flex text-red-600 rounded hover:underline"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
