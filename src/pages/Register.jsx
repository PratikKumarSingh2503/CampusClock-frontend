import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
  FaUserShield,
  FaUser,
  FaEnvelope,
  FaIdBadge,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_id: "",
    password: "",
    confirm_password: "",
    user_role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    // Password validation
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Password confirmation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user_email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // User ID validation (alphanumeric)
    const idRegex = /^[a-zA-Z0-9]+$/;
    if (!idRegex.test(formData.user_id)) {
      setError("User ID must contain only letters and numbers");
      return false;
    }

    // Name validation
    if (formData.user_name.length < 2) {
      setError("Name must be at least 2 characters long");
      return false;
    }

    return true;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", formData);
      alert("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12">
        <h1 className="md:hidden text-[32px] font-extrabold font-heading1 text-color3">
          CampusClock
        </h1>
        <div className="text-[24px] text-center mt-2">
          Create your account.
        </div>
        <p className="text-[16px] text-center mt-2 font-headingp3">
          Access all that StockSync has to offer with a single <br /> account.
          All fields are required.
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          className="w-full max-w-2xs mt-6 text-[14px] font-headingp3"
          onSubmit={handleSubmit}
        >
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="user_name"
              placeholder="Full Name"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>
          <div className="relative mb-4">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="user_email"
              placeholder="Email"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative mb-4">
            <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="user_id"
              placeholder="User ID (letters and numbers only)"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
              pattern="[a-zA-Z0-9]+"
            />
          </div>
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
              minLength={6}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative mb-4">
            <FaUserShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              name="user_role"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-1 text-[20px] text-white font-bold rounded-full shadow-md bg-color2 hover:bg-hovercolor2"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="absolute text-[15px] font-semibold mt-4 left-5 md:left-20 bottom-5 font-headingp2">
          Don't have an account?{" "}
          <Link
            to="/login"
            className="text-color3 cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
      <div className="hidden lg:flex w-1/2 bg-color3 justify-center items-center p-10 ">
        <div className="text-left px-20">
          <h1 className="md:text-[64px] font-extrabold font-heading1">
            CampusClock
          </h1>
          <p className="mt-3 text-[24px] font-semibold font-headingp2">
            Make Attendance in <span className="">2 minutes</span>
          </p>
          <p className="mt-3 text-[16px] font-headingp3">
            CampusClock is your one-stop solution for professional attendance
            marking. Create and edit forms with ease, no prior knowledge
            required.
          </p>
        </div>
      </div>
    </div>
  );
}
