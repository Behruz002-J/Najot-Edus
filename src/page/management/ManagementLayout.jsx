import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const tabs = [
  { name: 'Kurslar',        path: '/dashboard/management/courses' },
  { name: 'Xonalar',        path: '/dashboard/management/rooms' },
  { name: 'Filiallar',      path: '/dashboard/management/branch' },
  { name: 'Hodimlar',       path: '/dashboard/management/staff' },
  { name: 'Rollar',         path: '/dashboard/management/roles' },
  { name: 'Coin',           path: '/dashboard/management/coin' },
  { name: 'Sabablar',       path: '/dashboard/management/reasons' },
  { name: 'Xabar yuborish', path: '/dashboard/management/message' },
  { name: 'FAQ',            path: '/dashboard/management/faq' },
  { name: 'Tekshiruv',      path: '/dashboard/management/check' },
];

export default function ManagementLayout() {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Boshqarish</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ushbu sahifada siz sovg'alarni boshqarish imkoniyatiga ega bo'lasiz. Har bir sovg'a haqida batafsil ma'lumot va yangi sovg'a qo'shish imkoniyat bor.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  isActive
                    ? 'border-[#7C3AED] text-[#7C3AED] dark:text-purple-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-300'
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
}
