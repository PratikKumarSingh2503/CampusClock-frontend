import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { useUser } from "../context/UserContext";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({ emailOrId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      await login(res.data.user, res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <div className="text-[24px] text-center mt-2">Login to your account</div>
        <p className="text-[16px] text-center mt-2 font-headingp3">
          Access all that CampusClock has to offer with a single <br /> account.
          All fields are required.
        </p>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xs mt-6 text-[14px] font-headingp3"
        >
          <div className="relative mb-4">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="emailOrId"
              placeholder="Email or User ID"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="relative mb-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="pl-10 w-full py-2 border rounded-xl shadow-sm"
              onChange={handleChange}
              required
              disabled={loading}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-1 text-[20px] text-white font-bold rounded-full shadow-md bg-color2 hover:bg-hovercolor2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="absolute text-[15px] font-semibold mt-4 left-5 md:left-20 bottom-5 font-headingp2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-color3 cursor-pointer hover:underline"
          >
            Register
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
