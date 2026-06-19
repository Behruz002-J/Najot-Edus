import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems, studentNavItems, teacherNavItems } from '../../data/navigation';
import { useLanguage } from '../../context/LanguageContext';

export default function SidebarNav({ isCollapsed, isManagementOpen, setIsManagementOpen, managementRef }) {
  const { t } = useLanguage();
  const location = useLocation();
  const role = window.localStorage.getItem("role") || "TEACHER";
  const isStudent = (role === "STUDENT" || role === "student" || role === "PUPIL" || role === "pupil");
  const isTeacher = role === "TEACHER";
  const items = isStudent ? studentNavItems : isTeacher ? teacherNavItems : navItems;

  const [openDropdowns, setOpenDropdowns] = useState({
    "nav.groups": true // Keep Guruhlar dropdown open by default as in screenshot
  });

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isExactActive = (path) => location.pathname === path;
  const isSubActive = (path) => location.pathname.startsWith(path) && path !== '/dashboard';

  return (
    <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto no-scrollbar">
      {items.map((item) => {
        if (item.isDropdown) {
          const isOpen = openDropdowns[item.key || item.name] !== false; // default to open
          const isAnySubActive = item.subItems.some(sub => location.pathname === sub.path);

          return (
            <div key={item.name} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleDropdown(item.key || item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group hover:bg-purple-200 dark:hover:bg-purple-800/40 text-gray-500 dark:text-gray-400 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0 text-[#6B7280] group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap flex-1 text-left text-gray-500 dark:text-gray-400 group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300">{item.key ? t(item.key) : item.name}</span>
                )}
                {!isCollapsed && (
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-[#6B7280] group-hover:text-[#7B2CBF]`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {isOpen && !isCollapsed && (
                <div className="pl-6 space-y-1 border-l border-gray-100 dark:border-gray-700 ml-5">
                  {item.subItems.map((sub) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          isSubActive
                            ? 'bg-[#7C3AED] text-white shadow-md'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-950/20 hover:text-gray-800 dark:hover:text-white'
                        }`}
                      >
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const isActive = item.isManagement
          ? isSubActive(item.path)
          : item.path === '/dashboard'
          ? isExactActive(item.path)
          : isSubActive(item.path);

        const activeBg = isStudent ? "bg-[#FFF4E5] dark:bg-orange-950/20 text-[#E29543] dark:text-orange-400 font-semibold" : "bg-[#7C3AED] text-white shadow-md";
        const inactiveBg = isStudent ? "hover:bg-orange-50/50 dark:hover:bg-orange-950/10 text-[#374151] dark:text-gray-300" : "hover:bg-purple-200 dark:hover:bg-purple-800/40 text-gray-500 dark:text-gray-400";
        const activeSvg = isStudent ? "text-[#E29543] dark:text-orange-400" : "text-white";
        const inactiveSvg = isStudent ? "text-[#4B5563] dark:text-gray-400 group-hover:text-[#E29543] dark:group-hover:text-orange-400" : "text-[#6B7280] group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300";
        const activeText = isStudent ? "text-[#E29543] dark:text-orange-400 font-bold" : "text-white";
        const inactiveText = isStudent ? "text-[#374151] dark:text-gray-300 group-hover:text-[#E29543] dark:group-hover:text-orange-400" : "text-gray-500 dark:text-gray-400 group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300";

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
                  <span className={`font-medium text-sm whitespace-nowrap flex-1 text-left transition-colors duration-200 ${isActive || isManagementOpen ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300'}`}>{item.key ? t(item.key) : item.name}</span>
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
              isActive ? activeBg : inactiveBg
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive ? activeSvg : inactiveSvg}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isStudent ? 1.5 : 2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {!isCollapsed && <span className={`font-medium text-sm whitespace-nowrap flex-1 transition-colors duration-200 ${isActive ? activeText : inactiveText}`}>{item.key ? t(item.key) : item.name}</span>}
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
