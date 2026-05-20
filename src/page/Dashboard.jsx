import React, { useState } from 'react';

export default function Dashboard() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const stats = [
    {
      title: "Faol talabalar",
      value: "1,240",
      change: "+12%",
      isIncrease: true,
      icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    },
    {
      title: "Guruhlar",
      value: "48",
      change: "+3",
      isIncrease: true,
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    },
    {
      title: "Joriy oy to'lovlar",
      value: "45.2M",
      change: "+8%",
      isIncrease: true,
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    },
    {
      title: "Qarzdorlar",
      value: "12",
      change: "-2",
      isIncrease: false,
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    },
    {
      title: "Muzlatilganlar",
      value: "8",
      change: "0",
      isIncrease: true,
      icon: "M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13M9 4l3 3 3-3M9 20l3-3 3 3M20 9l-3 3 3 3M4 9l3 3-3 3"
    },
    {
      title: "Arhivdagilar",
      value: "156",
      change: "+12",
      isIncrease: true,
      icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center justify-between hover:shadow-[0_0_20px_rgba(57,255,20,0.12)] hover:border-[#39FF14]/30 transition-all duration-300 group cursor-default">
            <div className="mb-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-[#7B2CBF] group-hover:bg-[#39FF14] group-hover:text-black transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-center w-full">
              <h3 className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">{stat.title}</h3>
              <div className="mt-1 flex justify-center">
                <span className="text-lg font-bold text-gray-800">{stat.value}</span>
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
                          <span className="bg-purple-50 text-[#7B2CBF] px-2 py-1 rounded font-medium">
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
