import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import API from "../utils/api";
import { toast } from "react-hot-toast";
import {
  Users,
  BookOpen,
  MessageSquare,
  Calendar,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useUser();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    attended: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [user]);

  // Fetch classrooms and attendance stats
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch classrooms for user
      const res = await API.get("/classrooms/my");
      setClassrooms(res.data);

      // If student, aggregate attendance across all classrooms
      if (user?.user_role === "student") {
        let total = 0;
        let attended = 0;
        for (const classroom of res.data) {
          try {
            const perf = await API.get(`/attendance/score/${classroom._id}`);
            total += perf.data.totalSessions;
            attended += perf.data.attendedSessions;
          } catch {
            // Ignore errors for individual classrooms
          }
        }
        setAttendanceStats({ total, attended });
      }
    } catch {
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-2">
            Welcome back, {user?.user_name || user?.name}!
          </h1>
          <p className="text-gray-500">
            Here's an overview of your{" "}
            {user?.user_role === "teacher" ? "teaching" : "learning"} journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Classrooms Card */}
          <div
            className={`rounded-xl p-6 shadow border cursor-pointer hover:scale-105 transform transition duration-300 ${
              theme === "light" ? "border-dcolor3" : "border-color2"
            }`}
            onClick={() => navigate("/classroom")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-semibold">
                {classrooms.length}
              </span>
            </div>
            <h3 className="text-lg font-medium mb-1">Classrooms</h3>
            <p className="text-gray-500">
              {user?.user_role === "teacher"
                ? "Your created classes"
                : "Joined classes"}
            </p>
          </div>

          {/* Attendance Card (Student only) */}
          {/* {user?.user_role === "student" && (
            <div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer"
              onClick={() => navigate("/classroom")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-2xl font-semibold">
                  {attendanceStats.total > 0
                    ? Math.round(
                        (attendanceStats.attended / attendanceStats.total) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <h3 className="text-lg font-medium mb-1">Attendance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Overall presence
              </p>
            </div>
          )} */}

          {/* Performance Card (Student only) */}
          {user?.user_role === "student" && (
            <div
              className={`rounded-xl p-6 shadow border cursor-pointer hover:scale-105 transform transition duration-300 ${
                theme === "light" ? "border-dcolor3" : "border-color2"
              }`}
              onClick={() => navigate("/classroom")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <span className="text-2xl font-semibold">
                  {attendanceStats.total > 0
                    ? Math.round(
                        (attendanceStats.attended / attendanceStats.total) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <h3 className="text-lg font-medium mb-1">Performance</h3>
              <p className="text-gray-500">Attendance performance</p>
            </div>
          )}

          {/* Quick Link to Communities (if desired, can be hidden if not implemented) */}
          <div
            className={`rounded-xl p-6 shadow border cursor-pointer hover:scale-105 transform transition duration-300 ${
              theme === "light" ? "border-dcolor3" : "border-color2"
            }`}
            onClick={() => navigate("/community")}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-semibold">-</span>
              <span className="text-2xl font-semibold">
                {/* {community.length} */}
              </span>
            </div>
            <h3 className="text-lg font-medium mb-1">Communities</h3>
            <p className="text-gray-600 dark:text-gray-400">Explore groups</p>
          </div>
        </div>

        {/* Recent Activities and Upcoming Events - Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div
            className={`rounded-xl p-6 shadow border ${
              theme === "light" ? "border-dcolor3" : "border-color2"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="text-gray-500">No recent activities to show.</div>
          </div>

          {/* Upcoming Events */}
          <div
            className={`rounded-xl p-6 shadow border ${
              theme === "light" ? "border-dcolor3" : "border-color2"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            <div className="text-gray-500">No upcoming events to show.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
