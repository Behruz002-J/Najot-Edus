import React, { useState } from 'react';

export default function Dashboard() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const stats = [
    { 
      title: "Sinflar", 
      value: "24", 
      change: "+2", 
      isIncrease: true,
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    },
    { 
      title: "Fanlar", 
      value: "18", 
      change: "+1", 
      isIncrease: true,
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    },
    { 
      title: "Talabalar", 
      value: "1,240", 
      change: "+12%", 
      isIncrease: true,
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    },
    { 
      title: "Sovg'alar", 
      value: "45", 
      change: "+5", 
      isIncrease: true,
      icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-8z"
    },
    { 
      title: "O'qituvchilar", 
      value: "84", 
      change: "+4%", 
      isIncrease: true,
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    },
  ];

  const schedule = [
    { id: 1, subject: "Frontend Dasturlash", teacher: "Aliyev Vali", time: "09:00 - 10:30", room: "302-xona" },
    { id: 2, subject: "Backend Dasturlash", teacher: "Karimova Aziza", time: "11:00 - 12:30", room: "405-xona" },
    { id: 3, subject: "UI/UX Dizayn", teacher: "Toshmatov G'ani", time: "14:00 - 15:30", room: "201-xona" },
    { id: 4, subject: "Mobil Ilova", teacher: "Rustamova Nargiza", time: "16:00 - 17:30", room: "108-xona" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow group cursor-default">
            <div className="mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
              <div className="mt-2 flex items-baseline gap-4">
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.isIncrease ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-6">
        {/* Schedule Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Schedule Header (Accordian Style) */}
          <button 
            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h2 className="text-sm font-semibold text-gray-700">Dars Jadvali</h2>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isScheduleOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Schedule Content */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScheduleOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-6 pb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-500">
                      <th className="pb-3 font-medium">Fan nomi</th>
                      <th className="pb-3 font-medium">O'qituvchi</th>
                      <th className="pb-3 font-medium">Vaqt</th>
                      <th className="pb-3 font-medium">Xona</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {schedule.map((item) => (
                      <tr key={item.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50">
                        <td className="py-4 font-medium text-gray-800">{item.subject}</td>
                        <td className="py-4 text-gray-600">{item.teacher}</td>
                        <td className="py-4 text-gray-600">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                            {item.time}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600">{item.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
