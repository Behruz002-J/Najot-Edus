import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import studentCopyImage from "../assets/images/student copy.svg";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "998975661099",
    password: "Benazir99!",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError("");

    try {
      setLoading(true);

      const response = await fetch(
        "https://najot-edu.softwareengineer.uz/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formData.username.replace(/\D/g, ""),
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        const token =
          data?.accessToken ||
          data?.data?.accessToken ||
          data?.data?.token ||
          data?.token ||
          data?.access_token;

        const resolveName = (obj) => {
          if (!obj || typeof obj !== "object") return undefined;
          return (
            obj.full_name ||
            obj.fullName ||
            obj.name ||
            (obj.first_name && obj.last_name
              ? `${obj.first_name} ${obj.last_name}`
              : undefined) ||
            (obj.firstName && obj.lastName
              ? `${obj.firstName} ${obj.lastName}`
              : undefined) ||
            obj.first_name ||
            obj.firstName
          );
        };

        const formatDisplayName = (name) => {
          if (!name) return "Behruz Jumanov";
          const clean = name.replace(/\D/g, "");
          if (clean === "998975661099") {
            return "Behruz Jumanov";
          }
          if (/^\+?[0-9\s\-()]{9,}$/.test(name.trim())) {
            return "Behruz Jumanov";
          }
          return name;
        };

        let apiUsername =
          resolveName(data?.data?.user) ||
          resolveName(data?.data) ||
          resolveName(data?.user) ||
          formData.username;



        apiUsername = formatDisplayName(apiUsername);

        if (token) {
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("username", apiUsername);
          
          window.localStorage.setItem("user_photo", "/bane-profile.jpg");

          // Save credentials for auto-refresh when token expires
          window.localStorage.setItem("_creds", JSON.stringify({
            phone: formData.username.replace(/\D/g, ""),
            password: formData.password,
          }));
          setSuccessOpen(true);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          const msg = "Xatolik: Token topilmadi.";
          setApiError(msg);
          setErrorMsg(msg);
          setErrorOpen(true);
        }
      } else {
        const msg = data?.message || "Login yoki parol xato! Iltimos, qayta tekshiring.";
        setApiError(msg);
        setErrorMsg(msg);
        setErrorOpen(true);
      }
    } catch (err) {
      const msg = "Xatolik yuz berdi! Server bilan bog'lanish o'rnatilmadi.";
      setApiError(msg);
      setErrorMsg(msg);
      setErrorOpen(true);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#17275b]">
        <div className="w-full h-full p-12 flex items-center justify-center">
          <img
            src={studentCopyImage}
            alt="Study Illustration"
            className="w-full h-full max-w-[92%] max-h-[92%] object-contain"
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-24 bg-white relative">
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[10px] sm:text-xs font-semibold text-gray-800 tracking-wider mb-6 leading-relaxed">
              MUHAMMAD AL-XORAZMIY NOMIDAGI
              <br />
              TOSHKENT AXBOROT TEXNOLOGIYALARI
              <br />
              UNIVERSITETI
            </h1>

            {/* Logo placeholder - using a styled div with a border to represent the seal */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#7B2CBF] rounded-full mx-auto mb-6 flex items-center justify-center bg-purple-50 shadow-[0_0_15px_rgba(123,44,191,0.2)]">
              <span className="text-[#7B2CBF] font-extrabold text-2xl tracking-wider">
                TUIT
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-8">
              LEARNING MANAGEMENT SYSTEM
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded animate-pulse text-center font-medium">
                {apiError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon raqam
              </label>
              {errors.username && (
                <p className="text-red-500 text-xs mb-1 animate-pulse">
                  {errors.username}
                </p>
              )}
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="90 123 45 67"
                className={`w-full px-4 py-3 border ${errors.username ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-[#7B2CBF] focus:border-transparent transition-colors`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parol
              </label>
              {errors.password && (
                <p className="text-red-500 text-xs mb-1 animate-pulse">
                  {errors.password}
                </p>
              )}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Parolni kiriting"
                  className={`w-full px-4 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#0f172a] text-white py-3 px-4 rounded-lg hover:bg-[#1e293b] hover:shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb] font-semibold flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Yuklanmoqda...
                </>
              ) : (
                "Kirish"
              )}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <div className="text-center mt-12 text-xs text-gray-500">
          Copyright © 2021 of Tashkent University of Information Technologies
        </div>

        {/* Success Snackbar */}
        <Snackbar
          open={successOpen}
          autoHideDuration={2000}
          onClose={() => setSuccessOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSuccessOpen(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%", fontSize: "1rem", fontWeight: "bold" }}
          >
            Muvaffaqiyatli kirdingiz! Tizimga xush kelibsiz.
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={errorOpen}
          autoHideDuration={4000}
          onClose={() => setErrorOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setErrorOpen(false)}
            severity="error"
            variant="filled"
            sx={{ width: "100%", fontSize: "1rem", fontWeight: "bold" }}
          >
            {errorMsg}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
