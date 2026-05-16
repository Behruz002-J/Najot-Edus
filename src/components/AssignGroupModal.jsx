import React, { useState } from 'react';

const availableGroups = [
  { id: 1, name: 'N26' },
  { id: 2, name: 'n105' },
];

export default function AssignGroupModal({ isOpen, onClose, onAssign, selectedGroups = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSelected, setTempSelected] = useState(selectedGroups);

  if (!isOpen) return null;

  const toggleGroup = (groupName) => {
    if (tempSelected.includes(groupName)) {
      setTempSelected(tempSelected.filter(g => g !== groupName));
    } else {
      setTempSelected([...tempSelected, groupName]);
    }
  };

  const handleAssign = () => {
    onAssign(tempSelected);
    onClose();
  };

  const filteredGroups = availableGroups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="p-4 pb-1 flex items-start justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">Guruhga biriktirish</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              Bir yoki bir nechta guruhni tanlang
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 pt-2 space-y-3">
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Guruh qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-900 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all dark:text-white text-xs"
            />
          </div>

          {/* Groups List */}
          <div className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden divide-y divide-gray-50 dark:divide-gray-800 max-h-[150px] overflow-y-auto custom-scrollbar">
            {filteredGroups.map((group) => (
              <label 
                key={group.id} 
                className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <input 
                  type="checkbox" 
                  checked={tempSelected.includes(group.name)}
                  onChange={() => toggleGroup(group.name)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-900 dark:text-gray-200">
                  {group.name}
                </span>
              </label>
            ))}
            {filteredGroups.length === 0 && (
              <div className="text-center py-3 text-xs text-gray-400">
                Guruhlar topilmadi
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-1 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-5 py-1.5 border border-gray-100 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            onClick={handleAssign}
            className="px-5 py-1.5 bg-[#B794F4] text-white rounded-lg text-xs font-bold hover:bg-[#A78BFA] transition-all shadow-sm"
          >
            Qo'shish
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}
