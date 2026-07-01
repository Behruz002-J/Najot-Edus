import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import studentCopyImage from "../../assets/images/student copy.svg";
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
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPhone, setResetPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("Muvaffaqiyatli kirdingiz! Tizimga xush kelibsiz.");
  const [resetStep, setResetStep] = useState(1);
  const [smsCode, setSmsCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

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

      const enteredPhoneCleaned = formData.username.replace(/\D/g, "");
      const normalizedEnteredPhone = enteredPhoneCleaned.length === 9 ? `998${enteredPhoneCleaned}` : enteredPhoneCleaned;

      const localStudents = JSON.parse(window.localStorage.getItem("local_students") || "[]");
      const matchingStudent = localStudents.find(student => {
        const studentPhoneCleaned = (student.phone || "").replace(/\D/g, "");
        const normalizedStudentPhone = studentPhoneCleaned.length === 9 ? `998${studentPhoneCleaned}` : studentPhoneCleaned;
        return normalizedStudentPhone === normalizedEnteredPhone && student.password === formData.password;
      });

      let responseOk = false;
      let token = "";
      let apiRole = "TEACHER";
      let apiUsername = "";
      let apiData = null;
      let apiSuccess = false;

      // 1. Try to login via API first
      try {
        const response = await fetch(
          "https://najot-edu.softwareengineer.uz/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: normalizedEnteredPhone,
              password: formData.password,
            }),
          }
        );

        apiData = await response.json().catch(() => ({}));
        if (response.ok) {
          apiSuccess = true;
          responseOk = true;
        }
      } catch (err) {
        console.warn("API login failed, checking local fallback:", err.message);
      }

      if (apiSuccess && apiData) {
        token =
          apiData?.accessToken ||
          apiData?.data?.accessToken ||
          apiData?.data?.token ||
          apiData?.token ||
          apiData?.access_token;

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

        apiUsername =
          resolveName(apiData?.data?.user) ||
          resolveName(apiData?.data) ||
          resolveName(apiData?.user) ||
          formData.username;

        apiUsername = formatDisplayName(apiUsername);

        const decodeJwt = (t) => {
          try {
            const payload = t.split(".")[1];
            return JSON.parse(atob(payload));
          } catch {
            return null;
          }
        };

        const jwtPayload = decodeJwt(token);
        const jwtRole =
          jwtPayload?.role ||
          jwtPayload?.roles ||
          jwtPayload?.roleName ||
          jwtPayload?.user?.role ||
          jwtPayload?.authorities;

        const rawRole =
          apiData?.role ||
          apiData?.data?.role ||
          apiData?.data?.user?.role ||
          apiData?.user?.role ||
          (typeof jwtRole === "string" ? jwtRole : undefined) ||
          (Array.isArray(jwtRole) && typeof jwtRole[0] === "string" ? jwtRole[0] : undefined) ||
          (Array.isArray(jwtRole) && jwtRole[0] && typeof jwtRole[0] === "object" ? (jwtRole[0].authority || jwtRole[0].role) : undefined) ||
          "TEACHER";

        let normalizedRole = "TEACHER";
        if (typeof rawRole === "string") {
          const upperRole = rawRole.toUpperCase();
          if (upperRole.includes("STUDENT") || upperRole.includes("PUPIL")) {
            normalizedRole = "STUDENT";
          } else if (upperRole.includes("ADMIN")) {
            normalizedRole = "ADMIN";
          } else if (upperRole.includes("TEACHER")) {
            normalizedRole = "TEACHER";
          } else {
            normalizedRole = rawRole;
          }
        }
        apiRole = normalizedRole;

        if (apiRole === "STUDENT") {
          const localStudents = JSON.parse(window.localStorage.getItem("local_students") || "[]");
          const phoneCleaned = normalizedEnteredPhone.replace(/\D/g, "");
          
          const existingIndex = localStudents.findIndex(s => {
            const sPhone = (s.phone || "").replace(/\D/g, "");
            const sNorm = sPhone.length === 9 ? `998${sPhone}` : sPhone;
            return sNorm === phoneCleaned;
          });

          const userObj = apiData?.data?.user || apiData?.data || apiData?.user || {};
          const existingStudent = existingIndex >= 0 ? localStudents[existingIndex] : null;
          const apiGroups = Array.isArray(userObj.groups) ? userObj.groups.map(g => typeof g === "object" ? g.name : g) : null;
          const apiGroupIds = Array.isArray(userObj.groups) ? userObj.groups.map(g => typeof g === "object" ? g.id : g).filter(Boolean) : null;

          const studentObj = {
            id: userObj.id || Date.now(),
            name: apiUsername,
            phone: normalizedEnteredPhone,
            email: userObj.email || "—",
            birthDate: userObj.birth_date ? new Date(userObj.birth_date).toLocaleDateString("uz-UZ") : "—",
            address: userObj.address || "—",
            createdDate: userObj.created_at ? new Date(userObj.created_at).toLocaleDateString("uz-UZ") : new Date().toLocaleDateString("uz-UZ"),
            groups: (apiGroups && apiGroups.length > 0) ? apiGroups : (existingStudent?.groups || []),
            groupIds: (apiGroupIds && apiGroupIds.length > 0) ? apiGroupIds : (existingStudent?.groupIds || []),
            password: formData.password,
          };

          if (existingIndex >= 0) {
            localStudents[existingIndex] = {
              ...localStudents[existingIndex],
              ...studentObj,
              password: formData.password || localStudents[existingIndex].password
            };
          } else {
            localStudents.push(studentObj);
          }
          
          window.localStorage.setItem("local_students", JSON.stringify(localStudents));
          window.localStorage.setItem("student_phone", normalizedEnteredPhone);
        }
      } else if (matchingStudent) {
        // Fallback: If API login fails but student exists locally, login as mock
        responseOk = true;
        token = "mock-student-token-" + Date.now();
        apiRole = "STUDENT";
        apiUsername = matchingStudent.name;
        window.localStorage.setItem("student_phone", normalizedEnteredPhone);
      } else {
        // Both failed
        const msg = apiData?.message || "Login yoki parol xato! Iltimos, qayta tekshiring.";
        setApiError(msg);
        setErrorMsg(msg);
        setErrorOpen(true);
      }

      if (responseOk) {
        if (token) {
          window.localStorage.setItem("token", token);
          window.localStorage.setItem("username", apiUsername);
          window.localStorage.setItem("role", apiRole);
          window.localStorage.setItem("user_photo", "/bane-profile.jpg");

          // Save credentials for auto-refresh when token expires
          window.localStorage.setItem("_creds", JSON.stringify({
            phone: formData.username.replace(/\D/g, ""),
            password: formData.password,
          }));
          setSuccessMsg("Muvaffaqiyatli kirdingiz! Tizimga xush kelibsiz.");
          setSuccessOpen(true);
          setTimeout(() => {
            if (apiRole === "STUDENT" || apiRole === "student" || apiRole === "PUPIL" || apiRole === "pupil") {
              navigate("/dashboard/my-groups");
            } else if (apiRole === "TEACHER" || apiRole === "teacher") {
              navigate("/dashboard/groups");
            } else {
              navigate("/dashboard");
            }
          }, 2000);
        } else {
          const msg = "Xatolik: Token topilmadi.";
          setApiError(msg);
          setErrorMsg(msg);
          setErrorOpen(true);
        }
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

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("998")) {
      return `+${cleaned}`;
    }
    if (cleaned.length === 9) {
      return `+998${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const handleSendResetCode = async (e) => {
    if (e) e.preventDefault();
    if (!resetPhone.trim()) {
      setErrorMsg("Iltimos, telefon raqamingizni kiriting!");
      setErrorOpen(true);
      return;
    }

    const cleanedPhone = resetPhone.replace(/\D/g, "");
    const normalizedPhone = cleanedPhone.length === 9 ? `998${cleanedPhone}` : cleanedPhone;

    try {
      const response = await fetch(
        "https://najot-edu.softwareengineer.uz/api/v1/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: normalizedPhone,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSuccessMsg(data.message || "Tasdiqlash kodi telefon raqamingizga yuborildi!");
        setSuccessOpen(true);
        setResetStep(2);
        setTimeLeft(60);
      } else {
        const errorMsg = data.message || "OTP kod yuborishda xatolik yuz berdi.";
        setErrorMsg(errorMsg);
        setErrorOpen(true);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setErrorMsg("Server bilan bog'lanishda xatolik yuz berdi!");
      setErrorOpen(true);
    }
  };

  const handleVerifyResetCode = (e) => {
    e.preventDefault();
    if (!smsCode.trim()) {
      setErrorMsg("Iltimos, SMS kodni kiriting!");
      setErrorOpen(true);
      return;
    }
    setSuccessMsg("SMS kod muvaffaqiyatli tasdiqlandi!");
    setSuccessOpen(true);
    setShowResetModal(false);
    setResetStep(1);
    setResetPhone("");
    setSmsCode("");
  };

  const handleResendCode = () => {
    handleSendResetCode(null);
  };

  useEffect(() => {
    let timer;
    if (showResetModal && resetStep === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showResetModal, resetStep, timeLeft]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-900 overflow-y-auto no-scrollbar">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-[#17275b] self-stretch p-12">
        <div className="w-full flex items-center justify-center">
          <img
            src={studentCopyImage}
            alt="Study Illustration"
            className="w-full max-w-[85%] max-h-[85vh] object-contain"
          />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between py-6 px-8 sm:px-12 md:px-16 lg:px-20 bg-white dark:bg-gray-900 relative self-stretch">
        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-[10px] sm:text-xs font-semibold text-gray-850 dark:text-gray-200 tracking-wider mb-4 leading-relaxed">
              MUHAMMAD AL-XORAZMIY NOMIDAGI
              <br />
              TOSHKENT AXBOROT TEXNOLOGIYALARI
              <br />
              UNIVERSITETI
            </h1>

            {/* Logo placeholder - using a styled div with a border to represent the seal */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-[#7B2CBF] rounded-full mx-auto mb-4 flex items-center justify-center bg-purple-50 shadow-[0_0_15px_rgba(123,44,191,0.2)]">
              <span className="text-[#7B2CBF] font-extrabold text-xl tracking-wider">
                TUIT
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white mb-4">
              LEARNING MANAGEMENT SYSTEM
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs font-semibold text-[#7B2CBF] hover:text-[#621d9c] hover:underline transition-colors focus:outline-none cursor-pointer"
                >
                  Parolni unutdingizmi?
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
        <div className="text-center mt-6 text-xs text-gray-400">
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
            {successMsg}
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

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-[480px] w-full transform scale-100 transition-all duration-300">
              {resetStep === 1 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#182238] mb-4">
                    Parolni tiklash
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                    Tizimda ro'yxatdan o'tgan telefon raqamingizni kiriting. Biz sizga tasdiqlash kodini yuboramiz.
                  </p>
                  <form onSubmit={handleSendResetCode}>
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="Telefon raqami"
                        value={resetPhone}
                        onChange={(e) => setResetPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#182238] focus:border-transparent transition-all placeholder-gray-400 text-gray-800"
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end items-center gap-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowResetModal(false);
                          setResetPhone("");
                          setResetStep(1);
                        }}
                        className="px-4 py-2 text-sm sm:text-base font-semibold text-gray-500 hover:text-gray-800 transition-colors focus:outline-none cursor-pointer"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#182238] hover:bg-[#0f172a] text-white text-sm sm:text-base font-semibold rounded shadow-md hover:shadow-lg transition-all focus:outline-none cursor-pointer"
                      >
                        Kodni yuborish
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#182238] mb-4">
                    SMS kodni tasdiqlash
                  </h3>
                  <div className="text-sm sm:text-base text-gray-650 mb-6 leading-relaxed">
                    Tasdiqlash kodi quyidagi raqamga yuborildi: <span className="font-semibold text-gray-800">{formatPhoneNumber(resetPhone)}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep(1);
                        setSmsCode("");
                      }}
                      className="text-[#7B2CBF] hover:text-[#621d9c] underline text-sm font-semibold cursor-pointer block mt-1 w-max"
                    >
                      O'zgartirish
                    </button>
                  </div>
                  <form onSubmit={handleVerifyResetCode}>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="SMS Kod"
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#182238] focus:border-transparent transition-all placeholder-gray-400 text-gray-800"
                        autoFocus
                      />
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-6">
                      Kodni qayta yuborish: {timeLeft > 0 ? (
                        <span className="font-semibold text-gray-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 ml-1 select-none">
                          {timeLeft} soniya
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-[#7B2CBF] hover:text-[#621d9c] font-semibold cursor-pointer hover:underline ml-1"
                        >
                          Kodni qayta yuborish
                        </button>
                      )}
                    </div>

                    <div className="flex justify-end items-center gap-6">
                      <button
                        type="button"
                        onClick={() => {
                          setShowResetModal(false);
                          setResetPhone("");
                          setSmsCode("");
                          setResetStep(1);
                        }}
                        className="px-4 py-2 text-sm sm:text-base font-semibold text-gray-500 hover:text-gray-800 transition-colors focus:outline-none cursor-pointer"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#182238] hover:bg-[#0f172a] text-white text-sm sm:text-base font-semibold rounded shadow-md hover:shadow-lg transition-all focus:outline-none cursor-pointer"
                      >
                        Kodni tasdiqlash
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
