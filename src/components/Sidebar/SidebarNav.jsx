import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../../data/navigation';

export default function SidebarNav({ isCollapsed, isManagementOpen, setIsManagementOpen, managementRef }) {
  const location = useLocation();

  const isExactActive = (path) => location.pathname === path;
  const isSubActive = (path) => location.pathname.startsWith(path) && path !== '/dashboard';

  return (
    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
      {navItems.map((item) => {
        const isActive = item.isManagement
          ? isSubActive(item.path)
          : item.path === '/dashboard'
          ? isExactActive(item.path)
          : isSubActive(item.path);

        if (item.isManagement) {
          return (
            <div key={item.name} ref={managementRef}>
              <button
                onClick={() => setIsManagementOpen((prev) => !prev)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive || isManagementOpen
                    ? 'bg-[#7C3AED] text-white shadow-md'
                    : 'hover:bg-purple-200 dark:hover:bg-purple-800/40 text-gray-500 dark:text-gray-400'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive || isManagementOpen ? 'text-white' : 'text-[#6B7280] group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {!isCollapsed && (
                  <span className={`font-medium text-sm whitespace-nowrap flex-1 text-left transition-colors duration-200 ${isActive || isManagementOpen ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300'}`}>{item.name}</span>
                )}
                {!isCollapsed && (
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isManagementOpen ? 'rotate-180' : ''} ${isActive || isManagementOpen ? 'text-white' : 'text-[#6B7280] group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          );
        }

        return (
          <Link
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : ''}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'hover:bg-purple-200 dark:hover:bg-purple-800/40 text-gray-500 dark:text-gray-400'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            {!isCollapsed && <span className={`font-medium text-sm whitespace-nowrap flex-1 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300'}`}>{item.name}</span>}
            {item.hasCrown && !isCollapsed && (
              <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
