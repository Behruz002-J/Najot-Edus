import React, { useState } from 'react';

const availableGroups = [
  { id: 1, name: 'N26' },
  { id: 2, name: 'n105' },
  { id: 3, name: 'n101' },
  { id: 4, name: 'n102' },
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
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="p-6 pb-2 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Guruhga biriktirish</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Bir yoki bir nechta guruhni tanlang
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Guruh qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all dark:text-white text-sm"
            />
          </div>

          {/* Groups List */}
          <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar pr-1">
            {filteredGroups.map((group) => (
              <label 
                key={group.id} 
                className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={tempSelected.includes(group.name)}
                    onChange={() => toggleGroup(group.name)}
                    className="w-5 h-5 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {group.name}
                </span>
              </label>
            ))}
            {filteredGroups.length === 0 && (
              <div className="text-center py-4 text-sm text-gray-400">
                Guruhlar topilmadi
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-50 dark:border-gray-700 flex gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Bekor qilish
          </button>
          <button 
            onClick={handleAssign}
            className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none"
          >
            Qo'shish
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoomIn 0.2s ease-out forwards;
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
  );
}
