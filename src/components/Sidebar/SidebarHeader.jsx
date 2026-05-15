import React from 'react';
import { Link } from 'react-router-dom';
import coinsImg from '../../assets/images/coins.webp';

export default function SidebarHeader({ isCollapsed, setIsCollapsed }) {
  return (
    <>
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
          <span className="text-lg block text-[#7C3AED]">NajotEdu</span>
        </Link>
      </div>


    </>
  );
}
