import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab state
  const [activeTab, setActiveTab] = useState('info');
  const [alertMessage, setAlertMessage] = useState(null);

  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Hardcoded or dynamically fallback group data
  const defaultGroups = {
    '1': {
      name: 'Bootcamp Full Stack N26',
      status: 'FAOL',
      course: 'Backend',
      duration: '6.0',
      teacher: 'Mohirbek',
      studentsCount: 4,
      room: 'Autodesk',
      avgAge: 15,
      capacity: 20,
      monthlyLessons: 20,
      totalLessons: 20
    },
    '2': {
      name: 'Bootcamp Full Stack n105',
      status: 'FAOL',
      course: 'Backend',
      duration: '6.0',
      teacher: 'Mohirbek',
      studentsCount: 4,
      room: 'Autodesk',
      avgAge: 16,
      capacity: 20,
      monthlyLessons: 20,
      totalLessons: 20
    }
  };

  const currentGroup = defaultGroups[id] || defaultGroups['1'];

  // Tab content visibility
  const [isMentorsVisible, setIsMentorsVisible] = useState(true);
  const [isParamsVisible, setIsParamsVisible] = useState(true);
  const [subTab, setSubTab] = useState('homework');

  return (
    <div className="space-y-6 relative">
      {/* Alert/Snackbar Notification */}
      {alertMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-[#ED6C02] text-white rounded-xl shadow-lg border border-orange-500 font-bold text-sm">
            <svg className="w-5 h-5 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/groups')}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{currentGroup.name}</h1>
            <span className="px-2.5 py-0.5 bg-green-100 dark:bg-green-900/35 text-green-600 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentGroup.status === 'FAOL' ? 'Aktiv' : 'Faol emas'}
            </span>
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-bold text-sm">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          Statistika
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-px">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'info' ? 'text-[#7C3AED] dark:text-purple-400' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Ma'lumotlar
          {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />}
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'syllabus' ? 'text-[#7C3AED] dark:text-purple-400' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Guruh darsliklari
          {activeTab === 'syllabus' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />}
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === 'attendance' ? 'text-[#7C3AED] dark:text-purple-400' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Akademik davomati
          {activeTab === 'attendance' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />}
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px]">
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative z-10">
            {/* Guruh mentorlari Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#3B82F6] px-6 py-4 flex items-center justify-between text-white">
                <h3 className="font-bold text-[15px]">Guruh mentorlari</h3>
                <button 
                  onClick={() => setIsMentorsVisible(!isMentorsVisible)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  {isMentorsVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </button>
              </div>
              {isMentorsVisible && (
                <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentGroup.teacher}`} 
                      alt={currentGroup.teacher} 
                      className="w-14 h-14 rounded-full bg-blue-50 dark:bg-gray-700 border border-blue-100 dark:border-gray-600 object-cover" 
                    />
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                        Teacher
                      </span>
                      <h4 className="text-base font-bold text-gray-800 dark:text-white">{currentGroup.teacher}</h4>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Parametrlar Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#3B82F6] px-6 py-4 flex items-center justify-between text-white">
                <h3 className="font-bold text-[15px]">Parametrlar</h3>
                <button 
                  onClick={() => setIsParamsVisible(!isParamsVisible)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  {isParamsVisible ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                    </svg>
                  )}
                </button>
              </div>
              {isParamsVisible && (
                <div className="p-6 divide-y divide-gray-100 dark:divide-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Kurs:</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.course}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">O'rta yosh:</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.avgAge}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">O'quvchilar sig'imi:</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mavjud o'quvchilar:</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.studentsCount}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">O'quv oyidagi darslar soni:</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.monthlyLessons}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Kurs davomiyligi (oy):</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jami darslar soni:</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">{currentGroup.totalLessons}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dars jadvali Section */}
            <div className="col-span-1 md:col-span-2 mt-8 space-y-4 z-10 relative">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Dars jadvali</h3>
              
              <div className="space-y-3">
                {/* Row 1 */}
                <div className="bg-white dark:bg-gray-800 p-5 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Mohirbek</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[120px]">
                    Du/Se/Ch/Pa/Ju
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-white min-w-[150px]">
                    09:30 dan - 12:30 gacha
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[180px]">
                    15 Yan, 2026 - 27 Iyun, 2026
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    F2 Autodesk // 18
                  </div>
                </div>

                {/* Row 2 */}
                <div className="bg-white dark:bg-gray-800 p-5 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">+++Yusupova Barchinoy</span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[120px]">
                    Du/Se/Ch/Pa/Ju
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-white min-w-[150px]">
                    08:00 dan - 09:30 gacha
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[180px]">
                    15 Yan, 2026 - 27 Iyun, 2026
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    F2 Autodesk // 18
                  </div>
                </div>
              </div>

              {/* Yana ko'rsatish Button */}
              <div className="flex justify-center pt-2">
                <button className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  Yana ko'rsatish (9)
                </button>
              </div>
            </div>

            {/* Giant light gray watermark number at the bottom */}
            <div className="absolute left-1/2 bottom-[150px] -translate-x-1/2 pointer-events-none select-none text-[200px] font-black text-gray-200/25 dark:text-gray-800/10 z-0">
              38645
            </div>

            {/* O'quv oyi & Kunlar Carousel */}
            <div className="col-span-1 md:col-span-2 mt-8 border-t border-gray-100 dark:border-gray-800 pt-8 space-y-6 z-10 relative">
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-gray-800 dark:text-white">1-o'quv oyi</span>
                <button className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Horizontal Date carousel */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                {[
                  { month: 'May', day: '2', active: true },
                  { month: 'May', day: '5', active: true },
                  { month: 'May', day: '7', active: true },
                  { month: 'May', day: '9', active: true },
                  { month: 'May', day: '12', active: true },
                  { month: 'May', day: '14', active: false },
                  { month: 'May', day: '16', active: false },
                  { month: 'May', day: '19', active: false },
                  { month: 'May', day: '21', active: false },
                  { month: 'May', day: '23', active: false },
                  { month: 'May', day: '26', active: false },
                  { month: 'May', day: '28', active: false },
                  { month: 'May', day: '30', active: false },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      if (item.active) {
                        navigate(`/dashboard/groups/${id || '1'}/lesson/${item.day}`);
                      } else {
                        triggerAlert("Dars vaqti hali kelmagan");
                      }
                    }}
                    className={`flex flex-col items-center justify-center min-w-[64px] h-[72px] rounded-2xl border transition-all ${
                      item.active 
                        ? 'bg-gray-100 dark:bg-gray-700/40 border-gray-100 dark:border-gray-700/80 text-gray-400 dark:text-gray-500 cursor-pointer hover:border-[#7C3AED]' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#7C3AED] dark:hover:border-purple-400 cursor-pointer shadow-sm'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.month}</span>
                    <span className="text-lg font-black mt-0.5">{item.day}</span>
                  </div>
                ))}
              </div>

              {/* Barchasini ko'rish Button */}
              <div className="flex justify-center pt-2">
                <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  Barchasini ko'rish
                </button>
              </div>
            </div>

            {/* Bottom-right watermark logo/motif */}
            <div className="absolute right-4 bottom-2 opacity-[0.12] pointer-events-none select-none dark:opacity-[0.05]">
              <svg className="w-14 h-14 text-amber-600 dark:text-amber-400" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 20 C60 10, 80 10, 80 35 C80 50, 60 70, 50 80 C40 70, 20 50, 20 35 C20 10, 40 10, 50 20 Z" />
                <path d="M50 30 C55 20, 70 20, 70 40 C70 50, 55 65, 50 72 C45 65, 30 50, 30 40 C30 20, 45 20, 50 30 Z" opacity="0.6" />
              </svg>
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-6 flex-wrap">
                <h3 className="text-lg font-black text-gray-800 dark:text-white">Guruh darsliklari</h3>
                
                {/* Pill sub-tabs */}
                <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                  {[
                    { id: 'homework', label: 'Uyga vazifa' },
                    { id: 'videos', label: 'Videolar' },
                    { id: 'exams', label: 'Imtihonlar' },
                    { id: 'journal', label: 'Jurnal' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSubTab(tab.id)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        subTab === tab.id
                          ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm'
                          : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Homework button */}
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-100/50 dark:shadow-none transition-colors cursor-pointer">
                Uyga vazifa qo'shish
              </button>
            </div>

            {/* Table or Placeholder based on subTab */}
            {subTab === 'homework' ? (
              <div className="overflow-x-auto no-scrollbar border border-gray-100 dark:border-gray-700/50 rounded-2xl">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-700/10">
                      <th className="py-4 px-4 text-center w-12">#</th>
                      <th className="py-4 px-4">Mavzu</th>
                      <th className="py-4 px-4 text-center w-16">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg text-sm font-bold" title="Talabalar soni">👤</span>
                      </th>
                      <th className="py-4 px-4 text-center w-16">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg text-sm font-bold" title="Kutilmoqda">⏱️</span>
                      </th>
                      <th className="py-4 px-4 text-center w-16">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg text-sm font-bold" title="Tekshirilgan">✅</span>
                      </th>
                      <th className="py-4 px-4">Berilgan vaqt</th>
                      <th className="py-4 px-4">Tugash vaqti</th>
                      <th className="py-4 px-4">Dars sanasi</th>
                      <th className="py-4 px-4 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {[
                      { id: 1, topic: 'Html asoslari', students: 4, pending: 0, completed: 0, givenTime: '13 May, 2026 10:00', endTime: '14 May, 2026 06:00', lessonDate: '12 May, 2026' },
                      { id: 2, topic: 'Kirish', students: 4, pending: 0, completed: 0, givenTime: '13 May, 2026 11:52', endTime: '14 May, 2026 07:52', lessonDate: '9 May, 2026' },
                      { id: 3, topic: 'Nodejs', students: 4, pending: 2, completed: 0, givenTime: '14 May, 2026 09:47', endTime: '15 May, 2026 05:47', lessonDate: '14 May, 2026' }
                    ].map((hw) => (
                      <tr key={hw.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors">
                        <td className="py-4 px-4 text-center font-bold text-gray-400 dark:text-gray-500 text-xs">{hw.id}</td>
                        <td className="py-4 px-4 font-bold text-gray-800 dark:text-white text-sm">{hw.topic}</td>
                        <td className="py-4 px-4 text-center font-bold text-gray-700 dark:text-gray-300 text-sm">{hw.students}</td>
                        <td className={`py-4 px-4 text-center font-bold text-sm ${hw.pending > 0 ? 'text-amber-500 font-extrabold' : 'text-gray-400 dark:text-gray-600'}`}>{hw.pending}</td>
                        <td className={`py-4 px-4 text-center font-bold text-sm ${hw.completed > 0 ? 'text-emerald-500 font-extrabold' : 'text-gray-400 dark:text-gray-600'}`}>{hw.completed}</td>
                        <td className="py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">{hw.givenTime}</td>
                        <td className="py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">{hw.endTime}</td>
                        <td className="py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300">{hw.lessonDate}</td>
                        <td className="py-4 px-4 text-center">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500 font-semibold text-sm">
                Ushbu bo'lim hozircha bo'sh
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Akademik davomati</h3>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <th className="py-3 pr-4">Talaba nomi</th>
                    {['12.05', '14.05', '16.05', '19.05', '21.05', '23.05'].map((date) => (
                      <th key={date} className="py-3 px-3 text-center">{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {[
                    { name: 'Ali Valiyev', attendance: [true, true, false, true, true, true] },
                    { name: 'Salim Qodirov', attendance: [true, false, true, true, false, true] },
                    { name: 'Bobur', attendance: [true, true, true, true, true, true] },
                    { name: 'Qodir Salimov', attendance: [false, true, false, true, true, false] },
                  ].map((student, sIdx) => (
                    <tr key={sIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-sm text-gray-800 dark:text-white">{student.name}</td>
                      {student.attendance.map((present, aIdx) => (
                        <td key={aIdx} className="py-4 px-3 text-center">
                          <span className={`inline-flex p-1.5 rounded-full ${
                            present 
                              ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400' 
                              : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                          }`}>
                            {present ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
