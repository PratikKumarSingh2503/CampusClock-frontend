import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { Camera, Loader2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user: contextUser, setUser } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    password: "",
    confirm_password: "",
    profilePic: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/me");
        setForm({
          user_name: res.data.user_name,
          password: "",
          confirm_password: "",
          profilePic: res.data.profilePic || "",
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (form.user_name.length < 2) {
      newErrors.user_name = "Name must be at least 2 characters long";
    }

    if (form.password) {
      if (form.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
      if (form.password !== form.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        user_name: form.user_name,
        ...(form.password && { password: form.password }),
      };

      const res = await API.put("/user/me", updateData);

      // Update context with new user data
      setUser((prev) => ({
        ...prev,
        user_name: res.data.user_name,
      }));

      toast.success("Profile updated successfully");
      setEdit(false);
      setForm((prev) => ({
        ...prev,
        password: "",
        confirm_password: "",
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await API.post("/user/upload", formData);
      setForm((prev) => ({ ...prev, profilePic: res.data.url }));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        className={`rounded-xl shadow-xl p-6 ${
          theme === "light"
            ? "bg-color1 border-dcolor3" : "bg-dcolor3 border-color2" 
        }`}
      >
        <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={
                form.profilePic ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${contextUser?.user_name}`
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-700 shadow-lg"
            />
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
          {uploading && (
            <div className="mt-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="user_name"
              value={form.user_name}
              onChange={handleChange}
              disabled={!edit}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.user_name ? "border-red-500" : ""
              }`}
            />
            {errors.user_name && (
              <p className="mt-1 text-sm text-red-500">{errors.user_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 ">Email</label>
            <input
              type="email"
              value={contextUser?.user_email}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-color2/50 opacity-75 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <input
              type="text"
              value={contextUser?.user_id}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-color2/50 opacity-75 cursor-not-allowed"
            />
          </div>

          {edit && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.confirm_password ? "border-red-500" : ""
                  }`}
                />
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          {!edit ? (
            <button
              onClick={() => setEdit(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEdit(false);
                  setErrors({});
                  setForm((prev) => ({
                    ...prev,
                    password: "",
                    confirm_password: "",
                  }));
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
