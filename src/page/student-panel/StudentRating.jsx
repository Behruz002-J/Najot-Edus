import React from "react";

export default function StudentRating() {
  const leaderboard = [
    { rank: 1, name: "Dilshodbek Rustamov", score: 980, isMe: false },
    { rank: 2, name: "Feruza Karimova", score: 950, isMe: false },
    { rank: 12, name: "Behruz Jumanov", score: 720, isMe: true },
    { rank: 13, name: "Malika Sobirova", score: 710, isMe: false }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Umumiy reyting</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Guruhdagi o'quvchilar reytingi va ballari</p>
      </div>

      <div className="space-y-3">
        {leaderboard.map((u) => (
          <div
            key={u.rank}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              u.isMe
                ? "bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40 shadow-sm"
                : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                u.rank === 1
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400"
                  : u.rank === 2
                  ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-700/60 dark:text-gray-400"
              }`}>
                {u.rank}
              </span>
              <span className={`text-sm font-semibold ${u.isMe ? "text-purple-700 dark:text-purple-400" : "text-gray-850 dark:text-gray-200"}`}>
                {u.name} {u.isMe && "(Siz)"}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{u.score} ball</span>
          </div>
        ))}
      </div>
    </div>
  );
}
