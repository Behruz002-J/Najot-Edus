import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const initialRooms = [
  // AlCoder markazi
  { id: 1, name: "Autodesk", capacity: 20, branch: "AlCoder markazi" },
  { id: 2, name: "Impact room", capacity: 12, branch: "AlCoder markazi" },
  { id: 3, name: "99", capacity: 25, branch: "AlCoder markazi" },
  { id: 4, name: "Startup room", capacity: 20, branch: "AlCoder markazi" },
  { id: 5, name: "Alpha room", capacity: 18, branch: "AlCoder markazi" },
  { id: 6, name: "Beta room", capacity: 14, branch: "AlCoder markazi" },
  { id: 7, name: "Conference hall", capacity: 40, branch: "AlCoder markazi" },

  // Fizika va Matematika
  { id: 8, name: "1A", capacity: 25, branch: "Fizika va Matematika" },
  { id: 9, name: "205-xona", capacity: 32, branch: "Fizika va Matematika" },
  { id: 10, name: "301-sinf", capacity: 28, branch: "Fizika va Matematika" },
  { id: 11, name: "Lab xona", capacity: 20, branch: "Fizika va Matematika" },
  { id: 12, name: "102-xona", capacity: 30, branch: "Fizika va Matematika" },

  // 4-maktab
  { id: 13, name: "16-xona", capacity: 18, branch: "4-maktab" },
  { id: 14, name: "22-xona", capacity: 22, branch: "4-maktab" },
  { id: 15, name: "35-xona", capacity: 26, branch: "4-maktab" },
  { id: 16, name: "Amaliyot xonasi", capacity: 16, branch: "4-maktab" },
  { id: 17, name: "48-xona", capacity: 30, branch: "4-maktab" },
  { id: 18, name: "Katta sinf", capacity: 35, branch: "4-maktab" },

  // Niner markazi
  { id: 19, name: "5 xona", capacity: 30, branch: "Niner markazi" },
  { id: 20, name: "7 xona", capacity: 24, branch: "Niner markazi" },
  { id: 21, name: "Niner-A", capacity: 20, branch: "Niner markazi" },
  { id: 22, name: "Niner-B", capacity: 18, branch: "Niner markazi" },
  { id: 23, name: "Guruh xonasi", capacity: 15, branch: "Niner markazi" },

  // IELTS full mock
  {
    id: 24,
    name: "IELTS with islombek",
    capacity: 20,
    branch: "IELTS full mock",
  },
  { id: 25, name: "Speaking room 1", capacity: 8, branch: "IELTS full mock" },
  { id: 26, name: "Speaking room 2", capacity: 8, branch: "IELTS full mock" },
  { id: 27, name: "Writing hall", capacity: 30, branch: "IELTS full mock" },
  { id: 28, name: "Listening room", capacity: 25, branch: "IELTS full mock" },

  // IELTS full mock centre
  { id: 29, name: "Beginner", capacity: 18, branch: "IELTS full mock centre" },
  {
    id: 30,
    name: "Intermediate",
    capacity: 22,
    branch: "IELTS full mock centre",
  },
  { id: 31, name: "Advanced", capacity: 20, branch: "IELTS full mock centre" },
  {
    id: 32,
    name: "Mock test hall",
    capacity: 35,
    branch: "IELTS full mock centre",
  },
  {
    id: 33,
    name: "Practice room",
    capacity: 15,
    branch: "IELTS full mock centre",
  },

  // Arxiv
  { id: 34, name: "Arxiv-1", capacity: 10, branch: "Arxiv" },
  { id: 35, name: "Arxiv-2", capacity: 10, branch: "Arxiv" },
  { id: 36, name: "Eski sinf xona", capacity: 20, branch: "Arxiv" },
];

