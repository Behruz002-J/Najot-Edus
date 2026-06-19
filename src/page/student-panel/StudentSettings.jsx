import React, { useState } from "react";

export default function StudentSettings() {
  const [phone, setPhone] = useState(window.localStorage.getItem("username") || "");
  const [lang, setLang] = useState("uz");

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Sozlamalar</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Profil ma'lumotlarini tahrirlash</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Foydalanuvchi nomi / Telefon
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled
            className="w-full px-4 py-2 border border-gray-250 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-750 text-gray-500 cursor-not-allowed text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Asosiy interfeys tili
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full px-4 py-2 border border-gray-250 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="uz">O'zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-50 dark:border-gray-700/60 flex justify-end">
          <button className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
