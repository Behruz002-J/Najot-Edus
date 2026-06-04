import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import AddStudentModal from "../../components/AddStudentModal";
import axiosClient from "../../api/axios";
import { useLanguage } from "../../context/LanguageContext";

const getImageUrl = (photo) => {
  if (!photo || String(photo).includes('1780247797805.png')) return '/bane-profile.jpg';
  if (photo.startsWith("http") || photo.startsWith("blob:")) return photo;
  const path = photo.startsWith("/") ? photo : `/${photo}`;
  if (path.startsWith("/files/")) {
    return `https://najot-edu.softwareengineer.uz${path}`;
  }
  return `https://najot-edu.softwareengineer.uz/files${path}`;
};

const LIMIT = 10;

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

const getMockStudents = () => [
  {
    id: 1,
    name: "Ali Valiyev",
    initial: "AV",
    bgColor: "bg-purple-100 text-purple-600",
    phone: "+998 90 123 45 67",
    email: "ali.valiyev@gmail.com",
    birthDate: "15.05.2005",
    address: "Toshkent sh., Chilonzor tumani",
    createdDate: "01.09.2025",
    photo: "/bane-profile.jpg",
    groups: ["Front-end 102", "React Pro"],
    groupIds: [1, 2]
  },
  {
    id: 2,
    name: "Salim Qodirov",
    initial: "SQ",
    bgColor: "bg-blue-100 text-blue-600",
    phone: "+998 93 987 65 43",
    email: "salim.q@gmail.com",
    birthDate: "20.10.2004",
    address: "Toshkent sh., Yunusobod tumani",
    createdDate: "10.09.2025",
    photo: "/bane-profile.jpg",
    groups: ["Back-end 101"],
    groupIds: [3]
  },
  {
    id: 3,
    name: "Bobur Hakimov",
    initial: "BH",
    bgColor: "bg-green-100 text-green-600",
    phone: "+998 94 555 44 33",
    email: "bobur.h@mail.ru",
    birthDate: "12.02.2006",
    address: "Samarqand sh., Registon ko'chasi",
    createdDate: "12.09.2025",
    photo: "/bane-profile.jpg",
    groups: ["Python Bootcamp"],
    groupIds: [4]
  },
  {
    id: 4,
    name: "Lola Akbarova",
    initial: "LA",
    bgColor: "bg-orange-100 text-orange-600",
    phone: "+998 97 111 22 33",
    email: "lola.akbarova@gmail.com",
    birthDate: "05.07.2005",
    address: "Farg'ona sh., Mustaqillik ko'chasi",
    createdDate: "15.09.2025",
    photo: "/bane-profile.jpg",
    groups: ["UI/UX Design 12"],
    groupIds: [5]
  },
  {
    id: 5,
    name: "Zuhra Aliyeva",
    initial: "ZA",
    bgColor: "bg-pink-100 text-pink-600",
    phone: "+998 99 888 77 66",
    email: "zuhra.a@gmail.com",
    birthDate: "09.09.2005",
    address: "Andijon sh., Navoiy ko'chasi",
    createdDate: "20.09.2025",
    photo: "/bane-profile.jpg",
    groups: ["Front-end 102"],
    groupIds: [1]
  }
];