import axiosClient from "../../api/axios";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ name: "", capacity: "" });
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (type, title, desc = "") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, desc }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  };

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/rooms");
      const data = res?.data;
      let roomsData = [];
      if (Array.isArray(data)) {
        roomsData = data;
      } else if (Array.isArray(data?.data)) {
        roomsData = data.data;
      }

      const formatted = roomsData.map((item, idx) => ({
        id: item.id || idx + 1,
        name: item.name || "Noma'lum xona",
        capacity: Number(item.capacity || 20),
        branch: item.branch || "AlCoder markazi"
      }));
      setRooms(formatted);
    } catch (err) {
      console.warn("Fetch rooms error, using mock fallback:", err.message);
      setRooms(initialRooms);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const deleteRoom = (id) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  const confirmDelete = async () => {
    if (!roomToDelete) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/rooms/${roomToDelete.id}`);
      deleteRoom(roomToDelete.id);
      addToast("success", "Xona o'chirildi!", `"${roomToDelete.name}" muvaffaqiyatli o'chirildi.`);
      setRoomToDelete(null);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        `Server xatosi: ${err?.response?.status || "Noma'lum"}`;
      addToast("error", "O'chirishda xatolik", msg);
      setRoomToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setRoomToDelete(null);
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setForm({ name: room.name, capacity: room.capacity });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditRoom(null);
    setForm({ name: "", capacity: "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.capacity) return;

    // If editing, update on backend
    if (editRoom) {
      try {
        const payload = {
          name: form.name.trim(),
          capacity: Number(form.capacity),
        };
        await axiosClient.patch(`/rooms/${editRoom.id}`, payload);
        await fetchRooms();
        setShowModal(false);
        addToast("success", "Xona tahrirlandi", "Xona ma'lumotlari muvaffaqiyatli yangilandi.");
      } catch (err) {
        console.warn("Edit room API failed, applying locally:", err.message);
        setRooms((prev) =>
          prev.map((r) =>
            r.id === editRoom.id
              ? { ...r, name: form.name, capacity: Number(form.capacity) }
              : r,
          ),
        );
        setShowModal(false);
        addToast("success", "Xona tahrirlandi (Lokal)", "Xona ma'lumotlari mahalliy ro'yxatda yangilandi.");
      }
      return;
    }

    // Create on backend
    try {
      const payload = {
        name: form.name.trim(),
        capacity: Number(form.capacity),
      };

      await axiosClient.post("/rooms", payload);
      await fetchRooms();
      setShowModal(false);
      addToast("success", "Xona yaratildi", "Yangi xona muvaffaqiyatli qo'shildi.");
    } catch (err) {
      console.error("Create room error:", err?.response?.data || err.message);
      // fallback: keep local behavior
      setRooms((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: form.name,
          capacity: Number(form.capacity),
          branch: "AlCoder markazi",
        },
      ]);
      setShowModal(false);
      addToast("success", "Xona yaratildi (Lokal)", "Xona mahalliy ro'yxatga qo'shildi.");
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[24px] font-black text-gray-900 dark:text-white">
            Xonalar
          </h2>
          <button 
            onClick={fetchRooms}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors mt-1"
            title="Yangilash"
          >
            <svg
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
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
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/management/archive"
            state={{ activeSubTab: "rooms" }}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-[15px] font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm active:scale-95"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#7B2CBF] text-white text-[15px] font-bold rounded-xl hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-100 dark:shadow-none active:scale-95"
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
            Xonani qo'shish
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <svg className="w-8 h-8 animate-spin text-[#7C3AED]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-3">Yuklanmoqda...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
          <p className="text-base">Xonalar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow shadow-sm"
            >
              <div>
                <p className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">
                  {room.name}
                </p>
                <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                  Sig'imi: {room.capacity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRoomToDelete(room)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="O'chirish"
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(room)}
                  className="p-1.5 text-[#7B2CBF] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  title="Tahrirlash"
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop / Soya */}
          <div
            className="absolute inset-0 bg-black/60 transition-opacity duration-300 animate-fade-in"
            onClick={() => setShowModal(false)}
          />

          {/* Sidebar Content (Right to Left) */}
          <div
            className="relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {editRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                >
                  <svg
                    className="w-6 h-6"
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

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Xona nomi"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Sig'imi <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Masalan: 20"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, capacity: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 bg-white dark:bg-gray-800 mt-auto">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!form.name || !form.capacity}
                className="px-6 py-2.5 bg-[#6D28D9] text-white rounded-lg text-sm font-bold hover:bg-[#5B21B6] transition-colors shadow-lg shadow-purple-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Saqlash
              </button>
            </div>
          </div>

          <style
            dangerouslySetInnerHTML={{
              __html: `
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-slide-in-right {
              animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            .animate-fade-in {
              animation: fadeIn 0.3s ease-out forwards;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #e5e7eb;
              border-radius: 10px;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #374151;
            }
          `,
            }}
          />
        </div>
      )}

      {/* Toast */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[300px] max-w-sm bg-white dark:bg-gray-800 ${
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

      {roomToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-[7px]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDelete}
          />
          <div className="relative w-full max-w-md rounded-[28px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Xonani o'chirish
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Rostdan ham o'chirishni xohlaysizmi?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={confirmDelete}
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
