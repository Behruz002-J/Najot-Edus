import React, { useState } from 'react';
import SelectStudentModal from './SelectStudentModal';
import SelectTeacherModal from './SelectTeacherModal';

export default function AddGroupModal({ isOpen, onClose }) {
  const [isSelectStudentOpen, setIsSelectStudentOpen] = useState(false);
  const [isSelectTeacherOpen, setIsSelectTeacherOpen] = useState(false);

  const days = [
    'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300 animate-fade-in" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Guruh qo'shish</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Guruh nomi */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Guruh nomi <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Frontend 2024"
              className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none"
            />
          </div>

          {/* Kurs */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Kurs <span className="text-red-500">*</span></label>
            <div className="relative">
              <select defaultValue="" className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none appearance-none cursor-pointer">
                <option value="" disabled></option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="design">Design</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Xona */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Xona <span className="text-red-500">*</span></label>
            <div className="relative">
              <select defaultValue="" className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none appearance-none cursor-pointer">
                <option value="" disabled></option>
                <option value="autodesk">Autodesk</option>
                <option value="mac">Mac</option>
                <option value="windows">Windows</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Lesson Days */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Dars kunlari <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => (
                <label key={day} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lesson Time */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Dars vaqti <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="time" 
                defaultValue="08:00"
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Boshlanish sanasi <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Tavsif</label>
            <textarea 
              placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
              rows={4}
              className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all resize-none"
            />
          </div>

          {/* Teachers Section */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">O'qituvchilar</label>
            <button 
              onClick={() => setIsSelectTeacherOpen(true)}
              className="w-full py-4 px-4 bg-[#F3F4F6] dark:bg-gray-700 rounded-xl flex items-center gap-2 text-sm font-bold text-[#7C3AED] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Qo'shish
            </button>
          </div>

          {/* Students Section */}
          <div className="space-y-3 pb-4">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Talabalar</label>
            <button 
              onClick={() => setIsSelectStudentOpen(true)}
              className="w-full py-4 px-4 bg-[#F3F4F6] dark:bg-gray-700 rounded-xl flex items-center justify-between text-sm font-bold text-[#7C3AED] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors overflow-hidden relative"
            >
              <div className="flex items-center gap-2 z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Qo'shish
              </div>
              <svg className="w-24 h-24 absolute right-0 bottom-[-20px] text-[#7C3AED]/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0L8.66 25v50L50 100l41.34-25V25L50 0zm0 15l25 15.2-25 15.2-25-15.2L50 15zm-25 24.3l20 12.1v23.5L15 56.6V39.3zm30 35.6V51.4l20-12.1v17.3L55 74.9z"/>
              </svg>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            Bekor qilish
          </button>
          <button className="flex-1 py-3.5 px-4 bg-[#7C3AED] text-white rounded-xl text-sm font-bold hover:bg-[#6D28D9] shadow-lg shadow-purple-200/50 dark:shadow-none transition-all">
            Saqlash
          </button>
        </div>

      </div>

      <SelectStudentModal 
        isOpen={isSelectStudentOpen}
        onClose={() => setIsSelectStudentOpen(false)}
        onSelect={(selected) => console.log('Selected students:', selected)}
      />

      <SelectTeacherModal 
        isOpen={isSelectTeacherOpen}
        onClose={() => setIsSelectTeacherOpen(false)}
        onSelect={(selected) => console.log('Selected teachers:', selected)}
      />

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
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
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
  );
}
