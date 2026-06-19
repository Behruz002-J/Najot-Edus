import React from "react";

export default function StudentDashboard() {
  const username = window.localStorage.getItem("username") || "Talaba";

  const stats = [
    {
      title: "Mening Coinlarim",
      value: "150",
      change: "+25 yaqinda",
      color: "from-amber-500 to-orange-600",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      )
    },
    {
      title: "Davomat ko'rsatkichi",
      value: "94%",
      change: "Yaxshi",
      color: "from-green-500 to-emerald-600",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Reyting o'rni",
      value: "12-o'rin",
      change: "Guruhda",
      color: "from-purple-500 to-indigo-600",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Vazifalar",
      value: "8 / 10",
      change: "80% bajarildi",
      color: "from-blue-500 to-indigo-600",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-8 rounded-2xl shadow-md">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-2xl" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Xush kelibsiz, <span className="text-amber-400">{username}</span>!
          </h1>
          <p className="text-purple-100 max-w-xl text-sm font-medium">
            Najot Edu o'quv platformasiga xush kelibsiz. Bugungi darslar va topshiriqlarni ko'rib chiqishingiz mumkin.
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
