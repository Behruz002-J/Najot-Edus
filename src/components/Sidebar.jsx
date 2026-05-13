import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navItems, managementSubItems } from '../data/navigation';
import coinsImg from '../assets/images/coins.webp';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const managementRef = useRef(null);
  const flyoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideButton = managementRef.current?.contains(event.target);
      const clickedInsideFlyout = flyoutRef.current?.contains(event.target);
      if (!clickedInsideButton && !clickedInsideFlyout) {
        setIsManagementOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsManagementOpen(false);
  }, [location.pathname]);

  const isExactActive = (path) => location.pathname === path;
  const isSubActive = (path) => location.pathname.startsWith(path) && path !== '/dashboard';

  return (
    <>
      <aside className="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col shadow-sm z-20 relative transition-all duration-300"
        style={{ width: isCollapsed ? '80px' : '256px' }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg z-30 hover:bg-blue-700 transition-colors"
          title={isCollapsed ? 'Ochish' : 'Yopish'}
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo */}
        <div className={`h-20 flex items-center gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
          <img
            src={coinsImg}
            alt="NJ-Edc Logo"
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          <Link to="/dashboard" className={`font-bold tracking-tight text-gray-800 dark:text-white transition-all duration-300 leading-tight ${isCollapsed ? 'opacity-0 w-0 pointer-events-none overflow-hidden' : 'opacity-100'}`}>
            <span className="text-lg block">NJ-Edc</span>
          </Link>
        </div>

        {/* Tabs */}
        {!isCollapsed && (
          <div className="px-4 py-2 flex gap-1 bg-gray-100 dark:bg-gray-700 mx-4 rounded-lg mb-4">
            <button className="flex-1 py-1.5 text-[11px] font-semibold bg-white dark:bg-gray-600 dark:text-white rounded-md shadow-sm">Oquv markaz</button>
            <button className="flex-1 py-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">Xususiy maktab</button>
          </div>
        )}

        {/* Nav */}
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive || isManagementOpen
                        ? 'bg-[#7C3AED] text-white shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <svg className={`w-5 h-5 flex-shrink-0 ${isActive || isManagementOpen ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {!isCollapsed && (
                      <span className="font-medium text-sm whitespace-nowrap flex-1 text-left">{item.name}</span>
                    )}
                    {!isCollapsed && (
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isManagementOpen ? 'rotate-180' : ''} ${isActive || isManagementOpen ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <svg className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap flex-1">{item.name}</span>}
                {item.hasCrown && !isCollapsed && (
                  <svg className="w-3 h-3 text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Subscription */}
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
              <button className="w-full bg-red-500 text-white py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
      </aside>

      {/* Management Flyout */}
      <div
        ref={flyoutRef}
        style={{
          left: isCollapsed ? '80px' : '256px',
          transition: 'transform 0.3s ease, opacity 0.3s ease, left 0.3s ease',
          transform: isManagementOpen ? 'translateX(0)' : 'translateX(-110%)',
          opacity: isManagementOpen ? 1 : 0,
          pointerEvents: isManagementOpen ? 'auto' : 'none',
        }}
        className="fixed top-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-2xl z-10"
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800 dark:text-white">Menu</h2>
            <button
              onClick={() => setIsManagementOpen(false)}
              className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
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
                  <svg className={`w-4 h-4 flex-shrink-0 ${isSubItemActive ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={subItem.icon} />
                  </svg>
                  <span className="text-sm">{subItem.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
