import React from "react";

export default function StudentMetrics() {
  const metrics = [
    { name: "Nazariy topshiriqlar", score: 85, color: "bg-blue-500" },
    { name: "Amaliy loyihalar", score: 90, color: "bg-emerald-500" },
    { name: "Imtihon natijalari", score: 78, color: "bg-amber-500" },
    { name: "Darsdagi faollik", score: 95, color: "bg-purple-500" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">O'zlashtirish ko'rsatkichlarim</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Fanlar va mavzular bo'yicha o'rtacha ko'rsatkichlaringiz</p>
      </div>

      <div className="space-y-5">
        {metrics.map((m, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{m.name}</span>
              <span className="font-bold text-gray-900 dark:text-white">{m.score}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${m.color} rounded-full transition-all duration-500`} style={{ width: `${m.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