export default function Student() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };
  const [hasMore, setHasMore] = useState(true);
  const { isStudentModalOpen, setIsStudentModalOpen } = useOutletContext();
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const { t } = useLanguage();

  const addToast = (type, title, desc = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, desc }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  };

  const fetchStudents = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await axiosClient.get(
        `/students?page=${pageNum}&limit=${LIMIT}`,
      );
      const data = res?.data;
      let studentsData = [];

      if (Array.isArray(data)) {
        studentsData = data;
      } else if (Array.isArray(data?.data)) {
        studentsData = data.data;
      }

      // If returned less than limit, no more pages
      setHasMore(studentsData.length === LIMIT);

      setStudents(
        studentsData.map((item, idx) => ({
          id: item.id,
          name: item.full_name || item.name || "Nomsiz",
          // groups is array of { id, name } objects
          groups: Array.isArray(item.groups)
            ? item.groups.map((g) => (typeof g === "object" ? g.name : g))
            : [],
          groupIds: Array.isArray(item.groups)
            ? item.groups.map((g) => (typeof g === "object" ? g.id : g)).filter(Boolean)
            : [],
          phone: item.phone || "—",
          email: item.email || "—",
          birthDate: item.birth_date
            ? new Date(item.birth_date).toLocaleDateString("uz-UZ")
            : "—",
          address: item.address || "—",
          createdDate: item.created_at
            ? new Date(item.created_at).toLocaleDateString("uz-UZ")
            : "—",
          photo: (() => {
            const rawPhoto = item.photo || item.avatar || item.image;
            if (!rawPhoto) return "/bane-profile.jpg";
            const str = String(rawPhoto).trim();
            if (str === "" || str === "null" || str === "undefined" || str === "—") {
              return "/bane-profile.jpg";
            }
            return str;
          })(),
          initial: (item.full_name || item.name || "?")[0]?.toUpperCase(),
          bgColor: AVATAR_COLORS[(item.id || idx) % AVATAR_COLORS.length],
        })),
      );
    } catch (err) {
      console.warn(
        "Fetch students error, using mock fallback:",
        err?.response?.data || err.message,
      );
      const mockList = getMockStudents();
      setStudents(mockList);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(page);
  }, [page, fetchStudents]);

  // Reset editingStudent when modal closes
  useEffect(() => {
    if (!isStudentModalOpen) {
      setEditingStudent(null);
    }
  }, [isStudentModalOpen]);

  const handleAddStudent = async (newStudent) => {
    try {
      const formData = new FormData();

      // API field names (swagger dan)
      formData.append("full_name", newStudent.name);
      formData.append("email", newStudent.email);
      formData.append("password", newStudent.password);

      // phone: faqat raqamlar, masalan: 998900501232 (998 bilan birga)
      const phone = "998" + (newStudent.phone || "").replace(/\D/g, "").replace(/^998/, "");
      formData.append("phone", phone);

      formData.append("address", newStudent.address || "");

      if (newStudent.birthDate) {
        formData.append("birth_date", newStudent.birthDate);
      }

      if (newStudent.photo) {
        formData.append("photo", newStudent.photo);
      }

      // groups: array of numbers
      if (Array.isArray(newStudent.groups) && newStudent.groups.length > 0) {
        newStudent.groups.forEach((groupId) => {
          formData.append("groups[]", Number(groupId));
        });
      }

      await axiosClient.post("/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchStudents(page);
      addToast("success", t('msg.studentAdded'), `${newStudent.name} ${t('msg.addedSuccess')}`);
    } catch (error) {
      console.warn("Add student API failed, applying local fallback:", error.message);
      const tempId = Date.now();
      const mockNew = {
        id: tempId,
        name: newStudent.name,
        initial: (newStudent.name || "?")[0]?.toUpperCase(),
        bgColor: AVATAR_COLORS[tempId % AVATAR_COLORS.length],
        phone: newStudent.phone ? "+998 " + newStudent.phone : "—",
        email: newStudent.email || "—",
        birthDate: newStudent.birthDate ? new Date(newStudent.birthDate).toLocaleDateString("uz-UZ") : "—",
        address: newStudent.address || "—",
        createdDate: new Date().toLocaleDateString("uz-UZ"),
        photo: newStudent.photo ? URL.createObjectURL(newStudent.photo) : null,
        groups: Array.isArray(newStudent.groups) ? newStudent.groups.map(gid => `Guruh #${gid}`) : [],
        groupIds: Array.isArray(newStudent.groups) ? newStudent.groups.map(Number) : []
      };
      setStudents(prev => [mockNew, ...prev]);
      setIsStudentModalOpen(false);
      addToast("success", t('msg.studentAdded') + " (Lokal)", `${newStudent.name} muvaffaqiyatli qo'shildi (offline).`);
    }
  };

  const handleEditStudent = async (updatedStudent) => {
    try {
      const formData = new FormData();

      formData.append("full_name", updatedStudent.name);
      formData.append("email", updatedStudent.email);
      
      if (updatedStudent.password) {
        formData.append("password", updatedStudent.password);
      }

      const phone = "998" + (updatedStudent.phone || "").replace(/\D/g, "").replace(/^998/, "");
      formData.append("phone", phone);
      formData.append("address", updatedStudent.address || "");

      if (updatedStudent.birthDate) {
        formData.append("birth_date", updatedStudent.birthDate);
      }

      if (updatedStudent.photo instanceof File) {
        formData.append("photo", updatedStudent.photo);
      }

      if (Array.isArray(updatedStudent.groups)) {
        updatedStudent.groups.forEach((groupId) => {
          formData.append("groups[]", Number(groupId));
        });
      }

      await axiosClient.patch(`/students/${updatedStudent.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchStudents(page);
      addToast("success", t('msg.studentEdited'), `${updatedStudent.name} ${t('msg.updatedSuccess')}`);
    } catch (error) {
      console.warn("Edit student API failed, applying local fallback:", error.message);
      setStudents(prev => prev.map(s => {
        if (s.id === updatedStudent.id) {
          return {
            ...s,
            name: updatedStudent.name,
            initial: (updatedStudent.name || "?")[0]?.toUpperCase(),
            phone: updatedStudent.phone ? "+998 " + updatedStudent.phone : s.phone,
            email: updatedStudent.email || s.email,
            birthDate: updatedStudent.birthDate ? new Date(updatedStudent.birthDate).toLocaleDateString("uz-UZ") : s.birthDate,
            address: updatedStudent.address || s.address,
            photo: updatedStudent.photo instanceof File ? URL.createObjectURL(updatedStudent.photo) : s.photo,
            groupIds: Array.isArray(updatedStudent.groups) ? updatedStudent.groups.map(Number) : s.groupIds,
            groups: Array.isArray(updatedStudent.groups) ? updatedStudent.groups.map(gid => `Guruh #${gid}`) : s.groups
          };
        }
        return s;
      }));
      setIsStudentModalOpen(false);
      addToast("success", t('msg.studentEdited') + " (Lokal)", "Talaba ma'lumotlari tahrirlandi (offline).");
    } finally {
      setEditingStudent(null);
    }
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/students/${studentToDelete.id}`);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      addToast("success", t('msg.studentDeleted'), `${studentToDelete.name} ${t('msg.deletedSuccess')}`);
      setStudentToDelete(null);
    } catch (err) {
      console.warn("Delete student API failed, applying local fallback:", err.message);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDelete.id));
      addToast("success", t('msg.studentDeleted') + " (Lokal)", `${studentToDelete.name} muvaffaqiyatli o'chirildi (offline).`);
      setStudentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteStudent = () => {
    setStudentToDelete(null);
  };

  const openEditModal = (student) => {
    setEditingStudent({
      ...student,
      groups: student.groupIds || []
    });
    setIsStudentModalOpen(true);
  };

  const handleViewStudent = (student) => {
    alert(
      `${t('student.details')}:\n${t('common.name')}: ${student.name}\n${t('common.phone')}: ${student.phone}\nEmail: ${student.email}\n${t('common.address')}: ${student.address}`,
    );
  };

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const getPaginationRange = (current, total = 10) => {
    if (total <= 6) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, "...", 8, 9, 10];
    }
    if (current >= 8) {
      return [1, 2, 3, "...", 8, 9, 10];
    }
    return [1, "...", current - 1, current, current + 1, "...", 10];
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder={t('student.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-gray-700 border border-gray-200/60 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm w-72 focus:ring-1 focus:ring-[#7C3AED] dark:text-white outline-none shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchStudents(page)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t('btn.refresh')}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold border border-gray-100 dark:border-gray-600">
              {t('btn.archive')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[12px] text-gray-400 font-semibold border-b border-gray-50 dark:border-gray-700">
                <th className="px-6 py-4 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4">{t('common.name')}</th>
                <th className="px-6 py-4">{t('common.group')}</th>
                <th className="px-6 py-4">{t('common.phone')}</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">{t('common.birthDate')}</th>
                <th className="px-6 py-4">{t('common.address')}</th>
                <th className="px-6 py-4">{t('common.createdAt')}</th>
                <th className="px-6 py-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-gray-50 dark:divide-gray-700">
              {loading ? (
                /* Skeleton rows */
                Array.from({ length: LIMIT }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-16 text-gray-400 font-semibold text-sm"
                  >
                    {t('student.notFound')}
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.photo && !imageErrors[student.id] ? (
                          <img
                            src={getImageUrl(student.photo)}
                            alt={student.name}
                            onError={() => handleImageError(student.id)}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-700"
                          />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${student.bgColor}`}
                          >
                            {student.initial}
                          </div>
                        )}
                        <span className="font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] flex-nowrap no-scrollbar scroll-smooth">
                        {student.groups.length > 0 ? (
                          student.groups.map((group, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded text-[11px] font-medium border border-purple-100 dark:border-purple-800 shrink-0"
                            >
                              {group}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {student.birthDate}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {student.address}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {student.createdDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewStudent(student)}
                          className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                          title={t('btn.view')}
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          title={t('btn.delete')}
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-1.5 text-purple-400 hover:text-purple-600 transition-colors"
                          title={t('btn.edit')}
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                d="M10 19l-7-7 7-7"
              />
            </svg>
            {t('btn.prev')}
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium mr-2">
              {t('common.page')}:
            </span>
            {getPaginationRange(page).map((item, idx) => {
              if (item === "...") {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              const isActive = page === item;
              return (
                <button
                  key={`page-${item}`}
                  onClick={() => setPage(item)}
                  disabled={loading}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20 cursor-default"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!hasMore || loading}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t('btn.next')}
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
                d="M14 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <AddStudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onAdd={handleAddStudent}
        onEdit={handleEditStudent}
        studentData={editingStudent}
      />

      {/* Toast */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((tItem) => (
          <div
            key={tItem.id}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] max-w-sm bg-white dark:bg-gray-800 ${
              tItem.type === "success" ? "border-green-100 dark:border-green-900" : "border-red-100 dark:border-red-900"
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${tItem.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {tItem.type === "success" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{tItem.title}</p>
              {tItem.desc && <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">{tItem.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDeleteStudent}
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('student.deleteTitle')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {t('student.deleteConfirm')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDeleteStudent}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {t('btn.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                disabled={isDeleting}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('btn.deleting')}
                  </>
                ) : t('btn.yes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
