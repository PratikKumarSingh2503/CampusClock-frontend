import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Calendar,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ onCollapse }) => {
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (onCollapse) onCollapse(isCollapsed);
  }, [isCollapsed, onCollapse]);

  const menuItems = [
    {
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      path: "/classroom",
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Classroom",
    },
    {
      path: "/community",
      icon: <Users className="h-5 w-5" />,
      label: "Community",
    },
    {
      path: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      label: "Calendar",
    },
    {
      path: "/profile",
      icon: <UserCircle className="h-5 w-5" />,
      label: "Profile",
    },
  ];

  const adminMenuItems = [
    {
      path: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      label: "Manage Users",
    },
    {
      path: "/admin/classrooms",
      icon: <GraduationCap className="h-5 w-5" />,
      label: "Manage Classrooms",
    },
    {
      path: "/admin/communities",
      icon: <UserCircle className="h-5 w-5" />,
      label: "Manage Communities",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full border-r transition-all duration-300 ease-in-out z-51 ${
        theme === "light"
          ? "bg-color1 border-dcolor3"
          : "bg-dcolor3 border-color1"
      } ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-6 border-2 rounded-full p-1.5 shadow-md hover:bg-color2 transition-colors ${
            theme === "light"
              ? "bg-color1 border-dcolor3"
              : "bg-dcolor3 border-color2"
          }`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* User Profile Section */}
        <div
          className={`p-4 border-b ${
            theme === "light" ? "border-dcolor3" : "border-color2"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  user?.profilePic ||
                  "https://ui-avatars.com/api/?name=" + user?.user_name
                }
                alt={user?.user_name}
                className="h-10 w-10 rounded-full object-cover border-2 border-primary-500"
              />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_name}
                </p>
                <p className="text-xs truncate capitalize">{user?.user_role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-color2 font-semibold"
                      : "hover:bg-color2/50"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
            {/* Admin-only options */}
            {user?.user_role === 'admin' && adminMenuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-color2 font-semibold"
                      : "hover:bg-color2/50"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div
          className={`p-4 border-t ${
            theme === "light" ? "border-dcolor3" : "border-color2"
          }`}
        >
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium hover:bg-color2/50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
