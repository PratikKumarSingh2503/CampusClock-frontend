import { useEffect, useState } from "react";
import API from "../utils/api";
import { useUser } from "../context/UserContext";
import { toast } from "react-hot-toast";
import {
  Search,
  Upload,
  MessageSquare,
  FileText,
  Users,
  Download,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import "../components/RotatingButton.css";

const CommunityPage = () => {
  const { user } = useUser();
  const [communities, setCommunities] = useState([]);
  const [myCommunity, setMyCommunity] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const fetchCommunities = async () => {
    try {
      const res = await API.get("/communities/all");
      // setCommunities(res.data);
      setCommunities(res.data);

      if (user?.user_role === "teacher" || user?.user_role === "admin") {
        const mine = res.data.find((c) => c.teacherId._id === user._id);
        setMyCommunity(mine || null);
      }
    } catch {
      toast.error("Failed to fetch communities");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id) => {
    try {
      await API.post(`/communities/join/${id}`);
      toast.success("Joined community");
      fetchCommunities();
    } catch {
      toast.error("Failed to join");
    }
  };

  const handleLeave = async (id) => {
    try {
      await API.post(`/communities/leave/${id}`);
      toast.success("Left community");
      fetchCommunities();
    } catch {
      toast.error("Failed to leave");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/community/${id}`);
  };

  const filtered = Array.isArray(communities)
    ? communities.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : []; // const filtered = communities.filter((c) =>
  //   c.name.toLowerCase().includes(search.toLowerCase())
  // );

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
        {user.user_role === "teacher" || user.user_role === "admin" ? (
          <>
            {/* <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Community</h2>
            {myCommunity && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <Users className="inline-block mr-1" />
                {myCommunity?.memberCount || 0} members
              </div>
            )}
          </div> */}

            {myCommunity ? (
              <div className="flex items-center justify-between gap-4">
                <div className="">
                  <h3 className="text-lg font-semibold">{myCommunity.name}</h3>
                  <p className="text-sm mt-1">
                    Click to view your community details
                  </p>
                </div>

                <div className="">
                  <button
                    type="button"
                    className="rotating-button"
                    onClick={() => navigate(`/community/${myCommunity._id}`)}
                  >
                    <span>ENTER</span>
                    <span>DETAILS</span>
                    <span>POST</span>
                    <span>VIEW</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="">No community found.</p>
            )}
          </>
        ) : (
          <>
            <div className="relative mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold">Community</h1>
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search communities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`p-5 py-2 border rounded-lg ${
                  theme === "light" ? "border-dcolor3" : "border-color2"
                }`}
              />
            </div>

            <div className="grid gap-10 md:grid-cols-1 lg:grid-cols-2">
              {filtered.map((c) => {
                const isMember = c.members.some((m) => m._id === user._id);
                return (
                  <div
                    key={c._id}
                    onClick={() => handleCardClick(c._id)}
                    className={`rounded-xl p-6 shadow border cursor-pointer hover:scale-105 transform transition duration-300 ${
                      theme === "light" ? "border-dcolor3" : "border-color2"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{c.name}</h3>
                        <p className="text-sm">
                          Teacher/Admin: {c.teacherId.user_name}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          isMember ? handleLeave(c._id) : handleJoin(c._id);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium  transition-colors ${
                          isMember
                            ? "border border-red text-red-600 hover:bg-red-200"
                            : "border border-green hover:bg-green-300 text-green-600 rounded-lg"
                        }`}
                      >
                        {isMember ? "Leave" : "Join"}
                      </button>
                    </div>

                    {isMember && (
                      <div className="space-y-2 mt-4">
                        <h4 className="font-medium">Recent Messages</h4>
                        {c.messages?.slice(-2).map((m, idx) => (
                          <div
                            key={idx}
                            className={`rounded border p-3 space-y-1 ${
                              theme === "light"
                                ? "bg-color2/50 border-dcolor3"
                                : "bg-dcolor3 border-color2"
                            }`}
                          >
                            {m.text && <p className="text-sm">{m.text}</p>}
                            {m.file && (
                              <a
                                href={m.file.url}
                                download
                                className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                              >
                                <Download className="h-4 w-4" />
                                {m.file.filename}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
