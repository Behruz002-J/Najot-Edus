import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function LessonAttendance() {
  const { groupId, date } = useParams();
  const navigate = useNavigate();

  // Alert/Snackbar notification state
  const [alertMessage, setAlertMessage] = useState(null);
  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Map of past dates to topics
  const pastLessons = {
    2: {
      topic: "JavaScript Kirish va Asoslar",
      desc: "JS tarixi, sintaksisi va birinchi script",
    },
    5: {
      topic: "O'zgaruvchilar va Ma'lumot Turlari",
      desc: "let, const, var farqlari va JS turlari",
    },
    7: {
      topic: "Funksiyalar va Obyektlar",
      desc: "Function expression vs declaration, basic objects",
    },
    9: {
      topic: "Array metodlari va massivlar bilan ishlash",
      desc: "map, filter, reduce va boshqa metodlar",
    },
    12: {
      topic: "DOM bilan ishlash",
      desc: "Elementlarni tanlash, event listeners va boshqarish",
    },
  };

  const initialLesson = pastLessons[date] || { topic: "Nodejs", desc: "" };

  // Radio selection state
  const [topicType, setTopicType] = useState(
    pastLessons[date] ? "syllabus" : "other",
  ); // 'syllabus' or 'other'

  // Topic states
  const [topicName, setTopicName] = useState(initialLesson.topic);
  const [description, setDescription] = useState(initialLesson.desc);

  // Active Role Tab State ('teacher' or 'assistant')
  const [activeRole, setActiveRole] = useState("teacher");

  // Expanded months state: when true show all dates for that month
  const [expandedMonths, setExpandedMonths] = useState({});

  // Attendance list state
  const [students, setStudents] = useState([
    { id: 1, name: "Ali Valiyev", avatarSeed: "Ali", attended: true },
    { id: 2, name: "Salim Qodirov", avatarSeed: "Salim", attended: false },
    { id: 3, name: "Bobur", avatarSeed: "Bobur", attended: false },
  ]);

  const pastDates = ["2", "5", "7", "9", "12"];
  const isSaved = pastDates.includes(date);

  const toggleAttendance = (id) => {
    if (isSaved) return; // Prevent changing past attendance
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attended: !s.attended } : s)),
    );
  };

  // Hooking topic loaded whenever date changes in URL
  React.useEffect(() => {
    const freshLesson = pastLessons[date] || { topic: "Nodejs", desc: "" };
    setTopicName(freshLesson.topic);
    setDescription(freshLesson.desc);
    setTopicType(pastLessons[date] ? "syllabus" : "other");
  }, [date]);

  return (
    <div className="space-y-6 relative">
      {/* Alert/Snackbar Notification */}
      {alertMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-[#ED6C02] text-white rounded-xl shadow-lg border border-orange-500 font-bold text-sm">
            <svg
              className="w-5 h-5 flex-shrink-0 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Back Button Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/groups/${groupId || "1"}`)}
          className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title="Guruhga qaytish"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-black text-gray-800 dark:text-white">
          Dars yo'qlamasi
        </h2>
      </div>

      {/* 2. Tabs "Assistant" and "Teacher" */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-px">
        <button
          onClick={() => setActiveRole("assistant")}
          className={`pb-2 text-sm font-semibold relative transition-all ${
            activeRole === "assistant"
              ? "text-[#10B981] font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Assistant
          {activeRole === "assistant" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />
          )}
        </button>
        <button
          onClick={() => setActiveRole("teacher")}
          className={`pb-2 text-sm font-semibold relative transition-all ${
            activeRole === "teacher"
              ? "text-[#10B981] font-bold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Teacher
          {activeRole === "teacher" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10B981]" />
          )}
        </button>
      </div>

      {/* 3. "Ma'lumot" Card */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">
          Ma'lumot
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center font-bold text-[#10B981] dark:text-emerald-400 text-lg shadow-inner">
              {activeRole === "teacher" ? "M" : "J"}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                {activeRole === "teacher" ? "Mohirbek" : "Javohir"}
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {activeRole}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold mb-0.5">
              Dars kuni
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              2026 M05 {date || "14"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold mb-0.5">
              Holat
            </span>
            <span
              className={`text-sm font-bold ${isSaved ? "text-[#10B981] dark:text-emerald-400" : "text-amber-500"}`}
            >
              {isSaved ? "Dars o'tilgan" : "Dars o'tilmagan"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Yo'qlama va mavzu kiritish */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Yo'qlama va mavzu kiritish
        </h3>

        {/* Radio group */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="topicType"
              checked={topicType === "syllabus"}
              onChange={() => setTopicType("syllabus")}
              disabled={isSaved}
              className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500/20 disabled:opacity-50"
            />
            <span
              className={`text-sm font-semibold transition-colors ${topicType === "syllabus" ? "text-gray-800 dark:text-white" : "text-gray-400"}`}
            >
              O'quv reja bo'yicha
            </span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="topicType"
              checked={topicType === "other"}
              onChange={() => setTopicType("other")}
              disabled={isSaved}
              className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500/20 disabled:opacity-50"
            />
            <span
              className={`text-sm font-semibold transition-colors ${topicType === "other" ? "text-gray-800 dark:text-white" : "text-gray-400"}`}
            >
              Boshqa
            </span>
          </label>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-red-500 uppercase tracking-wider">
            * Mavzu
          </label>
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            disabled={isSaved}
            className="w-full p-4 bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tavsif (ixtiyoriy)
          </label>
          <textarea
            rows={3}
            placeholder="Dars haqida qo'shimcha ma'lumot..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaved}
            className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none resize-none disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>

        {/* Giant Watermark background */}
        <div className="absolute right-0 top-1/3 pointer-events-none select-none text-[150px] font-black text-gray-200/25 dark:text-gray-800/10 z-0">
          38645
        </div>

        {/* Attendance List */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-4 z-10 relative">
          <div className="grid grid-cols-12 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-8 px-2">O'quvchi ismi</div>
            <div className="col-span-3 text-right pr-4">Keldi</div>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {students.map((student, idx) => (
              <div
                key={student.id}
                className="grid grid-cols-12 items-center py-4 text-sm hover:bg-gray-50/30 dark:hover:bg-gray-700/10 rounded-xl transition-colors"
              >
                <div className="col-span-1 text-center font-bold text-gray-400 dark:text-gray-500">
                  {idx + 1}
                </div>
                <div className="col-span-8 flex items-center gap-3 px-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatarSeed}`}
                    alt={student.name}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                  <span className="font-bold text-gray-800 dark:text-white">
                    {student.name}
                  </span>
                </div>
                <div className="col-span-3 flex justify-end pr-4">
                  <label
                    className={`relative inline-flex items-center ${isSaved ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={student.attended}
                      onChange={() => toggleAttendance(student.id)}
                      disabled={isSaved}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500 disabled:opacity-50"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-right watermark logo/motif */}
        <div className="absolute right-4 bottom-2 opacity-[0.12] pointer-events-none select-none dark:opacity-[0.05]">
          <svg
            className="w-12 h-12 text-amber-600 dark:text-amber-400"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 20 C60 10, 80 10, 80 35 C80 50, 60 70, 50 80 C40 70, 20 50, 20 35 C20 10, 40 10, 50 20 Z" />
            <path
              d="M50 30 C55 20, 70 20, 70 40 C70 50, 55 65, 50 72 C45 65, 30 50, 30 40 C30 20, 45 20, 50 30 Z"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 z-10 relative">
        <button
          onClick={() => navigate(`/dashboard/groups/${groupId || "1"}`)}
          className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 shadow-sm"
        >
          Bekor qilish
        </button>
        {isSaved ? (
          <button
            disabled
            className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-400 dark:text-gray-500 cursor-not-allowed select-none transition-colors"
          >
            Dars allaqachon saqlangan
          </button>
        ) : (
          <button
            onClick={() => navigate(`/dashboard/groups/${groupId || "1"}`)}
            className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold shadow-md shadow-purple-100/50 dark:shadow-none transition-colors"
          >
            Saqlash
          </button>
        )}
      </div>
    </div>
  );
}
