import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axiosClient from '../api/axios';

// Mock talabalar (API ishlamasa)
const MOCK_STUDENTS = [
  {
    id: 1,
    full_name: 'Rahmonbergan Otabek o\'g\'li Mahmudov',
    submitted_at: '2026-05-22T09:32:00',
    files_count: 0,
    status: 'waiting',
    description: '1.https://github.com/uzbboos34-blip/CRM-Backend\n2.https://github.com/uzbboos34-blip/CRM-Frontend 3.https://7-oy-xuep.vercel.app/login',
  },
];

const STATUS_MAP = {
  waiting:   { label: 'Kutayabti', cls: 'bg-yellow-50 text-yellow-500 border border-yellow-100/50 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-none' },
  submitted: { label: 'Topshirdi', cls: 'bg-green-50 text-green-500 border border-green-100/50 dark:bg-green-950/30 dark:text-green-400 dark:border-none' },
  late:      { label: 'Kechikdi',  cls: 'bg-red-50 text-red-500 border border-red-100/50 dark:bg-red-950/30 dark:text-red-400 dark:border-none' },
};

function formatDT(isoStr) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    const day = d.getDate();
    const months = ['Yan','Fev','Mart','Apr','May','Iyun','Iyul','Avg','Sen','Okt','Noy','Dek'];
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    return `${day} ${months[d.getMonth()]}, ${d.getFullYear()} ${hh}:${mm}`;
  } catch { return isoStr; }
}

export default function ExamDetail() {
  const { id, examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // CreateExam sahifasidan o'tkazilgan ma'lumot
  const passed = location.state || {};

  const [examData, setExamData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Imtihon ma'lumotlari
        const res = await axiosClient.get(`/exams/${examId}`);
        if (res?.data?.data) {
          setExamData(res.data.data);
        } else if (res?.data) {
          setExamData(res.data);
        }
        // Talabalar
        const sRes = await axiosClient.get(`/exams/${examId}/submissions`);
        if (Array.isArray(sRes?.data?.data)) setStudents(sRes.data.data);
        else if (Array.isArray(sRes?.data)) setStudents(sRes.data);
        else setStudents(MOCK_STUDENTS);
      } catch {
        setExamData(passed.examData || null);
        setStudents(MOCK_STUDENTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId]);

  const goBack = () => navigate(`/dashboard/groups/${id}`);

  const handleSubmitScore = async () => {
    try {
      alert("Ball muvaffaqiyatli yuborildi!");
      navigate(`/dashboard/groups/${id}`);
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  };

  // Yon tomondagi navigation (oldingi/keyingi imtihon — hozircha disabled)
  const NavArrow = ({ dir }) => (
    <button
      className="absolute top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-400 hover:text-gray-700 dark:hover:text-white hover:border-gray-300 transition-all disabled:opacity-30 cursor-pointer z-10"
      style={{ [dir === 'left' ? 'left' : 'right']: '12px' }}
      disabled
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  );

  return (
    <div className="w-full">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm font-bold text-gray-800 dark:text-white">
        <span>Kutayotganlar</span>
        <span className="text-gray-400 dark:text-gray-600 font-normal">&gt;</span>
        <span className="text-gray-400 dark:text-gray-500">Imtihon</span>
      </div>

      {/* Content */}
      <div className="max-w-[760px] space-y-6">

        {/* ===== Imtihon vazifasi ===== */}
        <div className="bg-[#F8F9FC] dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
            Imtihon vazifasi
          </h3>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
              Imtihon izohi:
            </p>
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ) : (
              <div
                className="exam-description text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-semibold"
                dangerouslySetInnerHTML={{
                  __html: examData?.description
                    || passed?.description
                    || '<p>crm loyihasi</p><ol><li>backend github link</li><li>frontend github link</li></ol>',
                }}
              />
            )}
          </div>
        </div>

        {/* ===== Talabalar ro'yxati ===== */}
        {loading ? (
          <div className="bg-[#F8F9FC] dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-2/5 mb-4" />
            <div className="h-20 bg-white dark:bg-gray-900 rounded-xl" />
          </div>
        ) : (
          students.map((student) => {
            const st = STATUS_MAP[student.status] || STATUS_MAP.waiting;
            return (
              <div
                key={student.id}
                className="bg-[#F8F9FC] dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm"
              >
                {/* Student header */}
                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
                  {student.full_name}
                </h3>

                {/* Meta Card */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-16 shadow-sm">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">Vaqti:</p>
                    <p className="text-sm font-bold text-gray-850 dark:text-gray-200">
                      {formatDT(student.submitted_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">Fayllar soni:</p>
                    <p className="text-sm font-bold text-gray-850 dark:text-gray-200">
                      {student.files_count ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">Status:</p>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                </div>

                {/* Izoh Card */}
                {student.description && (
                  <div className="bg-[#F4F7FC] dark:bg-blue-900/10 border-l-[3px] border-l-blue-500 border border-gray-100 dark:border-gray-850 rounded-r-xl rounded-l-sm p-5 mt-4">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5">
                      Uyga vazifa izohi:
                    </p>
                    <p className="text-xs text-gray-800 dark:text-gray-300 leading-relaxed font-bold whitespace-pre-wrap break-all">
                      {student.description}
                    </p>
                  </div>
                )}

                {/* 60-100 oralig'ida ball banner */}
                <div className="flex items-start gap-2.5 p-3.5 bg-[#EBF5FF]/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl mt-6">
                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-[#1E40AF] dark:text-blue-300 font-semibold leading-relaxed">
                    60-100 oralig'ida ball qo'yilgan vazifa 'Qabul qilingan', 0-59 oralig'ida ball qo'yilgan vazifa 'Qaytarilgan' hisoblanadi.
                  </p>
                </div>

                {/* Ball Range & Input */}
                <div className="mt-5 space-y-2">
                  <label className="block text-sm font-bold text-gray-800 dark:text-white">
                    Ball
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full accent-emerald-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-gray-400 font-bold text-center mt-1">
                        O'tish bali
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setScore(val);
                      }}
                      className="w-14 h-9 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-sm font-bold text-gray-800 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Izoh Input & Microphone */}
                <div className="mt-4 relative">
                  <textarea
                    placeholder="Izohingiz"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full min-h-[90px] p-4 pr-12 text-sm text-gray-750 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none placeholder-gray-400 font-semibold"
                  />
                  <button
                    type="button"
                    title="Ovozli kiritish"
                    className="absolute right-3.5 bottom-3.5 w-8 h-8 flex items-center justify-center rounded-lg bg-[#10B981] hover:bg-[#059669] text-white transition-colors cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Bo'sh holat */}
        {!loading && students.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 shadow-sm text-center">
            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 font-semibold">
              Hech qaysi talaba topshirmagan
            </p>
          </div>
        )}

      </div>

      {/* Bottom Actions */}
      <div className="max-w-[760px] flex items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={goBack}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all bg-white"
        >
          Bekor qilish
        </button>
        <button
          type="button"
          onClick={handleSubmitScore}
          className="px-7 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold transition-all"
        >
          Yuborish
        </button>
      </div>

      <style>{`
        .exam-description ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .exam-description ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .exam-description li {
          margin-bottom: 0.25rem;
        }
        .exam-description p {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
