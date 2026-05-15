import React, { useState } from 'react';

export default function SelectStudentModal({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);

  const students = [
    { id: 1, name: 'Ali Valiyev' },
    { id: 2, name: 'Salim Qodirov' },
    { id: 3, name: 'Bobur' },
    { id: 4, name: 'Qodir Salimov' },
  ];

  if (!isOpen) return null;

  const toggleStudent = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Talaba qo'shish</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bitta yoki bir nechta talabani tanlang</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Talaba qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all dark:text-white outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="px-5 space-y-px border-t border-b border-gray-50 dark:border-gray-700 max-h-[300px] overflow-y-auto no-scrollbar">
          {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
            <label 
              key={student.id} 
              className="flex items-center gap-3 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors border-b border-gray-50 last:border-0 dark:border-gray-700/50"
            >
              <input 
                type="checkbox" 
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudent(student.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]" 
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{student.name}</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-700/20">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            onClick={() => {
              onSelect(selectedStudents);
              onClose();
            }}
            className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-bold hover:bg-[#6D28D9] transition-all shadow-md"
          >
            Saqlash
          </button>
        </div>

      </div>
    </div>
  );
}
