import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const STATUS_CONFIG = {
  "Qaytarilgan":   { bg: "bg-[#f3a022]",   text: "text-white" },
  "Qabul qilingan":{ bg: "bg-[#5cb85c]",   text: "text-white" },
  "Berilmagan":    { bg: "bg-[#777777]",   text: "text-white" },
  "Bajarilmagan":  { bg: "bg-[#d9534f]",   text: "text-white" },
};

const homeworkData = [
  { id: 1, topic: "NextJs",          video: 0, status: "Qaytarilgan",    deadline: "2026 M06 11 20:00", lessonDate: "2026 M06 11" },
  { id: 2, topic: "crm loyihasi",    video: 2, status: "Qabul qilingan", deadline: "2026 M06 09 20:00", lessonDate: "2026 M06 09" },
  { id: 3, topic: "Imtihon",         video: 0, status: "Qabul qilingan", deadline: "2026 M06 02 20:00", lessonDate: "2026 M06 02" },
  { id: 4, topic: "State and Props", video: 1, status: "Berilmagan",     deadline: "-",                 lessonDate: "2026 M05 21" },
  { id: 5, topic: "takrorlash",      video: 1, status: "Bajarilmagan",   deadline: "2026 M05 19 20:00", lessonDate: "2026 M05 19" },
  { id: 6, topic: "Nodejs",          video: 1, status: "Qabul qilingan", deadline: "2026 M05 14 20:00", lessonDate: "2026 M05 14" },
  { id: 7, topic: "Html asoslari",   video: 1, status: "Qaytarilgan",    deadline: "2026 M05 12 20:00", lessonDate: "2026 M05 12" },
  { id: 8, topic: "CSS asoslari",    video: 1, status: "Bajarilmagan",   deadline: "2026 M05 08 20:00", lessonDate: "2026 M05 08" },
];

const ALL_STATUSES = ["Barchasi", "Qaytarilgan", "Qabul qilingan", "Berilmagan", "Bajarilmagan"];

export default function StudentGroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Barchasi");
  const [group, setGroup] = useState(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);

  useEffect(() => {
    // Load group details from local storage or fallback to mock data
    const localGroups = JSON.parse(localStorage.getItem("local_groups") || "[]");
    let found = localGroups.find((g) => String(g.id) === String(id));

    if (!found) {
      // Mock details matching standard dummy data
      found = {
        id: id || "1",
        name: "n105",
        course: "ReactJS & NextJS",
        teacher: "Behruz Jumanov",
        teacherPhone: "+998 90 123 45 67",
        teacherEmail: "behruz.jumanov@najottedu.uz",
        teacherTelegram: "behruz_jumanov",
        status: "Faol",
        start_date: "2026-05-01"
      };
    } else {
      // Set defaults for teacher fields if missing
      if (!found.teacher) found.teacher = "O'qituvchi";
      if (!found.course) found.course = found.courses?.name || found.course?.name || "Frontend";
      if (!found.teacherPhone) found.teacherPhone = "+998 93 555 44 33";
      if (!found.teacherEmail) found.teacherEmail = "mentor@najottedu.uz";
      if (!found.teacherTelegram) found.teacherTelegram = "najottedu_mentor";
    }
    setGroup(found);
  }, [id]);

  const filtered = filter === "Barchasi"
    ? homeworkData
    : homeworkData.filter((h) => h.status === filter);

  if (!group) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        Yuklanmoqda...
      </div>
    );
  }

  const teacherInitial = group.teacher[0]?.toUpperCase() || "O";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate("/dashboard/my-groups")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors w-fit group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Guruhlarga qaytish
        </button>
      </div>

      {/* Title + Filter — kartadan tashqarida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Darslar va Vazifalar</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Guruh bo'yicha uy vazifalari va dars materiallari ro'yxati</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Holat:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-orange-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer min-w-[150px] shadow-sm"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50">
                <th className="py-4 px-8">Mavzular</th>
                <th className="py-4 px-6">Video dars</th>
                <th className="py-4 px-6">Uyga vazifa Holati</th>
                <th className="py-4 px-6">Uyga vazifa muddati</th>
                <th className="py-4 px-6">Dars sanasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {filtered.map((row) => {
                const cfg = STATUS_CONFIG[row.status] || { bg: "bg-gray-400", text: "text-white" };
                return (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`homework/${row.id}`)}
                    className="hover:bg-orange-50/20 dark:hover:bg-gray-700/20 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-8 text-sm text-gray-800 dark:text-gray-200 font-semibold">
                      {row.topic}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-sky-400 text-xs font-bold text-sky-500 dark:text-sky-400 hover:bg-sky-400 hover:text-white transition-colors cursor-default">
                        {row.video}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center justify-center w-[110px] py-1.5 rounded-md text-[13px] font-semibold text-center select-none ${cfg.bg} ${cfg.text}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {row.deadline}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">
                      {row.lessonDate}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                    Ma'lumotlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Profile Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowTeacherModal(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[28px] shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 flex flex-col">
            
            {/* Header/Banner */}
            <div className="h-28 bg-gradient-to-br from-orange-500 to-red-600 relative flex items-end justify-center">
              <button
                onClick={() => setShowTeacherModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Avatar */}
            <div className="flex justify-center -mt-12 mb-4 relative">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 bg-orange-400 text-white flex items-center justify-center text-3xl font-extrabold shadow-md">
                {teacherInitial}
              </div>
            </div>

            {/* Teacher Details */}
            <div className="px-6 pb-6 text-center space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {group.teacher}
                </h3>
                <p className="text-sm font-semibold text-orange-500 dark:text-orange-400 mt-1">
                  Mentor / O'qituvchi
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 text-left space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Telefon raqam</p>
                    <a
                      href={`tel:${group.teacherPhone}`}
                      className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-orange-500 transition-colors"
                    >
                      {group.teacherPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                    {/* Telegram Icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.57-3.27 3.6-1.5 4.35-1.76 4.84-1.77.11 0 .35.03.5.16.12.1.16.24.18.33.02.09.02.26.01.37z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Telegram</p>
                    <a
                      href={`https://t.me/${group.teacherTelegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-orange-500 transition-colors"
                    >
                      @{group.teacherTelegram}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors">
                  <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Elektron pochta</p>
                    <a
                      href={`mailto:${group.teacherEmail}`}
                      className="text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-orange-500 transition-colors"
                    >
                      {group.teacherEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex gap-3">
                <a
                  href={`https://t.me/${group.teacherTelegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-[#229ED9] hover:bg-[#1f8fc4] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  Telegramda bog'lanish
                </a>
                <button
                  onClick={() => setShowTeacherModal(false)}
                  className="py-3 px-5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm transition-colors"
                >
                  Yopish
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

