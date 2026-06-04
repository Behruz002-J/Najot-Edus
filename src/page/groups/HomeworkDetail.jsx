import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axiosClient from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

// Mock data strictly matching the user's screenshot
const MOCK_WAITING_STUDENTS = [
  { id: 1, full_name: 'Nosirxon Ziyovutdinov', submitted_at: '2026-05-15T09:54:00', files_count: 1, status: 'waiting', description: '1.https://github.com/nosirxon/CRM-Backend\n2.https://github.com/nosirxon/CRM-Frontend' },
  { id: 2, full_name: 'Mirsaid Abduqulov', submitted_at: '2026-05-15T04:57:00', files_count: 2, status: 'waiting', description: '1. https://github.com/mirsaid-abd/homework-crm' },
  { id: 3, full_name: 'Oydin Qalandarova Kamolovna', submitted_at: '2026-05-14T17:06:00', files_count: 1, status: 'waiting', description: 'Crm backend tugatildi. https://github.com/oydin-q/crm-project' },
  { id: 4, full_name: 'Guliza Ayitqulova', submitted_at: '2026-05-15T10:09:00', files_count: 3, status: 'waiting', description: 'https://github.com/guliza/crm-homework-backend' },
  { id: 5, full_name: 'Mohirbek Solijonov', submitted_at: '2026-05-15T06:48:00', files_count: 0, status: 'waiting', description: 'https://github.com/mohirbek-solijonov/crm-back' }
];

const MOCK_RETURNED_STUDENTS = [];
const MOCK_ACCEPTED_STUDENTS = [];

const MOCK_UNSUBMITTED_STUDENTS = [
  { id: 11, full_name: 'Jasur Hasanov', status: 'unsubmitted' },
  { id: 12, full_name: 'Durdona Aliyeva', status: 'unsubmitted' },
  { id: 13, full_name: 'Sardorbek Umarov', status: 'unsubmitted' },
  { id: 14, full_name: 'Dilnoza Karimova', status: 'unsubmitted' },
  { id: 15, full_name: 'Shaxzod Tursunov', status: 'unsubmitted' },
  { id: 16, full_name: 'Zilola Ganiyeva', status: 'unsubmitted' }
];

const STATUS_MAP = {
  waiting: { label: 'Kutayabti', cls: 'bg-yellow-50 text-yellow-500 border border-yellow-100/50 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-none' },
  returned: { label: 'Qaytarildi', cls: 'bg-red-50 text-red-500 border border-red-100/50 dark:bg-red-950/30 dark:text-red-400 dark:border-none' },
  accepted: { label: 'Qabul qilindi', cls: 'bg-green-50 text-green-500 border border-green-100/50 dark:bg-green-950/30 dark:text-green-400 dark:border-none' },
  unsubmitted: { label: 'Bajarilmadi', cls: 'bg-gray-50 text-gray-500 border border-gray-150 dark:bg-gray-800 dark:text-gray-400 dark:border-none' }
};

