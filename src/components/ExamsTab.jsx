import React from 'react';

export default function ExamsTab({ exams, examsLoading, mockExams, formatDT, navigate, id, setIsExamModalOpen }) {
  const displayExams = exams.length > 0 ? exams : mockExams;

  if (examsLoading) {
    return (
      <div className="py-16 flex flex-col items-center gap-3">
        <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-sm text-gray-400 font-semibold">Imtihonlar yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[860px]">
        {/* ===== THEAD ===== */}
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-700/10">
            <th className="py-3 px-5 text-xs font-semibold text-gray-500 dark:text-gray-400 text-center w-12">#</th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Mavzu</th>

            {/* Odam icon */}
            <th className="py-3 px-4 text-center w-16">
              <svg className="w-4 h-4 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </th>

            {/* X qizil icon */}
            <th className="py-3 px-4 text-center w-16">
              <svg className="w-4 h-4 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </th>

            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Dars vaqti</th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Berilgan vaqt</th>
            <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">E'lon qilingan vaqti</th>
            <th className="py-3 px-4 w-12"></th>
          </tr>
        </thead>

        {/* ===== TBODY ===== */}
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {displayExams.map((exam, idx) => {
            const isFaol =
              exam.status === 'active' ||
              exam.status === 'faol' ||
              exam.is_active === true;

            const studentCount = exam.student_count ?? exam.students_count ?? 0;
            const failedCount  = exam.failed_count  ?? exam.fail_count     ?? 0;
            const lessonDT     = formatDT(exam.start_time  ?? exam.lesson_time ?? exam.date ?? null);
            const givenDT      = formatDT(exam.given_at    ?? exam.start_time  ?? exam.date ?? null);
            const announcedDT  = exam.announced_at ? formatDT(exam.announced_at) : null;

            return (
              <tr
                key={exam.id ?? idx}
                className="hover:bg-gray-50/60 dark:hover:bg-gray-700/10 transition-colors"
              >
                {/* # */}
                <td className="py-4 px-5 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {displayExams.length - idx}
                </td>

                {/* Mavzu */}
                <td className="py-4 px-4">
                  <button
                    onClick={() => navigate(`/dashboard/groups/${id}/exam/${exam.id}`)}
                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0 text-left"
                  >
                    {exam.name || exam.title || 'Examination'}
                  </button>
                </td>

                {/* O'quvchilar soni */}
                <td className="py-4 px-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {studentCount}
                </td>

                {/* Qoldirilganlar */}
                <td className="py-4 px-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {failedCount}
                </td>

                {/* Status badge */}
                <td className="py-4 px-4">
                  {isFaol ? (
                    <span className="inline-block px-3 py-0.5 rounded-full border border-green-500 text-green-600 dark:text-green-400 text-xs font-semibold bg-white dark:bg-transparent">
                      Faol
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-0.5 rounded-full border border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400 text-xs font-semibold bg-white dark:bg-transparent">
                      Tugagan
                    </span>
                  )}
                </td>

                {/* Dars vaqti — 2 qator */}
                <td className="py-4 px-4">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{lessonDT.date}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{lessonDT.time}</div>
                </td>

                {/* Berilgan vaqt — 2 qator */}
                <td className="py-4 px-4">
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{givenDT.date}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{givenDT.time}</div>
                </td>

                {/* E'lon qilingan vaqti — 2 qator yoki "-" */}
                <td className="py-4 px-4">
                  {announcedDT ? (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{announcedDT.date}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{announcedDT.time}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>

                {/* ⋮ menu tugmasi */}
                <td className="py-4 px-4 text-center">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5"  r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="12" cy="19" r="1.5" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
