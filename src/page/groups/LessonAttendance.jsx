import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import axiosClient from "../../api/axios";

export default function LessonAttendance() {
  const { t } = useLanguage();
  const { groupId, date } = useParams();
  const navigate = useNavigate();

  // Alert/Snackbar notification state
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("info"); // "info" or "success"
  const triggerAlert = (msg, type = "info") => {
    setAlertMessage(msg);
    setAlertType(type);
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

  const parseUrlDate = (dateParam) => {
    if (!dateParam) return new Date();
    if (dateParam.includes("-")) {
      return new Date(dateParam);
    }
    return new Date(2026, 4, Number(dateParam) || 14); // May 14, 2026 fallback
  };

  const getUzbekMonthName = (monthNum) => {
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
      'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];
    return months[monthNum] || '';
  };

  const parsedDate = parseUrlDate(date);
  const dayNumStr = String(parsedDate.getDate());
  const initialLesson = pastLessons[date] || pastLessons[dayNumStr] || { topic: "Nodejs", desc: "" };

  // Radio selection state
  const [topicType, setTopicType] = useState(
    (pastLessons[date] || pastLessons[dayNumStr]) ? "syllabus" : "other",
  ); // 'syllabus' or 'other'

  // Topic states
  const [topicName, setTopicName] = useState(initialLesson.topic);
  const [description, setDescription] = useState(initialLesson.desc);

  // Active Role Tab State ('teacher' or 'assistant')
  const [activeRole, setActiveRole] = useState("teacher");
  const [groupTeachers, setGroupTeachers] = useState([]);

  // Expanded months state: when true show all dates for that month
  const [expandedMonths, setExpandedMonths] = useState({});

  const defaultStudents = [
    { id: 1, name: "Ali Valiyev", avatarSeed: "Ali", attended: true },
    { id: 2, name: "Salim Qodirov", avatarSeed: "Salim", attended: false },
    { id: 3, name: "Bobur", avatarSeed: "Bobur", attended: false },
  ];

  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Attendance list state
  const [students, setStudents] = useState(defaultStudents);

  const defaultPastDates = ["2", "5", "7", "9", "12"];
  const [savedDates, setSavedDates] = useState(() => {
    try {
      const stored = localStorage.getItem(`attendance_saved_${groupId || "1"}`);
      return stored ? JSON.parse(stored) : defaultPastDates;
    } catch {
      return defaultPastDates;
    }
  });

  const toggleAttendance = (id) => {
    if (isSaved) return; // Prevent changing past attendance
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, attended: !s.attended } : s)),
    );
  };

  const handleSave = async () => {
    if (isSaved) return;

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Prepare payload. We include both camelCase and snake_case to support various backend schemas.
    const payload = students.map((student) => ({
      student_id: Number(student.id),
      studentId: Number(student.id),
      group_id: Number(groupId),
      groupId: Number(groupId),
      is_present: student.attended,
      isPresent: student.attended,
      attended: student.attended,
      date: formattedDate,
      lessonDate: formattedDate,
      lesson_date: formattedDate,
    }));

    try {
      try {
        // Try bulk upload first (sending the whole array)
        await axiosClient.post('/attendance/all', payload);
      } catch (bulkError) {
        console.warn("Bulk POST to /attendance/all failed, trying individual POSTs:", bulkError.message);
        // Fallback: send individual POST request for each student in parallel
        await Promise.all(
          payload.map((item) => axiosClient.post('/attendance/all', item))
        );
      }

      // Save to localStorage as cache/fallback
      const newSavedDates = [...savedDates, date];
      setSavedDates(newSavedDates);
      localStorage.setItem(`attendance_saved_${groupId || "1"}`, JSON.stringify(newSavedDates));
      localStorage.setItem(`attendance_students_${groupId || "1"}_${date}`, JSON.stringify(students));
      
      triggerAlert("Yo'qlama muvaffaqiyatli saqlandi va dars yakunlandi!", "success");
      setTimeout(() => {
        navigate(`/dashboard/groups/${groupId || "1"}`);
      }, 1500);
    } catch (error) {
      console.error("Yo'qlamani saqlashda xatolik:", error?.response?.data || error.message);
      triggerAlert("Yo'qlamani saqlashda xatolik yuz berdi!", "error");
    }
  };

  useEffect(() => {
    const loadGroupAndAttendance = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch group details to get the actual students list
        let groupRes = await axiosClient.get(`/groups/one/${groupId}`).catch(() => null);
        
        // Teacher fallback if first request fails (due to backend role restrictions)
        if (!groupRes) {
          try {
            const myGroupsRes = await axiosClient.get('/teachers/my/groups');
            const myGroupsList = myGroupsRes?.data?.success ? myGroupsRes.data.data : (Array.isArray(myGroupsRes?.data) ? myGroupsRes.data : []);
            const matchingGroup = myGroupsList.find(g => Number(g.id) === Number(groupId));
            if (matchingGroup) {
              groupRes = { data: { success: true, data: matchingGroup } };
            }
          } catch (teacherErr) {
            console.error('Teacher fallback group fetch failed:', teacherErr.message);
          }
        }

        // Local storage fallback if still not found
        if (!groupRes) {
          try {
            const localGroups = JSON.parse(window.localStorage.getItem("local_groups") || "[]");
            const localMatch = localGroups.find(g => String(g.id) === String(groupId));
            if (localMatch) {
              let allStudents = [];
              try {
                const localStudents = JSON.parse(window.localStorage.getItem("local_students") || "[]");
                allStudents = [...localStudents];
              } catch (e) {}

              try {
                const apiStudentsRes = await axiosClient.get("/students").catch(() => null);
                const apiStudents = apiStudentsRes?.data?.success
                  ? apiStudentsRes.data.data
                  : Array.isArray(apiStudentsRes?.data)
                    ? apiStudentsRes.data
                    : apiStudentsRes?.data?.data || [];
                if (Array.isArray(apiStudents)) {
                  const existingIds = new Set(allStudents.map(s => String(s.id)));
                  const uniqueApi = apiStudents.filter(s => !existingIds.has(String(s.id)));
                  allStudents = [...allStudents, ...uniqueApi];
                }
              } catch (e) {}

              const groupStudents = (localMatch.student_ids || []).map(sId => {
                const matchedStudent = allStudents.find(s => Number(s.id) === Number(sId));
                return {
                  id: sId,
                  full_name: matchedStudent?.name || matchedStudent?.full_name || `Talaba #${sId}`,
                  name: matchedStudent?.name || matchedStudent?.full_name || `Talaba #${sId}`,
                  phone: matchedStudent?.phone || "—",
                  avatarSeed: matchedStudent?.name || matchedStudent?.full_name || "User"
                };
              });

              groupRes = {
                data: {
                  success: true,
                  data: {
                    id: localMatch.id,
                    name: localMatch.name,
                    description: localMatch.description,
                    course: { name: localMatch.course, duration_month: parseInt(localMatch.duration) || 6 },
                    course_id: localMatch.course_id,
                    start_time: localMatch.start_time,
                    week_day: localMatch.week_day,
                    room: localMatch.room,
                    room_id: localMatch.room_id,
                    teacher: { full_name: localMatch.teacher },
                    teachers: (localMatch.teachers || []).map(tId => ({ id: tId, full_name: localMatch.teacher })),
                    students: groupStudents,
                    start_date: localMatch.start_date,
                    is_active: localMatch.is_active
                  }
                }
              };
            }
          } catch (localErr) {
            console.error("Local group resolution in LessonAttendance failed:", localErr);
          }
        }

        let fetchedStudents = [];
        let fetchedTeachers = [];
        if (groupRes?.data?.success && groupRes?.data?.data) {
          fetchedStudents = groupRes.data.data.students || [];
          fetchedTeachers = groupRes.data.data.teachers || [];
        } else if (groupRes?.data) {
          fetchedStudents = groupRes.data.students || [];
          fetchedTeachers = groupRes.data.teachers || [];
        }
        setGroupTeachers(fetchedTeachers);

        // Fallback: If groupRes had no students, load from /students and filter by group ID.
        if (fetchedStudents.length === 0 && !isNaN(Number(groupId))) {
          try {
            const studentsRes = await axiosClient.get('/students').catch(() => null);
            const studentsData = studentsRes?.data?.success ? studentsRes.data.data : (Array.isArray(studentsRes?.data) ? studentsRes.data : (studentsRes?.data?.data || []));
            if (Array.isArray(studentsData)) {
              const filteredStudents = studentsData.filter(student => {
                const sGroupIds = Array.isArray(student.groups)
                  ? student.groups.map(g => typeof g === 'object' ? g.id : g)
                  : (Array.isArray(student.groupIds) ? student.groupIds : []);
                return sGroupIds.map(Number).includes(Number(groupId));
              });
              fetchedStudents = filteredStudents.map(student => ({
                id: student.id,
                full_name: student.name || student.full_name || 'Noma\'lum talaba',
                name: student.name || student.full_name || 'Noma\'lum talaba',
                phone: student.phone || '—',
                avatarSeed: student.name || student.full_name || 'User'
              }));
            }
          } catch (studentErr) {
            console.error('Failed to load lesson attendance students via fallback:', studentErr.message);
          }
        }

        // 2. Fetch all attendance from backend
        const attRes = await axiosClient.get('/attendance/all').catch(() => null);
        let allAtt = [];
        if (attRes?.data?.success && Array.isArray(attRes?.data?.data)) {
          allAtt = attRes.data.data;
        } else if (Array.isArray(attRes?.data)) {
          allAtt = attRes.data;
        } else if (attRes?.data?.data && Array.isArray(attRes?.data?.data)) {
          allAtt = attRes.data.data;
        }

        // Filter attendance for this group
        const groupAttendance = allAtt.filter(a => {
          const gId = a.group_id || a.groupId || (a.group && a.group.id);
          return String(gId) === String(groupId);
        });

        // Parse url date parameter to match
        const targetDateObj = parseUrlDate(date);
        const targetDay = targetDateObj.getDate();
        const targetMonth = targetDateObj.getMonth() + 1; // 1-indexed
        const targetYear = targetDateObj.getFullYear();

        // Check if there is backend attendance saved for this date
        const backendRecordsForDate = groupAttendance.filter(a => {
          const aDateStr = a.created_at || a.date || a.lesson_date || a.lessonDate;
          if (!aDateStr) return false;
          const aDate = new Date(aDateStr);
          if (isNaN(aDate.getTime())) return false;
          return aDate.getDate() === targetDay && (aDate.getMonth() + 1) === targetMonth && aDate.getFullYear() === targetYear;
        });

        const hasBackendSaved = backendRecordsForDate.length > 0;

        // Determine if attendance is already saved (either locally or on backend)
        const isLocallySaved = savedDates.includes(date) || savedDates.includes(dayNumStr);
        const finalSaved = isLocallySaved || hasBackendSaved;
        setIsSaved(finalSaved);

        if (hasBackendSaved) {
          // If saved on backend, load student attendance from backend records
          const backendStudents = fetchedStudents.map(student => {
            const record = backendRecordsForDate.find(r => {
              const sid = r.student_id || r.studentId || (r.student && r.student.id);
              return String(sid) === String(student.id);
            });
            return {
              id: student.id,
              name: student.full_name || student.name || 'Noma\'lum talaba',
              avatarSeed: student.full_name || student.name || 'User',
              attended: record ? (record.isPresent ?? record.is_present ?? record.attended ?? false) : false
            };
          });
          setStudents(backendStudents.length > 0 ? backendStudents : defaultStudents);
          
          // Sync saved dates list in local storage if not already there
          if (!savedDates.includes(date)) {
            const updated = [...savedDates, date];
            setSavedDates(updated);
            localStorage.setItem(`attendance_saved_${groupId || "1"}`, JSON.stringify(updated));
          }
        } else {
          // If not saved on backend, check if we have local storage attendance for this date
          const localStored = localStorage.getItem(`attendance_students_${groupId || "1"}_${date}`) || localStorage.getItem(`attendance_students_${groupId || "1"}_${dayNumStr}`);
          if (localStored) {
            setStudents(JSON.parse(localStored));
          } else {
            // Otherwise initialize with the group's students
            const initialStudents = fetchedStudents.map(student => ({
              id: student.id,
              name: student.full_name || student.name || 'Noma\'lum talaba',
              avatarSeed: student.full_name || student.name || 'User',
              attended: false
            }));
            // Fallback to default mock students if group has no students
            setStudents(initialStudents.length > 0 ? initialStudents : defaultStudents);
          }
        }

        // Keep topic loaded dynamically
        const freshLesson = pastLessons[date] || pastLessons[dayNumStr] || { topic: "Nodejs", desc: "" };
        setTopicName(freshLesson.topic);
        setDescription(freshLesson.desc);
        setTopicType((pastLessons[date] || pastLessons[dayNumStr]) ? "syllabus" : "other");

      } catch (err) {
        console.error("Error loading group and attendance data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGroupAndAttendance();
  }, [groupId, date]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <svg className="w-10 h-10 animate-spin text-[#7C3AED]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Yo'qlama yuklanmoqda...
        </span>
      </div>
    );
  }

  const mainTeacherName = groupTeachers[0]?.full_name || "Mohirbek";
  const assistantTeacherName = groupTeachers[1]?.full_name || "Javohir";
  
  const mainTeacherInitial = mainTeacherName[0]?.toUpperCase() || "M";
  const assistantTeacherInitial = assistantTeacherName[0]?.toUpperCase() || "J";

  return (
    <div className="space-y-6 relative">
      {/* Alert/Snackbar Notification */}
      {alertMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3.5 text-white rounded-xl shadow-lg border font-bold text-sm ${
            alertType === "success" 
              ? "bg-emerald-600 border-emerald-500" 
              : "bg-[#ED6C02] border-orange-500"
          }`}>
            {alertType === "success" ? (
              <svg className="w-5 h-5 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span>{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Back Button Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/groups/${groupId || "1"}`)}
          className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={t('lessonAttendance.backToGroup')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-black text-gray-800 dark:text-white">
          {t('lessonAttendance.lessonAttendance')}
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
          {t('lessonAttendance.info')}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-6 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center font-bold text-[#10B981] dark:text-emerald-400 text-lg shadow-inner">
              {activeRole === "teacher" ? mainTeacherInitial : assistantTeacherInitial}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-850 dark:text-white">
                {activeRole === "teacher" ? mainTeacherName : assistantTeacherName}
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {activeRole}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold mb-0.5">
              {t('lessonAttendance.lessonDate')}
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {parsedDate.getFullYear()} {getUzbekMonthName(parsedDate.getMonth())} {parsedDate.getDate()}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-semibold mb-0.5">
              {t('lessonAttendance.status')}
            </span>
            <span
              className={`text-sm font-bold ${isSaved ? "text-[#10B981] dark:text-emerald-400" : "text-amber-500"}`}
            >
              {isSaved ? t('lessonAttendance.lessonCompleted') : t('lessonAttendance.lessonNotCompleted')}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Yo'qlama va mavzu kiritish */}
      <div className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden transition-all duration-300 ${
        isSaved 
          ? "bg-white/80 dark:bg-gray-800/80 opacity-60 pointer-events-none cursor-not-allowed select-none" 
          : ""
      }`}>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          {t('lessonAttendance.attendanceAndTopic')}
        </h3>

        {isSaved && (
          <div className="flex items-center gap-2.5 p-4 bg-gray-50/50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Yo'qlama boshqa o'qituvchi tomonidan saqlangan va muzlatilgan. Tahrirlash imkoniyati yo'q.
          </div>
        )}

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
              {t('lessonAttendance.bySyllabus')}
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
              {t('lessonAttendance.other')}
            </span>
          </label>
        </div>

        {/* Topic Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-red-500 uppercase tracking-wider">
            * {t('lessonAttendance.topic')}
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
            {t('lessonAttendance.descriptionOptional')}
          </label>
          <textarea
            rows={3}
            placeholder={t('lessonAttendance.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaved}
            className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none resize-none disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>



        {/* Attendance List */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-6 space-y-4 z-10 relative">
          <div className="grid grid-cols-12 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider pb-2">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-8 px-2">{t('homeworkDetail.studentName')}</div>
            <div className="col-span-3 text-right pr-4">{t('lessonAttendance.attended')}</div>
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


      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 z-10 relative">
        <button
          onClick={() => navigate(`/dashboard/groups/${groupId || "1"}`)}
          className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 shadow-sm"
        >
          {t('btn.cancel')}
        </button>
        {isSaved ? (
          <button
            disabled
            className="px-6 py-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-400 dark:text-gray-500 cursor-not-allowed select-none transition-colors"
          >
            {t('lessonAttendance.lessonAlreadySaved')}
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-sm font-bold shadow-md shadow-purple-100/50 dark:shadow-none transition-colors"
          >
            {t('common.save')}
          </button>
        )}
      </div>
    </div>
  );
}
