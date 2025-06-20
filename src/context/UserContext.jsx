// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId) => {
    try {
      const response = await API.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Check for existing token and user data on mount
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        // Set default authorization header
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const parsedUser = JSON.parse(userData);
        
        // Fetch complete user data
        const completeUserData = await fetchUserData(parsedUser.id);
        if (completeUserData) {
          setUser(completeUserData);
          localStorage.setItem("user", JSON.stringify(completeUserData));
        } else {
          setUser(parsedUser);
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  const login = async (userData, token) => {
    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Set default authorization header
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    // Fetch complete user data
    const completeUserData = await fetchUserData(userData.id);
    if (completeUserData) {
      setUser(completeUserData);
      localStorage.setItem("user", JSON.stringify(completeUserData));
    } else {
      setUser(userData);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Remove authorization header
    delete API.defaults.headers.common["Authorization"];
    
    // Update state
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