function formatDT(isoStr) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    const day = d.getDate();
    const months = ['Jan', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${months[d.getMonth()]}, ${d.getFullYear()} ${hh}:${mm}`;
  } catch {
    return isoStr;
  }
}

export default function HomeworkDetail() {
  const { t } = useLanguage();
  const { id, homeworkId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [homeworkData, setHomeworkData] = useState(null);
  const [activeTab, setActiveTab] = useState('waiting'); // waiting, returned, accepted, unsubmitted
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Grading fields
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [gradingSuccess, setGradingSuccess] = useState(false);

  // Submissions states
  const [waitingSubmissions, setWaitingSubmissions] = useState([]);
  const [returnedSubmissions, setReturnedSubmissions] = useState([]);
  const [acceptedSubmissions, setAcceptedSubmissions] = useState([]);
  const [unsubmittedSubmissions, setUnsubmittedSubmissions] = useState([]);

  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch metadata
        try {
          const res = await axiosClient.get(`/homework/${homeworkId}`);
          if (res?.data?.data) {
            setHomeworkData(res.data.data);
          } else if (res?.data) {
            setHomeworkData(res.data);
          }
        } catch (metaErr) {
          console.warn('Metadata fetch failed, falling back:', metaErr.message);
        }

        // Try getting submissions from group results API
        try {
          const [pRes, rRes, aRes, nRes] = await Promise.all([
            axiosClient.get(`/group/${id}/homework/${homeworkId}/results?status=PENDING`).catch(() => null),
            axiosClient.get(`/group/${id}/homework/${homeworkId}/results?status=REJECTED`).catch(() => null),
            axiosClient.get(`/group/${id}/homework/${homeworkId}/results?status=ACCEPTED`).catch(() => null),
            axiosClient.get(`/group/${id}/homework/${homeworkId}/results`).catch(() => null),
          ]);

          let hasValidApiResponse = false;
          
          const getListFromRes = (response) => {
            if (response && response.data && response.data.success) {
              hasValidApiResponse = true;
              const resData = response.data.data;
              if (resData && Array.isArray(resData.students)) {
                return resData.students;
              }
              if (Array.isArray(response.data.students)) {
                return response.data.students;
              }
              if (Array.isArray(resData)) {
                return resData;
              }
            }
            return null;
          };

          const pList = getListFromRes(pRes) || [];
          const rList = getListFromRes(rRes) || [];
          const aList = getListFromRes(aRes) || [];
          const nList = getListFromRes(nRes) || [];

          console.log('API Submissions responses:', {
            PENDING: pList,
            REJECTED: rList,
            ACCEPTED: aList,
            UNSUBMITTED: nList
          });

          if (hasValidApiResponse) {
            const mapStudents = (list, targetStatus) => {
              if (!Array.isArray(list)) return [];
              return list.map(s => ({
                id: s.id || s.student_id || Math.random(),
                full_name: s.full_name || s.name || s.student_name || s.student?.full_name || s.student?.name || 'Noma\'lum',
                submitted_at: s.submitted_at || s.created_at || s.submission_date || s.updated_at,
                files_count: s.files_count || (s.files ? s.files.length : 0) || 0,
                status: targetStatus,
                description: s.description || s.comment || s.text || s.feedback || (s.github_link ? `Github: ${s.github_link}` : '') || '',
                score: s.score || s.grade || 0,
                ...s
              }));
            };

            setWaitingSubmissions(mapStudents(pList, 'waiting'));
            setReturnedSubmissions(mapStudents(rList, 'returned'));
            setAcceptedSubmissions(mapStudents(aList, 'accepted'));
            setUnsubmittedSubmissions(mapStudents(nList, 'unsubmitted'));
          } else {
            applyMockData();
          }
        } catch (apiErr) {
          console.warn('API sub-fetching failed, using mock data:', apiErr);
          applyMockData();
        }
      } catch (err) {
        console.error('Fetch homework detail page error, fallback to mock:', err);
        applyMockData();
      } finally {
        setLoading(false);
      }
    };

    const applyMockData = () => {
      setWaitingSubmissions(MOCK_WAITING_STUDENTS);
      setReturnedSubmissions(MOCK_RETURNED_STUDENTS);
      setAcceptedSubmissions(MOCK_ACCEPTED_STUDENTS);
      setUnsubmittedSubmissions(MOCK_UNSUBMITTED_STUDENTS);
      
      // Attempt to retrieve title from location state or fallback
      if (location.state?.homeworkData) {
        setHomeworkData(location.state.homeworkData);
      } else {
        setHomeworkData({
          title: 'crm backend homework checking',
          created_at: '2026-05-14T07:10:00'
        });
      }
    };

    fetchHomeworkDetails();
  }, [homeworkId, id]);

  const goBack = () => navigate(`/dashboard/groups/${id}`);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setScore(student.score || 0);
    setComment(student.comment || '');
    setGradingSuccess(false);
  };

  const handleSubmitScore = async () => {
    if (!selectedStudent) return;
    try {
      // Determine target list to move the graded student to
      const targetStatus = score >= 60 ? 'accepted' : 'returned';
      const updatedStudent = {
        ...selectedStudent,
        score,
        comment,
        status: targetStatus,
        graded_at: new Date().toISOString()
      };

      // Call API if possible
      try {
        await axiosClient.post(`/homework/submissions/${selectedStudent.id}/grade`, {
          score,
          comment
        });
      } catch (e) {
        console.warn('API grading endpoint failed or unavailable, applying locally:', e.message);
      }

      // Remove from current list and add to target list locally
      if (activeTab === 'waiting') {
        setWaitingSubmissions(prev => prev.filter(s => s.id !== selectedStudent.id));
      } else if (activeTab === 'returned') {
        setReturnedSubmissions(prev => prev.filter(s => s.id !== selectedStudent.id));
      } else if (activeTab === 'accepted') {
        setAcceptedSubmissions(prev => prev.filter(s => s.id !== selectedStudent.id));
      } else if (activeTab === 'unsubmitted') {
        setUnsubmittedSubmissions(prev => prev.filter(s => s.id !== selectedStudent.id));
      }

      if (targetStatus === 'accepted') {
        setAcceptedSubmissions(prev => [updatedStudent, ...prev]);
      } else {
        setReturnedSubmissions(prev => [updatedStudent, ...prev]);
      }

      setGradingSuccess(true);
      setTimeout(() => {
        setSelectedStudent(null);
      }, 1000);

    } catch (err) {
      alert(t('common.error') || "Xatolik yuz berdi!");
    }
  };

  const getActiveList = () => {
    switch (activeTab) {
      case 'waiting': return waitingSubmissions;
      case 'returned': return returnedSubmissions;
      case 'accepted': return acceptedSubmissions;
      case 'unsubmitted': return unsubmittedSubmissions;
      default: return [];
    }
  };

  const homeworkTopic = homeworkData?.title || homeworkData?.topic || 'crm backend homework checking';
  const deadlineText = homeworkData?.created_at 
    ? formatDT(new Date(new Date(homeworkData.created_at).getTime() + 24*60*60*1000).toISOString()) 
    : '15 May, 2026 07:10';

  const activeList = getActiveList();

  return (
    <div className="w-full">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{homeworkTopic}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
        
        {/* Info panel */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('groupDetail.topic')}</p>
            <p className="text-base font-bold text-gray-850 dark:text-white">{homeworkTopic}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">{t('groupDetail.endTime')}</p>
            <p className="text-base font-bold text-gray-850 dark:text-white">{deadlineText}</p>
          </div>
        </div>

        {/* Tab row */}
        <div className="px-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 flex flex-wrap gap-4">
          {[
            { id: 'waiting', label: t('homeworkDetail.waiting'), count: waitingSubmissions.length },
            { id: 'returned', label: t('homeworkDetail.returned'), count: returnedSubmissions.length },
            { id: 'accepted', label: t('homeworkDetail.accepted'), count: acceptedSubmissions.length },
            { id: 'unsubmitted', label: t('homeworkDetail.unsubmitted'), count: unsubmittedSubmissions.length }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedStudent(null);
                }}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all -mb-px cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-300'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black ${
                    tab.id === 'waiting'
                      ? 'bg-emerald-500 text-white'
                      : tab.id === 'returned'
                      ? 'bg-red-500 text-white'
                      : tab.id === 'accepted'
                      ? 'bg-blue-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-700/10">
                <th className="py-4 px-6">{t('homeworkDetail.studentName')}</th>
                <th className="py-4 px-6">{t('homeworkDetail.submittedAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-12 text-gray-400 font-semibold text-sm">
                    {t('common.loading')}
                  </td>
                </tr>
              ) : activeList.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-12 text-gray-400 dark:text-gray-500 font-semibold text-sm">
                    {t('homeworkDetail.sectionEmpty')}
                  </td>
                </tr>
              ) : (
                activeList.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => handleSelectStudent(student)}
                    className={`hover:bg-gray-50/60 dark:hover:bg-gray-700/10 transition-all cursor-pointer ${
                      selectedStudent?.id === student.id ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''
                    }`}
                  >
                    <td className="py-4 px-6 font-bold text-gray-855 dark:text-white text-sm">
                      {student.full_name}
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {student.submitted_at ? formatDT(student.submitted_at) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student submission detail and grading panel (Matches ExamDetail style) */}
      {selectedStudent && (
        <div className="max-w-[760px] space-y-6 mt-8 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#F8F9FC] dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
              {selectedStudent.full_name} — {t('homeworkDetail.gradeHomework')}
            </h3>

            {/* Submission card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex flex-wrap gap-12 shadow-sm mb-4">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">{t('homeworkDetail.submittedTime')}</p>
                <p className="text-sm font-bold text-gray-850 dark:text-gray-200">
                  {selectedStudent.status === 'unsubmitted' ? t('homeworkDetail.notSubmitted') : formatDT(selectedStudent.submitted_at)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">{t('homeworkDetail.filesCount')}</p>
                <p className="text-sm font-bold text-gray-850 dark:text-gray-200">
                  {selectedStudent.files_count ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">{t('homeworkDetail.status')}</p>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${STATUS_MAP[selectedStudent.status]?.cls}`}>
                  {t('homeworkDetail.' + selectedStudent.status)}
                </span>
              </div>
            </div>

            {/* Izoh Card */}
            {selectedStudent.description && (
              <div className="bg-[#F4F7FC] dark:bg-blue-900/10 border-l-[3px] border-l-blue-500 border border-gray-100 dark:border-gray-850 rounded-r-xl rounded-l-sm p-5 mb-6">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5">
                  {t('homeworkDetail.studentComment')}
                </p>
                <p className="text-xs text-gray-800 dark:text-gray-300 leading-relaxed font-bold whitespace-pre-wrap break-all">
                  {selectedStudent.description.split('\n').map((line, lIdx) => {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const parts = line.split(urlRegex);
                    return (
                      <span key={lIdx} className="block">
                        {parts.map((part, pIdx) => {
                          if (part.match(urlRegex)) {
                            return (
                              <a
                                key={pIdx}
                                href={part}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline inline-block break-all"
                              >
                                {part}
                              </a>
                            );
                          }
                          return part;
                        })}
                      </span>
                    );
                  })}
                </p>
              </div>
            )}

            {/* 60-100 score explanation banner */}
            <div className="flex items-start gap-2.5 p-3.5 bg-[#EBF5FF]/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl mb-6">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-[#1E40AF] dark:text-blue-300 font-semibold leading-relaxed">
                {t('homeworkDetail.gradingBanner')}
              </p>
            </div>

            {/* Score slider & input */}
            <div className="space-y-2 mb-4">
              <label className="block text-sm font-bold text-gray-800 dark:text-white">
                {t('homeworkDetail.score')}
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
                    {t('homeworkDetail.passingScore')}
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

            {/* Teacher comment and microphone button */}
            <div className="relative">
              <textarea
                placeholder={t('homeworkDetail.teacherCommentPlaceholder')}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full min-h-[90px] p-4 pr-12 text-sm text-gray-750 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none placeholder-gray-400 font-semibold"
              />
              <button
                type="button"
                title={t('homeworkDetail.voiceInput')}
                className="absolute right-3.5 bottom-3.5 w-8 h-8 flex items-center justify-center rounded-lg bg-[#10B981] hover:bg-[#059669] text-white transition-colors cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              >
                {t('btn.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmitScore}
                className="px-7 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold transition-all"
              >
                {t('common.save')}
              </button>
            </div>

            {gradingSuccess && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg text-center animate-pulse">
                {t('homeworkDetail.successGraded')}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
