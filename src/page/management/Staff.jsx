import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../api/axios";

const getImageUrl = (photo) => {
  if (!photo || String(photo).includes('1780247797805.png')) return '/bane-profile.jpg';
  if (photo.startsWith("http") || photo.startsWith("blob:")) return photo;
  const path = photo.startsWith("/") ? photo : `/${photo}`;
  if (path.startsWith("/files/")) {
    return `https://najot-edu.softwareengineer.uz${path}`;
  }
  return `https://najot-edu.softwareengineer.uz/files${path}`;
};

const LIMIT = 5;

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "ADMIN",
  });

  const addToast = (type, title, desc = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, desc }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  };

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      // Fetching from the exact endpoint: /users/admin/all
      const res = await axiosClient.get("/users/admin/all");
      const data = res?.data;
      let adminsData = [];

      if (Array.isArray(data)) {
        adminsData = data;
      } else if (Array.isArray(data?.data)) {
        adminsData = data.data;
      }

      setAdmins(
        adminsData.map((item, idx) => {
          const fullName = `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Noma'lum";
          return {
            id: item.id,
            name: fullName,
            firstName: item.first_name || "",
            lastName: item.last_name || "",
            email: item.email || "—",
            phone: item.phone || "—",
            role: item.role || "ADMIN",
            photo: item.photo || null,
            initial: (item.first_name || item.name || "?")[0]?.toUpperCase(),
            bgColor: AVATAR_COLORS[(item.id || idx) % AVATAR_COLORS.length],
          };
        })
      );
    } catch (err) {
      console.error("Fetch admins error:", err?.response?.data || err.message);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 9);
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      addToast("error", "Xatolik!", "Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    try {
      setSaving(true);
      // Extract exactly 9 digits of phone number
      const phoneDigits = formData.phone.replace(/\D/g, "").slice(0, 9);

      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: phoneDigits,
        password: formData.password,
        address: formData.address.trim() || "Tashkent",
      };

      // Creating admin using POST /users/admin
      const res = await axiosClient.post("/users/admin", payload);
      
      if (res.status === 200 || res.status === 201 || res.data?.success) {
        addToast("success", "Hodim qo'shildi!", `"${formData.firstName} ${formData.lastName}" muvaffaqiyatli qo'shildi.`);
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          role: "ADMIN",
        });
        setIsAddModalOpen(false);
        fetchAdmins();
      } else {
        const rawMsg = res.data?.message;
        let errorMsg = rawMsg || "Kutilmagan xatolik.";
        if (Array.isArray(errorMsg)) {
          errorMsg = errorMsg.map(msg => msg === "password is not strong enough" ? "Parol yetarlicha kuchli emas! (Kamida 8 ta belgi, katta-kichik harf va raqamlar bo'lishi shart)" : msg).join(", ");
        } else if (typeof errorMsg === "string" && errorMsg === "password is not strong enough") {
          errorMsg = "Parol yetarlicha kuchli emas! (Kamida 8 ta belgi, katta-kichik harf va raqamlar bo'lishi shart)";
        }
        addToast("error", "Xatolik!", errorMsg);
      }
    } catch (err) {
      console.error("Save admin error:", err);
      let errorMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      if (Array.isArray(errorMsg)) {
        errorMsg = errorMsg.map(msg => msg === "password is not strong enough" ? "Parol yetarlicha kuchli emas! (Kamida 8 ta belgi, katta-kichik harf va raqamlar bo'lishi shart)" : msg).join(", ");
      } else if (typeof errorMsg === "string" && errorMsg === "password is not strong enough") {
        errorMsg = "Parol yetarlicha kuchli emas! (Kamida 8 ta belgi, katta-kichik harf va raqamlar bo'lishi shart)";
      }
      addToast("error", "Xatolik!", errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const filtered = admins.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginated chunk
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const totalPages = Math.max(10, Math.ceil(filtered.length / LIMIT));

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        
        {/* Table Header / Filters */}
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between flex-wrap gap-4 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Hodim qidirish..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-72 focus:ring-1 focus:ring-[#7C3AED] dark:text-white outline-none transition-colors duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAdmins()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-sm"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Yangilash
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#6D28D9] transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Hodim qo'shish
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[12px] text-gray-400 font-semibold border-b border-gray-50 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 transition-colors">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-purple-600 focus:ring-purple-500" />
                </th>
                <th className="px-6 py-4">Ism / FIO</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Telefon</th>
                <th className="px-6 py-4">Rol (Role)</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-gray-50 dark:divide-gray-700 transition-colors">
              {loading ? (
                Array.from({ length: LIMIT }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36" /></td>
                    <td className="px-6 py-4"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400 font-semibold text-sm">
                    Hodimlar topilmadi.
                  </td>
                </tr>
              ) : (
                paginated.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-purple-600 focus:ring-purple-500" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {admin.photo ? (
                          <img 
                            src={getImageUrl(admin.photo)} 
                            alt={admin.name} 
                            onError={(e) => {
                              e.target.src = '/bane-profile.jpg';
                            }}
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <img 
                            src="/bane-profile.jpg" 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        )}
                        <span className="font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {admin.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                      {admin.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        admin.role === "SUPERADMIN"
                          ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50"
                          : "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50"
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between transition-colors duration-300">
          <button
            onClick={handlePrev}
            disabled={page === 1 || loading}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            &larr; Oldingi
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isSelected = page === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    isSelected
                      ? "bg-[#7C3AED] text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={page === totalPages || loading}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Keyingi &rarr;
          </button>
        </div>
      </div>

      {/* Add Admin Drawer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setIsAddModalOpen(false)} />
          
          <form
            onSubmit={handleAddAdmin}
            className="relative w-full max-w-[440px] bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden transition-colors duration-300"
          >
            {/* Header */}
            <div className="p-8 pb-4 relative">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-[26px] font-bold text-gray-900 dark:text-white mb-2">Hodim qo'shish</h2>
              <p className="text-gray-500 dark:text-gray-400 text-[14px]">Yangi ma'muriy hodim (admin) qo'shish uchun ma'lumotlarni to'ldiring.</p>
            </div>

            <div className="border-b border-gray-100 dark:border-gray-800 mx-8"></div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-8 space-y-5 no-scrollbar">
              
              {/* Ismi */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Ismi (First Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Ismini kiriting"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold"
                />
              </div>

              {/* Familiyasi */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Familiyasi (Last Name) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Familiyasini kiriting"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Email manzili <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold"
                />
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Telefon raqami</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-sm font-semibold text-gray-500 dark:text-gray-400 select-none">
                    +998
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="901234567"
                    maxLength={9}
                    inputMode="numeric"
                    className="flex-1 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Manzil */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Yashash manzili</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Masalan: Tashkent"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Parol yarating <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Kamida 8 ta belgi, harf va raqam"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold"
                />
                <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500 font-medium">Parol kamida 8 ta belgidan iborat bo'lib, harf va raqamlarni o'z ichiga olishi kerak.</p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Lavozimi / Rol <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-gray-900 dark:text-white text-sm font-semibold appearance-none cursor-pointer"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERADMIN">SUPERADMIN</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700 flex gap-4 mt-auto">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-6 py-3.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3.5 bg-[#7C3AED] text-white rounded-xl text-sm font-bold hover:bg-[#6D28D9] disabled:opacity-50 transition-colors shadow-lg shadow-purple-200/50 dark:shadow-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saqlanmoqda...
                  </>
                ) : "Saqlash"}
              </button>
            </div>
          </form>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in-right {
              animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}} />
        </div>
      )}

      {/* Volumetric Toasts Notification */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] max-w-sm bg-white dark:bg-gray-800 transition-all duration-300 ${
              t.type === "success" ? "border-green-100 dark:border-green-900" : "border-red-100 dark:border-red-900"
            }`}
          >
            <div className={`shrink-0 mt-0.5 ${t.type === "success" ? "text-green-500" : "text-red-500"}`}>
              {t.type === "success" ? (
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
              <p className="text-[14px] font-semibold text-gray-900 dark:text-white">{t.title}</p>
              {t.desc && <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
