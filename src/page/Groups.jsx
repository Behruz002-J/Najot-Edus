import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import AddGroupModal from '../components/AddGroupModal';

export default function Groups() {
  const [activeTab, setActiveTab] = useState('groups');
  const { isGroupModalOpen, setIsGroupModalOpen } = useOutletContext();

  const stats = [
    { label: 'Jami guruhlar', value: '2', icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { label: "O'qituvchilar", value: '0', icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { label: "O'quvchilar", value: '0', icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 7a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    )},
  ];

  const [groups, setGroups] = useState([
    {
      id: 1,
      status: 'FAOL',
      name: 'N26',
      course: 'Backend',
      duration: '6 oy',
      time: '09:30',
      days: 'Du, Se, Chor, Pay, Ju',
      room: 'Autodesk',
      teacher: 'Mohirbek',
      students: 1
    },
    {
      id: 2,
      status: 'FAOL',
      name: 'n105',
      course: 'Backend',
      duration: '6 oy',
      time: '16:00',
      days: 'Se, Pay, Shan',
      room: 'Autodesk',
      teacher: 'Mohirbek',
      students: 4
    }
  ]);

  const toggleStatus = (id) => {
    setGroups(prev => prev.map(group => 
      group.id === id 
        ? { ...group, status: group.status === 'FAOL' ? 'FAOL EMAS' : 'FAOL' } 
        : group
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Guruhlar</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-px">
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'groups' ? 'text-gray-800 dark:text-white' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Guruhlar
          {activeTab === 'groups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />}
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'archive' ? 'text-gray-800 dark:text-white' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Arxiv
          {activeTab === 'archive' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <button className="text-gray-300 hover:text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
            </div>
            {stat.label === "O'quvchilar" && (
              <div className="absolute right-6 bottom-6 flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] font-bold text-white ${i === 1 ? 'bg-orange-500' : i === 2 ? 'bg-blue-500' : 'bg-pink-500'}`}>
                    {i === 1 ? 'M' : i === 2 ? 'S' : 'A'}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-50 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-700/50 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Guruh nomi</th>
                <th className="px-6 py-4 text-center">Kurs</th>
                <th className="px-6 py-4 text-center">Davomiyligi</th>
                <th className="px-6 py-4 text-center">Dars vaqti</th>
                <th className="px-6 py-4">Xona</th>
                <th className="px-6 py-4">O'qituvchi</th>
                <th className="px-6 py-4 text-center">Talabalar</th>
                <th className="px-6 py-4 text-right">
                  <svg className="w-4 h-4 ml-auto cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={group.status === 'FAOL'} 
                          onChange={() => toggleStatus(group.id)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#7C3AED]"></div>
                      </label>
                      <span className={`text-[10px] font-bold tracking-wider ${group.status === 'FAOL' ? 'text-green-500' : 'text-red-500'}`}>
                        {group.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/dashboard/groups/${group.id}`} className="text-sm font-bold text-gray-800 dark:text-white hover:text-[#7C3AED] dark:hover:text-purple-400 transition-colors">
                      {group.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                      {group.course}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{group.duration}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 dark:text-white">{group.time}</span>
                      <span className="text-[9px] text-gray-400 font-medium">{group.days}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{group.room}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-800 dark:text-white">{group.teacher}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{group.students}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-gray-300 hover:text-gray-500 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
      />
    </div>
  );
}
