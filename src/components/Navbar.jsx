import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationBell from "./NotificationBell";
import { Sun, Moon, ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      className={`border-b transition-all duration-300 ease-in-out z-50 ${
        theme === "light"
          ? "bg-color1 border-dcolor3"
          : "bg-dcolor3 border-color2"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-color3">CampusClock</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-color2 hover:bg-color2 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* User Menu */}
            <div className="relative gap-1 px-1 flex border border-color2 rounded-lg transition-colors">
              <div className="p-1 border-r-1 border-color2">
                <img
                  src={
                    user?.profilePic ||
                    `https://ui-avatars.com/api/?name=${user?.user_name}`
                  }
                  alt={user?.user_name}
                  className="h-8 w-8 rounded-full object-cover "
                />
              </div>
              {/* <span className="hidden sm:inline">{user?.user_name}</span> */}
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1 my-2 text-sm font-medium shadow-lg hover:bg-color2 rounded-lg transition-colors"
              >
                <ChevronDown className="h-4 w-4" />
              </button>

              {showUserMenu && (
                <div
                  className={`absolute top-full right-0 mt-3 w-48 rounded-lg shadow-lg border py-1 z-50 ${
                    theme === "light"
                      ? "bg-color1 border-dcolor3" : "bg-gray-700 border-color1"
                      
                  }`}
                >
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navigate to profile
                      navigate("/profile");
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-color2/50"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-color2/50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
