import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { managementSubItems } from '../../data/navigation';

export default function ManagementFlyout({ isCollapsed, isManagementOpen, setIsManagementOpen, flyoutRef }) {
  const location = useLocation();

  return (
    <div
      ref={flyoutRef}
      style={{
        left: isCollapsed ? '80px' : '256px',
        transition: 'transform 0.3s ease, opacity 0.3s ease, left 0.3s ease',
        transform: isManagementOpen ? 'translateX(0)' : 'translateX(-110%)',
        opacity: isManagementOpen ? 1 : 0,
        pointerEvents: isManagementOpen ? 'auto' : 'none',
      }}
      className="fixed top-0 bottom-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-2xl z-10 rounded-tr-[8px] rounded-br-[8px]"
    >
      <div className="p-6 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">Menu</h2>

        </div>

        <nav className="space-y-1">
          {managementSubItems.map((subItem) => {
            const isSubItemActive = location.pathname === subItem.path;
            return (
              <Link
                key={subItem.name}
                to={subItem.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isSubItemActive
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                <svg className={`w-5 h-5 flex-shrink-0 ${isSubItemActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={subItem.icon} />
                </svg>
                <span className="text-sm">{subItem.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
