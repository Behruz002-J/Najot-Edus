import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AddTeacherModal from '../../components/AddTeacherModal';
import axiosClient from '../../api/axios';

export default function Teacher() {
  const { isTeacherModalOpen, setIsTeacherModalOpen } = useOutletContext();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archive'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const [deleting, setDeleting] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'active' ? '/teachers' : '/teachers/archive';
      const res = await axiosClient.get(endpoint);
      const data = res?.data;
      let teachersData = [];

      if (Array.isArray(data)) {
        teachersData = data;
      } else if (Array.isArray(data?.data)) {
        teachersData = data.data;
      }

      const formatted = teachersData.map((item) => ({
        id: item.id,
        name: item.full_name || item.name || "Noma'lum",
        group: item.groups || [],
        phone: item.phone || "",
        email: item.email || "",
        address: item.address || "",
        createdDate: item.created_at
          ? new Date(item.created_at).toLocaleDateString("ru-RU")
          : "",
      }));
      setTeachers(formatted);
    } catch (err) {
      console.error("Fetch teachers error:", err?.response?.data || err.message);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [activeTab]);

  const handleDeleteTeacher = (teacher) => {
    setTeacherToDelete(teacher);
  };

  const confirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    setDeleting(true);
    try {
      await axiosClient.delete(`/teachers/${teacherToDelete.id}`);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDelete.id));
      setTeacherToDelete(null);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Xatolik yuz berdi";
      alert(`O'qituvchini o'chirishda xatolik:\n${msg}`);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDeleteTeacher = () => {
    setTeacherToDelete(null);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (page) => {
    if (typeof page === 'number') setCurrentPage(page);
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('active')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                activeTab === 'active'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-[#7C3AED] dark:text-purple-400 border-purple-200 dark:border-purple-800'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50'
              }`}
            >
              Faollar
            </button>
            <button 
              onClick={() => setActiveTab('archive')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                activeTab === 'archive'
                  ? 'bg-purple-50 dark:bg-purple-900/20 text-[#7C3AED] dark:text-purple-400 border-purple-200 dark:border-purple-800'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50'
              }`}
            >
              Arxiv
            </button>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F9FAFB] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 px-4 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[13px] text-gray-500 font-semibold border-b border-gray-50 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800/50">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 w-4 h-4" />
                </th>
                <th className="px-6 py-4">Nomi &darr;</th>
                <th className="px-6 py-4">Guruh</th>
                <th className="px-6 py-4">Telefon raqamlari</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Manzil</th>
                <th className="px-6 py-4">Yaratilgan sana</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-[14px] divide-y divide-gray-50 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-gray-400 font-semibold text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Yuklanmoqda...
                    </div>
                  </td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-gray-400 font-semibold text-sm">
                    O'qituvchilar topilmadi.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 w-4 h-4" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name + currentPage}`} 
                        alt="" 
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 object-cover" 
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">{teacher.name} {currentPage > 1 ? `#${currentPage}` : ''}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {teacher.group.map((g, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#F3F4F6] dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{teacher.phone}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{teacher.email}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{teacher.address}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{teacher.createdDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 text-gray-400">
                      <button className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteTeacher(teacher)}
                        className="hover:text-red-500 transition-colors"
                        title="O'chirish"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <button className="hover:text-purple-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            &larr; Previous
          </button>
          <div className="flex items-center gap-2">
            {[1, 2, 3, '...', 8, 9, 10].map((p, i) => (
              <button 
                key={i} 
                onClick={() => handlePageClick(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${p === currentPage ? 'bg-[#7B2CBF] text-white shadow-md shadow-purple-200' : p === '...' ? 'text-gray-400 cursor-default' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            Next &rarr;
          </button>
        </div>
      </div>
      <AddTeacherModal 
        isOpen={isTeacherModalOpen} 
        onClose={() => setIsTeacherModalOpen(false)} 
        setTeachers={setTeachers}
      />

      {/* Delete Confirmation Modal */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDeleteTeacher}
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              O'qituvchini o'chirish
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Rostdan ham o'chirishni hohlaysizmi?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelDeleteTeacher}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={confirmDeleteTeacher}
                disabled={deleting}
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {deleting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                )}
                {deleting ? "O'chirilmoqda..." : "Ha"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
