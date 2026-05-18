import React, { useState } from 'react';

export default function SelectTeacherModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const teachers = [
    { id: 1, name: 'Mohirbek' },
    { id: 2, name: 'Javohir' },
  ];

  if (!isOpen) return null;

  const toggleTeacher = (id) => {
    setSelectedTeachers(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[420px] bg-white dark:bg-gray-800 rounded-[20px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start">
          <div>
            <h3 className="text-[19px] font-bold text-gray-900 dark:text-white">O'qituvchi qo'shish</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">Bitta yoki bir nechta o'qituvchini tanlang</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 mb-4">
          <input 
            type="text" 
            placeholder="O'qituvchi qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white outline-none"
          />
        </div>

        {/* List */}
        <div className="px-6 space-y-3 mb-6 max-h-[250px] overflow-y-auto no-scrollbar">
          {teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((teacher) => (
            <label 
              key={teacher.id} 
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <input 
                type="checkbox" 
                checked={selectedTeachers.includes(teacher.id)}
                onChange={() => toggleTeacher(teacher.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]" 
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{teacher.name}</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={onClose}
            className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-800 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            onClick={() => {
              onSelect(selectedTeachers);
              onClose();
            }}
            className="px-6 py-2.5 bg-[#7C3AED] text-white rounded-lg text-sm font-bold hover:bg-[#6D28D9] transition-all shadow-sm"
          >
            Saqlash
          </button>
        </div>

      </div>
    </div>
  );
}
