import React, { useEffect, useState } from 'react';
import SelectStudentModal from './SelectStudentModal';

export default function AddGroupModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSelectStudentOpen, setIsSelectStudentOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const days = [
    'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'
  ];

  if (!isOpen && !isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Guruh qo'shish</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Lesson Days */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Dars kunlari <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => (
                <label key={day} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lesson Time */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Dars vaqti <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="time" 
                defaultValue="09:00"
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all dark:text-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Boshlanish sanasi <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Tavsif</label>
            <textarea 
              placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
              rows={4}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all dark:text-white resize-none"
            />
          </div>

          {/* Teachers Section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">O'qituvchilar</label>
            <button className="w-full p-3 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-[#7C3AED] hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Qo'shish
            </button>
          </div>

          {/* Students Section */}
          <div className="space-y-3 pb-4">
            <label className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Talabalar</label>
            <button 
              onClick={() => setIsSelectStudentOpen(true)}
              className="w-full p-3 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-[#7C3AED] hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Qo'shish
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Bekor qilish
          </button>
          <button className="flex-1 py-3 px-4 bg-[#7C3AED] text-white rounded-xl text-sm font-bold hover:bg-[#6D28D9] shadow-lg shadow-purple-200 dark:shadow-none transition-all">
            Saqlash
          </button>
        </div>

      </div>

      <SelectStudentModal 
        isOpen={isSelectStudentOpen}
        onClose={() => setIsSelectStudentOpen(false)}
        onSelect={(selected) => console.log('Selected students:', selected)}
      />
    </div>
  );
}
