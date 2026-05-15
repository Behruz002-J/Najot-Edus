import React, { useState, useEffect } from 'react';
import AssignGroupModal from './AssignGroupModal';

export default function AddStudentModal({ isOpen, onClose, onAdd, onEdit, studentData }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '+998',
    email: '',
    birthDate: '',
    address: '',
    password: '',
    groups: []
  });

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    if (studentData) {
      setFormData({
        name: studentData.name || '',
        phone: studentData.phone || '+998',
        email: studentData.email || '',
        birthDate: studentData.birthDate || '',
        address: studentData.address || '',
        password: studentData.password || '',
        groups: studentData.groups || []
      });
    } else {
      setFormData({
        name: '',
        phone: '+998',
        email: '',
        birthDate: '',
        address: '',
        password: '',
        groups: []
      });
    }
  }, [studentData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignGroups = (selectedGroups) => {
    setFormData(prev => ({ ...prev, groups: selectedGroups }));
  };

  const removeGroup = (groupName) => {
    setFormData(prev => ({ ...prev, groups: prev.groups.filter(g => g !== groupName) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (studentData) {
      onEdit({ ...studentData, ...formData });
    } else {
      onAdd(formData);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop / Soya */}
        <div
          className="absolute inset-0 bg-black/60 transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
        />

        {/* Sidebar Content (Right to Left) */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-slide-in-right"
        >
          {/* Header */}
          <div className="p-6 pb-2 border-b border-gray-50 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {studentData ? "Talabani tahrirlash" : "Talaba qo'shish"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {studentData ? "Talaba ma'lumotlarini o'zgartirishingiz mumkin." : "Bu yerda siz yangi Talaba qo'shishingiz mumkin."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable Form Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* Telefon raqam */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Telefon raqam</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
              />
            </div>

            {/* Mail */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mail</label>
              <input
                type="email"
                name="email"
                placeholder="Elektron pochtani kiriting"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
              />
            </div>

            {/* Talaba FIO */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Talaba FIO</label>
              <input
                type="text"
                name="name"
                placeholder="Ma'lumotni kiriting"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
              />
            </div>

            {/* Tug'ilgan sanasi */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tug'ilgan sanasi</label>
              <div className="relative">
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm appearance-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Manzil */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Manzil</label>
              <input
                type="text"
                name="address"
                placeholder="Manzilni kiriting"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
              />
            </div>

            {/* Parol */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Parol</label>
              <input
                type="password"
                name="password"
                placeholder="Parolni kiriting"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
              />
            </div>

            {/* Guruh */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Guruh</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.groups.map((group, index) => (
                  <span key={index} className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-800">
                    {group}
                    <button type="button" onClick={() => removeGroup(group)} className="hover:text-purple-800 dark:hover:text-purple-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold text-sm transition-colors mb-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Guruh qo'shish
              </button>
            </div>

            {/* Surati */}
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Surati</label>
              <div className="border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    <span className="text-purple-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">JPG or PNG (max. 2 MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3 bg-white dark:bg-gray-800 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 dark:shadow-none"
            >
              {studentData ? "Saqlash" : "Qo'shish"}
            </button>
          </div>
        </form>

        <style dangerouslySetInnerHTML={{
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
        `}} />
      </div>
      <AssignGroupModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignGroups}
        selectedGroups={formData.groups}
      />
    </>
  );
}
