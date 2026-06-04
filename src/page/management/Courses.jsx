import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";

// ─── Toast Component ────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[320px] max-w-sm
            transition-all duration-300 animate-[slideInRight_0.3s_ease-out]
            ${
              t.type === "success"
                ? "bg-white dark:bg-gray-800 border-green-100 dark:border-green-900"
                : t.type === "error"
                  ? "bg-white dark:bg-gray-800 border-red-100 dark:border-red-900"
                  : "bg-white dark:bg-gray-800 border-yellow-100 dark:border-yellow-900"
            }
          `}
        >
          {/* Icon */}
          <div
            className={`shrink-0 mt-0.5 ${
              t.type === "success"
                ? "text-green-500"
                : t.type === "error"
                  ? "text-red-500"
                  : "text-yellow-500"
            }`}
          >
            {t.type === "success" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {t.type === "error" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {t.type === "warning" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            )}
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-gray-900 dark:text-white">
              {t.title}
            </p>
            {t.desc && (
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                {t.desc}
              </p>
            )}
          </div>

          {/* Close */}
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton loader card ────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#EEF4FF] dark:bg-gray-700 rounded-[32px] p-8 flex flex-col gap-6 border border-blue-50/50 dark:border-gray-600 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-lg w-1/2" />
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-xl w-24" />
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-xl w-20" />
        <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded-xl w-28" />
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    months: "",
    price: "",
  });
  const [toasts, setToasts] = useState([]);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback((type, title, desc = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, desc }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4500,
    );
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch courses ─────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/courses");
      const data = res.data;
      // API turli formatda qaytarishi mumkin
      if (Array.isArray(data)) {
        setCourses(data);
      } else if (Array.isArray(data?.data)) {
        setCourses(data.data);
      } else {
        setCourses([]);
      }
    } catch (err) {
      addToast(
        "error",
        "Kurslarni yuklashda xatolik",
        err?.response?.data?.message || `Server bilan bog'lanib bo'lmadi.`,
      );
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // ── Open Add modal ────────────────────────────────────────────────────────
  const handleAdd = () => {
    setEditingCourse(null);
    setForm({ name: "", description: "", duration: "", months: "", price: "" });
    setShowModal(true);
  };

  // ── Edit: supported via PATCH ─────────────────────────────────────────────
  const handleEdit = (course) => {
    setEditingCourse(course);
    setForm({
      name: course.name || "",
      description: course.description || "",
      duration: course.duration_hours || course.duration || "",
      months: course.duration_month || "",
      price: course.price || "",
    });
    setShowModal(true);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = (course) => {
    setCourseToDelete(course);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/courses/${courseToDelete.id}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete.id));
      addToast("success", "Kurs o'chirildi!", `"${courseToDelete.name}" muvaffaqiyatli o'chirildi.`);
      setCourseToDelete(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        `Server xatosi: ${err?.response?.status || "Noma'lum"}`;
      addToast("error", "O'chirishda xatolik", msg);
      setCourseToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteCourse = () => {
    setCourseToDelete(null);
  };

  // ── Save (POST/PATCH) course ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration || !form.months) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration_hours: Number(form.duration),
        duration_month: Number(form.months),
      };
      
      if (editingCourse) {
        // Edit mode: PATCH /courses/:id
        const res = await axiosClient.patch(`/courses/${editingCourse.id}`, payload);
        if (res.status === 200 || res.status === 201 || res.data?.success) {
          addToast(
            "success",
            "Kurs muvaffaqiyatli tahrirlandi!",
            `"${form.name}" kursi o'zgartirildi.`,
          );
          setShowModal(false);
          setEditingCourse(null);
          setForm({
            name: "",
            description: "",
            duration: "",
            months: "",
            price: "",
          });
          await fetchCourses();
        }
      } else {
        // Add mode: POST /courses
        const res = await axiosClient.post("/courses", payload);
        if (res.status === 200 || res.status === 201 || res.data?.success) {
          addToast(
            "success",
            "Kurs muvaffaqiyatli qo'shildi!",
            `"${form.name}" kursi bazaga saqlandi.`,
          );
          setShowModal(false);
          setForm({
            name: "",
            description: "",
            duration: "",
            months: "",
            price: "",
          });
          await fetchCourses();
        }
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        `Server xatosi: ${err?.response?.status || "Noma'lum"}. Qayta urinib ko'ring.`;
      addToast("error", "Saqlashda xatolik", msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Price formatter ───────────────────────────────────────────────────────
  const formatPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return price;
    return num.toLocaleString("uz-UZ") + ` so'm`;
  };

  return (
    <div className="p-2">
      {/* Toast container */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Kurslar
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Jami:{" "}
            <span className="font-bold text-[#7C3AED]">{courses.length}</span>{" "}
            ta kurs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/management/archive"
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-[15px] font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4 2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Arxiv
          </Link>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] text-white text-[15px] font-bold rounded-2xl hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-100 dark:shadow-none active:scale-95"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Kurs qo'shish
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {/* Courses Grid */}
      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-gray-400">
          <svg
            className="w-16 h-16 mb-4 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-lg font-semibold">Kurslar mavjud emas</p>
          <p className="text-sm mt-1">Birinchi kursni qo'shing!</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="bg-[#EEF4FF] dark:bg-gray-700 rounded-[20px] p-5 flex flex-col gap-4 relative group border border-blue-50/50 dark:border-gray-600 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Header: Title with status and Actions */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 pr-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[20px] font-bold text-gray-900 dark:text-white leading-none line-clamp-1">
                      {course.name || (
                        <span className="italic text-gray-400">Nomsiz</span>
                      )}
                    </h3>
                    {course.status === "active" && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full border border-green-100 dark:border-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                        Faol
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium line-clamp-2">
                    {course.description || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDelete(course)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="O'chirish (hozircha qo'llab-quvvatlanmaydi)"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    title="Tahrirlash"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-between gap-1.5 mt-2 w-full">
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-[11px] font-bold text-gray-900 dark:text-white shadow-sm border border-gray-50/50 dark:border-gray-600 flex items-center gap-1 shrink-0">
                  <svg
                    className="w-3 h-3 text-[#7C3AED]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {course.duration_hours} soat
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-[11px] font-bold text-gray-900 dark:text-white shadow-sm border border-gray-50/50 dark:border-gray-600 flex items-center gap-1 shrink-0">
                  <svg
                    className="w-3 h-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {course.duration_month} oy
                </div>
                <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded-lg text-[11px] font-bold text-green-700 dark:text-green-400 shadow-sm border border-gray-50/50 dark:border-gray-600 flex items-center gap-1 shrink-0">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formatPrice(course.price)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Right Side Drawer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 z-[80] bg-black/70 transition-opacity"
            onClick={() => !saving && setShowModal(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-[90] w-full max-w-[450px] bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
                    {editingCourse ? "Kursni tahrirlash" : "Kurs qo'shish"}
                  </h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">
                    {editingCourse ? "Kurs ma'lumotlarini o'zgartiring." : "Yangi kurs ma'lumotlarini kiriting."}
                  </p>
                </div>
                <button
                  onClick={() => !saving && setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">
                    Nomi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Kurs nomini kiriting..."
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Duration hours */}
                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">
                    Dars davomiyligi (soat){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Masalan: 2"
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: e.target.value }))
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Duration months */}
                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">
                    Kurs davomiyligi (oylarda){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    placeholder="Masalan: 8"
                    value={form.months}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, months: e.target.value }))
                    }
                    className="w-full border border-blue-500 dark:border-blue-500 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">
                    Narx (so'm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="1500000"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">
                    Tavsif
                  </label>
                  <textarea
                    placeholder="Kurs haqida qisqacha ma'lumot..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows="3"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !form.name ||
                  !form.price ||
                  !form.duration ||
                  !form.months
                }
                className="px-8 py-2.5 rounded-xl bg-[#6B21A8] text-white text-[14px] font-bold hover:bg-[#581C87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saqlanmoqda...
                  </>
                ) : (
                  "Saqlash"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDeleteCourse}
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Kursni o'chirish
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Rostdan ham o'chirishni hohlaysizmi?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDeleteCourse}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={confirmDeleteCourse}
                disabled={isDeleting}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    O'chirilmoqda...
                  </>
                ) : "Ha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
