import React, { useState, useEffect } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import AddGroupModal from '../../components/AddGroupModal';
import axiosClient from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

const MAP_DAYS = {
  MONDAY: 'Du',
  TUESDAY: 'Se',
  WEDNESDAY: 'Chor',
  THURSDAY: 'Pay',
  FRIDAY: 'Ju',
  SATURDAY: 'Shan',
  SUNDAY: 'Yak'
};

export default function Groups({ isGathering }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('groups');
  const { isGroupModalOpen, setIsGroupModalOpen } = useOutletContext();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = window.localStorage.getItem("role") || "TEACHER";

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const endpoint = (activeTab === 'groups' || isGathering) ? '/groups/all' : '/groups/archive';
      const res = await axiosClient.get(endpoint);
      const data = res?.data;
      let groupsData = [];

      if (Array.isArray(data)) {
        groupsData = data;
      } else if (Array.isArray(data?.data)) {
        groupsData = data.data;
      }

      const mapped = groupsData.map(item => {
        const daysStr = Array.isArray(item.week_day) 
          ? item.week_day.map(d => MAP_DAYS[d] || d).join(', ') 
          : '—';
        
        const teacherStr = Array.isArray(item.teachers) && item.teachers.length > 0
          ? item.teachers.map(t => t.full_name).join(', ')
          : '—';

        // Support both active API (course, room) and archive API (courses, rooms) properties
        const courseName = item.courses?.name || item.course?.name || '—';
        const durationMonth = item.courses?.duration_month || item.course?.duration_month;
        const roomName = item.rooms?.name || item.room || '—';

        return {
          id: item.id,
          status: activeTab === 'archive' || item.is_active === false ? 'FAOL EMAS' : 'FAOL',
          name: item.name || '—',
          course: courseName,
          duration: durationMonth ? `${durationMonth} oy` : '—',
          time: item.start_time || '—',
          days: daysStr,
          room: roomName,
          teacher: teacherStr,
          students: item.student_count || item.students?.length || 0
        };
      });

      // Fetch local groups & inject default mock groups if missing
      let localGroups = JSON.parse(window.localStorage.getItem("local_groups") || "[]");
      const defaultMockGroups = [
        {
          id: "mock-n26",
          status: "FAOL",
          name: "N26",
          course: "Backend",
          duration: "6 oy",
          time: "09:30",
          days: "Du, Se, Chor, Pay, Ju",
          room: "Autodesk",
          teacher: window.localStorage.getItem("username") || "Behruz Jumanov",
          students: 2
        },
        {
          id: "mock-n105",
          status: "FAOL",
          name: "n105",
          course: "Backend",
          duration: "6 oy",
          time: "16:00",
          days: "Se, Pay, Shan",
          room: "Autodesk",
          teacher: window.localStorage.getItem("username") || "Behruz Jumanov",
          students: 5
        },
        {
          id: "mock-n25",
          status: "FAOL",
          name: "n25",
          course: "Backend",
          duration: "6 oy",
          time: "14:00",
          days: "Du, Se, Chor, Pay, Ju",
          room: "Autodesk",
          teacher: window.localStorage.getItem("username") || "Behruz Jumanov",
          students: 0
        }
      ];

      let updated = false;
      defaultMockGroups.forEach(mockG => {
        if (!localGroups.some(g => g.name.toLowerCase() === mockG.name.toLowerCase())) {
          localGroups.push(mockG);
          updated = true;
        }
      });
      if (updated || !window.localStorage.getItem("local_groups")) {
        window.localStorage.setItem("local_groups", JSON.stringify(localGroups));
      }

      const filteredLocal = localGroups.filter(lg => {
        const isGroupActive = lg.status === 'FAOL';
        if (isGathering) return !isGroupActive; // gathering groups are not yet active
        if (activeTab === 'groups') return isGroupActive;
        return !isGroupActive;
      });

      // Merge & deduplicate by name
      const merged = [...filteredLocal];
      mapped.forEach(mg => {
        if (!merged.some(lg => lg.name.toLowerCase() === mg.name.toLowerCase())) {
          merged.push(mg);
        }
      });

      // Filter groups by user role and group state
      let finalGroups = merged;
      if (isGathering) {
        finalGroups = merged.filter(g => g.status === 'FAOL EMAS');
      } else if (activeTab === 'groups') {
        finalGroups = merged.filter(g => g.status === 'FAOL');
      } else {
        finalGroups = merged.filter(g => g.status === 'FAOL EMAS');
      }

      // Filter by teacher name if role is TEACHER
      if (role === 'TEACHER') {
        const loggedInTeacher = (window.localStorage.getItem("username") || "").trim().toLowerCase();
        if (loggedInTeacher) {
          const matched = finalGroups.filter(g => 
            g.teacher && g.teacher.toLowerCase().includes(loggedInTeacher)
          );
          // Only apply filter if there are actually matched groups to avoid rendering empty list
          // if usernames are formatted differently in DB
          if (matched.length > 0) {
            finalGroups = matched;
          }
        }
      }

      setGroups(finalGroups);
    } catch (err) {
      console.error('Fetch groups error, using local fallback:', err?.response?.data || err.message);
      
      const localGroups = JSON.parse(window.localStorage.getItem("local_groups") || "[]");
      const filteredLocal = localGroups.filter(lg => {
        const isGroupActive = lg.status === 'FAOL';
        if (isGathering) return !isGroupActive;
        if (activeTab === 'groups') return isGroupActive;
        return !isGroupActive;
      });

      setGroups(filteredLocal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [activeTab, isGathering]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'FAOL' ? 'FAOL EMAS' : 'FAOL';
    try {
      setGroups(prev => prev.map(group => 
        group.id === id ? { ...group, status: newStatus } : group
      ));
      
      await axiosClient.patch(`/groups/${id}`, {
        is_active: newStatus === 'FAOL'
      });
      
      // Refresh list to reflect state changes
      fetchGroups();
    } catch (err) {
      console.error('Toggle status error:', err?.response?.data || err.message);
      setGroups(prev => prev.map(group => 
        group.id === id ? { ...group, status: currentStatus } : group
      ));
      alert("Statusni o'zgartirishda xatolik yuz berdi!");
    }
  };

  const totalTeachers = [...new Set(groups.flatMap(g => g.teacher ? g.teacher.split(', ') : []))].filter(t => t && t !== '—').length;
  const totalStudents = groups.reduce((acc, curr) => acc + (curr.students || 0), 0);
  const filteredGroups = groups;

  const stats = [
    { label: t('nav.groups'), value: loading ? '...' : String(groups.length), icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { label: t('nav.teachers'), value: loading ? '...' : String(totalTeachers), icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { label: t('nav.students'), value: loading ? '...' : String(totalStudents), icon: (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM12 7a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isGathering ? "Yig'ilayotgan guruhlar" : "Guruhlar"}
        </h1>
      </div>

      {/* Tabs */}
      {!isGathering && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              activeTab === 'groups'
                ? 'bg-white dark:bg-gray-850 text-gray-850 dark:text-white shadow-sm border-gray-200 dark:border-gray-700'
                : 'bg-transparent text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            Guruhlar
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
              activeTab === 'archive'
                ? 'bg-white dark:bg-gray-850 text-gray-855 dark:text-white shadow-sm border-gray-200 dark:border-gray-700'
                : 'bg-transparent text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Arxiv
          </button>
        </div>
      )}

      {/* Stats Cards (hidden for teachers) */}
      {role !== 'TEACHER' && !isGathering && (
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
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-gray-800 text-[12px] font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Guruh nomi</th>
                <th className="px-6 py-4 text-center">Kurs</th>
                <th className="px-6 py-4 text-center">Davomiyligi</th>
                <th className="px-6 py-4 text-center">Dars vaqti</th>
                <th className="px-6 py-4">Xona</th>
                <th className="px-6 py-4">O'qituvchi</th>
                <th className="px-6 py-4 text-center">Talabalar</th>
                <th className="px-6 py-4 text-right">
                  <svg 
                    onClick={fetchGroups}
                    className={`w-4 h-4 ml-auto cursor-pointer hover:text-[#7C3AED] transition-colors ${loading ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-400 font-semibold text-sm">
                    <div className="flex items-center justify-center gap-3">
                      <svg className="animate-spin w-5 h-5 text-[#7C3AED]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('common.loading')}
                    </div>
                  </td>
                </tr>
              ) : filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-16 text-gray-400 font-semibold text-sm">
                    Guruhlar topilmadi
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => (
                  <tr 
                    key={group.id} 
                    onClick={() => navigate(`/dashboard/groups/${group.id}`)}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={group.status === 'FAOL'} 
                            onChange={() => toggleStatus(group.id, group.status)}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-[#7C3AED]"></div>
                        </label>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                          group.status === 'FAOL' 
                            ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800' 
                            : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800'
                        }`}>
                          {group.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        to={`/dashboard/groups/${group.id}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-bold text-gray-800 dark:text-white hover:text-[#7C3AED] dark:hover:text-purple-400 transition-colors"
                      >
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
                        <span className="text-xs font-bold text-gray-805 dark:text-white">{group.time}</span>
                        <span className="text-[9px] text-gray-400 font-medium">{group.days}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{group.room}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-800 dark:text-white">
                        {role === 'TEACHER' ? '' : group.teacher}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-gray-800 dark:text-white">{group.students}</span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 text-gray-300 hover:text-gray-500 transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        onAddSuccess={fetchGroups}
      />
    </div>
  );
}
