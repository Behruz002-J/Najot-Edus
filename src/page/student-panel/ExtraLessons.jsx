import React from "react";

export default function ExtraLessons() {
  const lessons = [
    { id: 1, title: "Git & GitHub bilan ishlash", teacher: "Islomxo'ja", duration: "1 soat 30 daqiqa", level: "Boshlang'ich" },
    { id: 2, title: "Docker asoslari", teacher: "Davronbek", duration: "2 soat 15 daqiqa", level: "O'rta" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Qo'shimcha darslar & Workshoplar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Asosiy darslardan tashqari o'tkaziladigan foydali darslar ro'yxati</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((l) => (
          <div key={l.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-700 p-5 space-y-4 hover:shadow-sm transition-shadow">
            <div className="space-y-1">
              <span className="bg-purple-50 dark:bg-purple-950/40 text-[#7C3AED] dark:text-purple-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                {l.level}
              </span>
              <h3 className="font-bold text-gray-800 dark:text-white pt-1">{l.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ustoz: {l.teacher}</p>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-50 dark:border-gray-700/50">
              <span>Davomiyligi: {l.duration}</span>
              <button className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                Videoni ko'rish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
