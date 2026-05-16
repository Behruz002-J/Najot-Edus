import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: 'Mohirbek', 
      group: ['N26', 'n105'], 
      phone: '+998944481309', 
      email: 'moxirbek@gmail.com', 
      address: 'Tashkent', 
      createdDate: '12.05.2026' 
    },
    { 
      id: 2, 
      name: 'Javohir', 
      group: ['N27'], 
      phone: '+998944481310', 
      email: 'javohir@gmail.com', 
      address: 'Samarkand', 
      createdDate: '13.05.2026' 
    },
    { 
      id: 3, 
      name: 'Doston', 
      group: ['N28', 'm202'], 
      phone: '+998944481311', 
      email: 'doston@gmail.com', 
      address: 'Andijan', 
      createdDate: '14.05.2026' 
    },
  ]);

  const location = useLocation();
  const username = window.localStorage.getItem("username") || "Admin";

  // Apply dark class to <html> when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 overflow-hidden relative transition-colors duration-300">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FB] dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="h-16 bg-[#F8F9FB] dark:bg-gray-900 flex items-center justify-between px-8 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </button>
              <button 
                onClick={() => {
                  if (location.pathname === '/dashboard/students') {
                    setIsStudentModalOpen(true);
                  } else if (location.pathname === '/dashboard/teacher') {
                    setIsTeacherModalOpen(true);
                  } else if (location.pathname === '/dashboard/groups') {
                    setIsGroupModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-bold hover:bg-[#6D28D9] transition-colors shadow-sm ml-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Qo'shish
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className="relative max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-white dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-800 transition-colors duration-300 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center gap-1 border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  O'zbekcha <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-1">
                    <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">O'zbekcha</button>
                    <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">Rus tili</button>
                    <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">Ingliz tili</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 border-l border-gray-100 dark:border-gray-700 ml-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
              >
                <span className="block transition-transform duration-500" style={{ transform: isDark ? 'rotate(360deg)' : 'rotate(0deg)' }}>
                  {isDark ? (
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v1m0 16v1m8.66-9H21M3 12H2m15.36-6.36l-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M12 5a7 7 0 110 14A7 7 0 0112 5z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 ml-2">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {location.pathname === '/dashboard/teacher' ? 'O\'qituvchilar' :
                  location.pathname === '/dashboard/students' ? 'Talabalar' :
                  location.pathname === '/dashboard/groups' ? 'Guruhlar' :
                  location.pathname === '/dashboard' ? <>Salom, <span className="text-blue-500">{username}</span></> :
                    'Boshqaruv paneli'}
              </h1>
              {location.pathname === '/dashboard/teacher' ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Ushbu sahifada siz o'qituvchilar ro'yxatini va ularning ma'lumotlarini topasiz.</p>
              ) : location.pathname === '/dashboard/students' ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Ushbu sahifada siz Talabalar ro'yxatini va ularning ma'lumotlarini topasiz. Har bir Talaba ismi, fanlari va aloqa ma'lumotlari keltirilgan.</p>
              ) : location.pathname === '/dashboard/groups' ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Ushbu sahifada siz o'quv markazidagi barcha guruhlar va ularning dars jadvalini ko'rishingiz mumkin.</p>
              ) : location.pathname === '/dashboard' ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">EduCoin platformasiga xush kelibsiz</p>
              ) : null}
            </div>

            {(location.pathname === '/dashboard/teacher' || 
              location.pathname === '/dashboard/students' || 
              location.pathname === '/dashboard/groups') && (
              <div className="flex items-center gap-3">
                {(location.pathname === '/dashboard/teacher' || location.pathname === '/dashboard/groups') && (
                  <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (location.pathname === '/dashboard/students') {
                      setIsStudentModalOpen(true);
                    } else if (location.pathname === '/dashboard/teacher') {
                      setIsTeacherModalOpen(true);
                    } else if (location.pathname === '/dashboard/groups') {
                      setIsGroupModalOpen(true);
                    }
                  }}
                  className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#6D28D9] shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  {location.pathname === '/dashboard/teacher' ? "O'qituvchi qo'shish" : 
                   location.pathname === '/dashboard/groups' ? "Guruh qo'shish" : "Talaba qo'shish"}
                </button>
              </div>
            )}
          </div>
          <Outlet context={{ 
            isStudentModalOpen, setIsStudentModalOpen, 
            isTeacherModalOpen, setIsTeacherModalOpen, 
            isGroupModalOpen, setIsGroupModalOpen,
            teachers, setTeachers
          }} />
        </main>
      </div>
    </div>
  );
}
