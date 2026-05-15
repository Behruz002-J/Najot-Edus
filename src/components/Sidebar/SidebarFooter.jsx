import React from 'react';

export default function SidebarFooter({ isCollapsed, handleLogout }) {
  return (
    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
      {!isCollapsed ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm text-orange-500 font-bold">!</div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-800 dark:text-white">Obuna</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Obunangiz tugagan</span>
            </div>
          </div>
          <button className="w-full bg-red-500 text-white py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors group">
            <svg className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Obunani yangilash
          </button>
        </div>
      ) : (
        <div className="flex justify-center py-2">
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Chiqish">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
