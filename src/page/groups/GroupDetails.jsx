import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../api/axios";
import {
  getGroupVideos,
  uploadGroupVideo,
  getVideoFileUrl,
} from "../../api/video";
import CreateHomeworkModal from "../../components/CreateHomeworkModal";
import ExamsTab from "../../components/ExamsTab";
import { useLanguage } from "../../context/LanguageContext";

const getImageUrl = (photo) => {
  if (!photo || String(photo).includes("bane-profile.jpg"))
    return "/bane-profile.jpg";
  if (photo.startsWith("http") || photo.startsWith("blob:")) return photo;
  const path = photo.startsWith("/") ? photo : `/${photo}`;
  if (path.startsWith("/files/")) {
    return `https://najot-edu.softwareengineer.uz${path}`;
  }
  return `https://najot-edu.softwareengineer.uz/files${path}`;
};

export default function GroupDetails() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab state
  const [activeTab, setActiveTab] = useState("info");
  const [teachersMap, setTeachersMap] = useState({});
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videosList, setVideosList] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [customVideoName, setCustomVideoName] = useState("");
  const [videoBlobUrl, setVideoBlobUrl] = useState("");
  const [videoBlobLoading, setVideoBlobLoading] = useState(false);

  // Schedules states
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [isAllLessonsExpanded, setIsAllLessonsExpanded] = useState(false);

  // Real Lessons states
  const [groupLessons, setGroupLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  // Imtihonlar state
  const [exams, setExams] = useState([]);
  const [examsLoading, setExamsLoading] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examSaving, setExamSaving] = useState(false);
  const [examForm, setExamForm] = useState({
    name: "",
    start_time: "",
    duration: 60,
  });

  // Homeworks state
  const [homeworks, setHomeworks] = useState([]);
  const [homeworksLoading, setHomeworksLoading] = useState(false);

  // Attendance state
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const triggerAlert = (msg) => {
    setAlertMessage(msg);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  // Tab content visibility (useEffect dan oldin e'lon qilinishi shart)
  const [isMentorsVisible, setIsMentorsVisible] = useState(true);
  const [isParamsVisible, setIsParamsVisible] = useState(true);
  const [subTab, setSubTab] = useState("homework");

  // Sana formatlash — { date, time } qaytaradi (2 qatorda ko'rsatish uchun)
  const formatDT = (isoStr) => {
    if (!isoStr) return { date: "—", time: "" };
    try {
      const d = new Date(isoStr);
      const day = d.getDate();
      const monthNames = [
        "Yan",
        "Fev",
        "Mart",
        "Apr",
        "May",
        "Iyun",
        "Iyul",
        "Avg",
        "Sen",
        "Okt",
        "Noy",
        "Dek",
      ];
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return { date: `${day} ${month}, ${year}`, time: `${hh}:${mm}` };
    } catch {
      return { date: isoStr, time: "" };
    }
  };

  // Mock imtihonlar (API ishlamasa ko'rsatiladi)
  const mockExams = [
    {
      id: 7,
      name: "Examination",
      student_count: 12,
      failed_count: 0,
      status: "active",
      start_time: "2026-05-22T09:30:00",
      given_at: "2026-05-22T09:28:00",
      announced_at: null,
    },
    {
      id: 6,
      name: "Examination",
      student_count: 12,
      failed_count: 0,
      status: "finished",
      start_time: "2026-04-24T09:30:00",
      given_at: "2026-04-24T09:25:00",
      announced_at: "2026-04-27T10:30:00",
    },
    {
      id: 5,
      name: "Examination",
      student_count: 14,
      failed_count: 0,
      status: "finished",
      start_time: "2026-03-26T09:30:00",
      given_at: "2026-03-26T09:23:00",
      announced_at: "2026-03-30T14:34:00",
    },
    {
      id: 4,
      name: "Examination",
      student_count: 16,
      failed_count: 0,
      status: "finished",
      start_time: "2026-02-26T09:30:00",
      given_at: "2026-02-26T09:28:00",
      announced_at: "2026-03-02T13:32:00",
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setCustomVideoName(file.name);
    }
  };

  const getMockSchedules = () => {
    const mock = [];

    // 1-oy: May 2026
    const m1Days = [2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28, 30];
    m1Days.forEach((day) => {
      mock.push({
        id: `mock-1-${day}`,
        date: `2026-05-${String(day).padStart(2, "0")}T00:00:00.000Z`,
        topic: "Html asoslari",
      });
    });

    // 2-oy: Iyun 2026
    const m2Days = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27];
    m2Days.forEach((day) => {
      mock.push({
        id: `mock-2-${day}`,
        date: `2026-06-${String(day).padStart(2, "0")}T00:00:00.000Z`,
        topic: "JavaScript asoslari",
      });
    });

    // 3-oy: Iyul 2026
    const m3Days = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30];
    m3Days.forEach((day) => {
      mock.push({
        id: `mock-3-${day}`,
        date: `2026-07-${String(day).padStart(2, "0")}T00:00:00.000Z`,
        topic: "React kirish",
      });
    });

    return mock;
  };

  const getUzbekMonthName = (monthNum) => {
    const months = [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "Iyun",
      "Iyul",
      "Avgust",
      "Sentyabr",
      "Oktyabr",
      "Noyabr",
      "Dekabr",
    ];
    return months[monthNum] || "";
  };

  const getGroupedMonths = () => {
    const listToGroup =
      Array.isArray(schedules) && schedules.length > 0
        ? schedules
        : getMockSchedules();

    const groups = {};
    listToGroup.forEach((item) => {
      const dateVal =
        item.date ||
        item.lesson_date ||
        item.lessonDate ||
        item.start_time ||
        item.day ||
        item.created_at;
      if (!dateVal) return;

      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      const month = d.getMonth();
      const key = `${year}-${month}`;

      if (!groups[key]) {
        groups[key] = {
          key,
          year,
          month,
          monthName: getUzbekMonthName(month),
          lessons: [],
        };
      }
      groups[key].lessons.push({
        ...item,
        date: dateVal,
      });
    });

    const sortedKeys = Object.keys(groups).sort((a, b) => {
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });

    return sortedKeys.map((key, index) => {
      const monthLessons = groups[key].lessons.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      const apiIndex = monthLessons[0]?.monthIndex;
      return {
        ...groups[key],
        index: apiIndex !== undefined ? apiIndex : index + 1,
        lessons: monthLessons,
      };
    });
  };

  const isLessonActive = (lessonDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lessonDate = new Date(lessonDateStr);
    lessonDate.setHours(0, 0, 0, 0);
    return lessonDate <= today;
  };

  const getIsLessonCompleted = (lessonDateStr) => {
    const lDate = new Date(lessonDateStr);
    if (isNaN(lDate.getTime())) return false;
    const day = lDate.getDate();
    const month = lDate.getMonth() + 1;
    const year = lDate.getFullYear();
    const formattedDateParam = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    // 1. Check API attendanceData
    const hasApiAttendance = attendanceData.some((a) => {
      const aDateStr = a.created_at || a.date || a.lesson_date || a.lessonDate;
      if (!aDateStr) return false;
      const aDate = new Date(aDateStr);
      if (isNaN(aDate.getTime())) return false;
      return (
        aDate.getDate() === day &&
        aDate.getMonth() + 1 === month &&
        aDate.getFullYear() === year
      );
    });

    if (hasApiAttendance) return true;

    // 2. Check local storage
    try {
      const storedStr = localStorage.getItem(`attendance_saved_${id || "1"}`);
      if (storedStr) {
        const stored = JSON.parse(storedStr);
        return (
          stored.includes(formattedDateParam) || stored.includes(String(day))
        );
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const fetchSchedules = async (groupStartDate) => {
    try {
      setIsAllLessonsExpanded(false);
      setSchedulesLoading(true);
      let list = [];
      if (!isNaN(Number(id))) {
        const res = await axiosClient.get(`/groups/${id}/schedules`);
        if (res?.data?.success && Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        } else if (res?.data?.data && Array.isArray(res?.data?.data)) {
          list = res.data.data;
        }
      }

      // Parse nested schedules object if in backend format [ { "1": { isActive, days: [...] } } ]
      if (
        list.length > 0 &&
        typeof list[0] === "object" &&
        !list[0].date &&
        !list[0].lesson_date
      ) {
        const schedObj = list[0];
        const monthsMap = {
          january: 0,
          february: 1,
          march: 2,
          april: 3,
          may: 4,
          june: 5,
          july: 6,
          august: 7,
          september: 8,
          october: 9,
          november: 10,
          december: 11,
        };

        const start = groupStartDate ? new Date(groupStartDate) : new Date();
        const startYear = start.getFullYear();
        const startMonth = start.getMonth();

        const parsedSchedules = [];
        Object.keys(schedObj).forEach((monthKey) => {
          const monthBlock = schedObj[monthKey];
          if (monthBlock && Array.isArray(monthBlock.days)) {
            monthBlock.days.forEach((dayItem, idx) => {
              const monthName = dayItem.month;
              const dayNum = dayItem.day;
              const isCompleted = dayItem.isCompleted;

              const targetMonth = monthsMap[monthName.toLowerCase()] ?? 0;
              let targetYear = startYear;
              if (targetMonth < startMonth) {
                targetYear = startYear + 1;
              }

              const dateVal = new Date(
                targetYear,
                targetMonth,
                dayNum,
                12,
                0,
                0,
                0,
              ).toISOString();

              parsedSchedules.push({
                id: dayItem.id || `schedule-${monthKey}-${idx}-${dayNum}`,
                date: dateVal,
                topic: dayItem.topic || "Dars",
                isCompleted: isCompleted,
                monthIndex: Number(monthKey),
                isActiveMonth: !!monthBlock.isActive,
              });
            });
          }
        });
        list = parsedSchedules;
      }

      setSchedules(list);

      // Dynamically calculate active month index
      if (list.length > 0) {
        const tempGroups = {};
        list.forEach((item) => {
          const d = new Date(item.date);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = d.getMonth();
            const key = `${year}-${month}`;
            if (!tempGroups[key]) {
              tempGroups[key] = { key, year, month, lessons: [] };
            }
            tempGroups[key].lessons.push(item);
          }
        });

        const sortedKeys = Object.keys(tempGroups).sort((a, b) => {
          const [yearA, monthA] = a.split("-").map(Number);
          const [yearB, monthB] = b.split("-").map(Number);
          return yearA !== yearB ? yearA - yearB : monthA - monthB;
        });

        let activeIdx = -1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedKeys.length; i++) {
          const key = sortedKeys[i];
          const monthLessons = tempGroups[key].lessons;
          if (monthLessons.some((l) => l.isActiveMonth)) {
            activeIdx = i;
            break;
          }
        }

        if (activeIdx === -1) {
          for (let i = 0; i < sortedKeys.length; i++) {
            const key = sortedKeys[i];
            const monthLessons = tempGroups[key].lessons;
            if (monthLessons.some((l) => new Date(l.date) >= today)) {
              activeIdx = i;
              break;
            }
          }
        }

        setActiveMonthIndex(activeIdx >= 0 ? activeIdx : 0);
      } else {
        setActiveMonthIndex(0);
      }
    } catch (err) {
      console.error(
        "Fetch schedules error:",
        err?.response?.data || err.message,
      );
      setSchedules([]);
      setActiveMonthIndex(0);
    } finally {
      setSchedulesLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (activeMonthIndex > 0) {
      setActiveMonthIndex(activeMonthIndex - 1);
      setIsAllLessonsExpanded(false);
    }
  };

  const handleNextMonth = () => {
    const grouped = getGroupedMonths();
    if (activeMonthIndex < grouped.length - 1) {
      setActiveMonthIndex(activeMonthIndex + 1);
      setIsAllLessonsExpanded(false);
    }
  };

  const transformVideo = (item) => {
    const formatted = formatDT(item.created_at || item.createdAt);

    let sizeStr = "0.00 MB";
    if (typeof item.size_mb === "number") {
      sizeStr = `${item.size_mb.toFixed(2)} MB`;
    } else if (item.size) {
      if (typeof item.size === "number") {
        sizeStr = `${(item.size / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        sizeStr = String(item.size);
      }
    }

    const fileUrlOrPath = item.video_url || item.url || item.path || "";
    const vUrl = getVideoFileUrl(fileUrlOrPath);

    let topicName = "Mavzu";
    if (item.lesson && typeof item.lesson === "object") {
      topicName =
        item.lesson.topic || item.lesson.title || item.lesson.name || "Mavzu";
    } else if (item.topic) {
      topicName =
        typeof item.topic === "object"
          ? item.topic.topic || item.topic.title || item.topic.name || "Mavzu"
          : item.topic;
    } else if (item.lesson) {
      topicName = String(item.lesson);
    }

    const defaultVideoUrl =
      "https://najot-edu.softwareengineer.uz/files/files/1780340713500.mp4";

    return {
      id: item.id || Math.random(),
      videoName:
        item.originalname ||
        item.title ||
        item.name ||
        item.filename ||
        item.original_name ||
        "Bitiruv.mp4",
      topic: topicName,
      status: item.status || "Tayyor",
      lessonDate: formatted.date || "29 May, 2026",
      size: sizeStr,
      addedTime: formatted.date
        ? `${formatted.date} ${formatted.time}`
        : "29 May, 2026",
      videoUrl: vUrl || defaultVideoUrl,
      src: vUrl || defaultVideoUrl,
    };
  };

  const fetchVideos = async () => {
    try {
      setVideosLoading(true);
      let list = [];
      if (!isNaN(Number(id))) {
        list = await getGroupVideos(id);
      }

      const defaultVideoUrl =
        "https://najot-edu.softwareengineer.uz/files/files/1780340713500.mp4";
      if (list.length === 0) {
        // Fallback mock videos list if empty
        setVideosList([
          {
            id: "mock-vid-1",
            videoName: "1-dars. Kirish va Asoslar.mp4",
            topic: "JS Asoslari",
            status: "Tayyor",
            lessonDate: "01.06.2026",
            size: "14.50 MB",
            addedTime: "01.06.2026 09:00",
            videoUrl: defaultVideoUrl,
            src: defaultVideoUrl,
          },
          {
            id: "mock-vid-2",
            videoName: "2-dars. HTML & CSS Chuqur O'rganish.mp4",
            topic: "HTML & CSS",
            status: "Tayyor",
            lessonDate: "03.06.2026",
            size: "18.20 MB",
            addedTime: "03.06.2026 09:00",
            videoUrl: defaultVideoUrl,
            src: defaultVideoUrl,
          },
        ]);
      } else {
        setVideosList(list.map(transformVideo));
      }
    } catch (err) {
      console.error("Fetch videos error:", err?.response?.data || err.message);
      const defaultVideoUrl =
        "https://najot-edu.softwareengineer.uz/files/files/1780340713500.mp4";
      setVideosList([
        {
          id: "mock-vid-1",
          videoName: "1-dars. Kirish va Asoslar.mp4",
          topic: "JS Asoslari",
          status: "Tayyor",
          lessonDate: "01.06.2026",
          size: "14.50 MB",
          addedTime: "01.06.2026 09:00",
          videoUrl: defaultVideoUrl,
          src: defaultVideoUrl,
        },
        {
          id: "mock-vid-2",
          videoName: "2-dars. HTML & CSS Chuqur O'rganish.mp4",
          topic: "HTML & CSS",
          status: "Tayyor",
          lessonDate: "03.06.2026",
          size: "18.20 MB",
          addedTime: "03.06.2026 09:00",
          videoUrl: defaultVideoUrl,
          src: defaultVideoUrl,
        },
      ]);
    } finally {
      setVideosLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      setLessonsLoading(true);
      const res = await axiosClient.get("/lessons");
      let list = [];
      if (res?.data?.success && Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (res?.data?.sucess && Array.isArray(res?.data?.data)) {
        // Handle backend typos
        list = res.data.data;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (res?.data?.data && Array.isArray(res?.data?.data)) {
        list = res.data.data;
      }
      // Filter lessons belonging to the current group
      const filtered = list.filter((l) => Number(l.group_id) === Number(id));
      setGroupLessons(filtered);
    } catch (err) {
      console.error("Fetch lessons error:", err?.response?.data || err.message);
      // Fallback mock lessons to keep it in sync with student homework detail
      setGroupLessons([
        { id: 1, topic: "NextJs", date: "2026-06-11", videoCount: 0 },
        {
          id: 2,
          topic: "crm teacher panel",
          date: "2026-06-17",
          videoCount: 2,
        },
        { id: 3, topic: "Imtihon", date: "2026-06-02", videoCount: 0 },
        { id: 4, topic: "State and Props", date: "2026-05-21", videoCount: 1 },
        { id: 5, topic: "takrorlash", date: "2026-05-20", videoCount: 1 },
        { id: 6, topic: "Nodejs", date: "2026-05-14", videoCount: 1 },
        { id: 7, topic: "Html asoslari", date: "2026-05-12", videoCount: 1 },
        { id: 8, topic: "CSS asoslari", date: "2026-05-08", videoCount: 1 },
      ]);
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleUploadVideos = async () => {
    if (!selectedLesson) {
      triggerAlert("Iltimos, darsni tanlang");
      return;
    }
    if (!customVideoName) {
      triggerAlert("Iltimos, video nomini kiriting");
      return;
    }
    if (!uploadedFile || !(uploadedFile instanceof File)) {
      triggerAlert("Iltimos, haqiqiy video faylini tanlab yuklang!");
      return;
    }

    try {
      setVideosLoading(true);
      await uploadGroupVideo(id, selectedLesson, customVideoName, uploadedFile);

      triggerAlert("Video muvaffaqiyatli yuklandi!");
      setIsVideoModalOpen(false);
      setUploadedFile(null);
      setSelectedLesson("");
      setCustomVideoName("");
      fetchVideos();
    } catch (err) {
      console.error("Upload video error:", err?.response?.data || err.message);
      triggerAlert(
        err?.response?.data?.message || "Videoni yuklashda xatolik yuz berdi",
      );
    } finally {
      setVideosLoading(false);
    }
  };

  // Imtihonlarni API dan olish
  const fetchExams = async () => {
    try {
      setExamsLoading(true);
      let list = [];
      if (!isNaN(Number(id))) {
        const res = await axiosClient.get(`/exams/group/${id}`);
        if (res?.data?.success && Array.isArray(res?.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res?.data)) {
          list = res.data;
        }
      }
      setExams(list);
    } catch (err) {
      console.error("Fetch exams error:", err?.response?.data || err.message);
      setExams([]);
    } finally {
      setExamsLoading(false);
    }
  };

  // Homeworklarni API dan olish
  const fetchHomeworks = async () => {
    try {
      setHomeworksLoading(true);
      let list = [];
      if (!isNaN(Number(id))) {
        try {
          const res = await axiosClient.get(`/homework/group/${id}`);
          if (res?.data?.success && Array.isArray(res?.data?.data)) {
            list = res.data.data;
          } else if (Array.isArray(res?.data)) {
            list = res.data;
          } else if (res?.data?.data && Array.isArray(res?.data?.data)) {
            list = res.data.data;
          }
        } catch (grpErr) {
          console.warn(
            "Fetch group homeworks failed, falling back to /homework/all:",
            grpErr.message,
          );
          const res = await axiosClient.get("/homework/all");
          let allList = [];
          if (res?.data?.success && Array.isArray(res?.data?.data)) {
            allList = res.data.data;
          } else if (Array.isArray(res?.data)) {
            allList = res.data;
          } else if (res?.data?.data && Array.isArray(res?.data?.data)) {
            allList = res.data.data;
          }
          list = allList.filter((hw) => Number(hw.group_id) === Number(id));
        }
      }

      // Preserve any local `unreviewed` state for newly created homework rows.
      const existingHomeworks = new Map(
        homeworks.map((prev) => [prev.id, prev]),
      );
      const getUnreviewed = (hwId, acceptedCount) =>
        Boolean(existingHomeworks.get(hwId)?.unreviewed) &&
        Number(acceptedCount) === 0;

      // Adjust counts based on local storage submissions or fetch from API
      const updatedList = await Promise.all(
        list.map(async (hw) => {
          try {
            const key = `homework_submissions_${id}_${hw.id}`;
            const stored = localStorage.getItem(key);
            if (stored) {
              const subs = JSON.parse(stored);
              const pendingCount = subs.filter(
                (s) => s.status === "waiting",
              ).length;
              const acceptedCount = subs.filter(
                (s) => s.status === "accepted",
              ).length;
              return {
                ...hw,
                homeworkPending: pendingCount,
                homeworkAccept: acceptedCount,
                unreviewed: getUnreviewed(hw.id, acceptedCount),
              };
            }

            // Otherwise, fetch from API!
            // Try to fetch ACCEPTED and PENDING submissions for this homework
            const [pendingRes, acceptedRes] = await Promise.all([
              axiosClient
                .get(`/group/${id}/homework/${hw.id}/results?status=PENDING`)
                .catch(() => null),
              axiosClient
                .get(`/group/${id}/homework/${hw.id}/results?status=ACCEPTED`)
                .catch(() => null),
            ]);

            const getCountFromRes = (response) => {
              if (response && response.data && response.data.success) {
                const resData = response.data.data;
                if (resData && Array.isArray(resData.students)) {
                  return resData.students.length;
                }
                if (Array.isArray(response.data.students)) {
                  return response.data.students.length;
                }
                if (Array.isArray(resData)) {
                  return resData.length;
                }
              }
              return 0;
            };

            const pendingCount = getCountFromRes(pendingRes);
            const acceptedCount = getCountFromRes(acceptedRes);

            return {
              ...hw,
              homeworkPending: pendingCount,
              homeworkAccept: acceptedCount,
              unreviewed: getUnreviewed(hw.id, acceptedCount),
            };
          } catch (e) {
            console.error(hw, e);
            const pendingCount = hw.homeworkPending ?? 0;
            const acceptedCount = hw.homeworkAccept ?? 0;
            return {
              ...hw,
              homeworkPending: pendingCount,
              homeworkAccept: acceptedCount,
              unreviewed: getUnreviewed(hw.id, acceptedCount),
            };
          }
        }),
      );
      setHomeworks(updatedList);
    } catch (err) {
      console.error(
        "Fetch homeworks error:",
        err?.response?.data || err.message,
      );
      setHomeworks([]);
    } finally {
      setHomeworksLoading(false);
    }
  };

  // Attendance API dan olish
  const fetchAttendance = async () => {
    try {
      setAttendanceLoading(true);
      const res = await axiosClient.get("/attendance/all");
      let list = [];
      if (res?.data?.success && Array.isArray(res?.data?.data)) {
        list = res.data.data;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
      } else if (res?.data?.data && Array.isArray(res?.data?.data)) {
        list = res.data.data;
      }
      // Filter only this group's attendance
      const filtered = list.filter((a) => {
        const gid = a.group_id || a.groupId || (a.group && a.group.id);
        return Number(gid) === Number(id);
      });
      setAttendanceData(filtered);
    } catch (err) {
      console.error(
        "Fetch attendance error:",
        err?.response?.data || err.message,
      );
      setAttendanceData([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    let url = "";

    const loadVideoBlob = async () => {
      if (!selectedVideo) {
        setVideoBlobUrl("");
        return;
      }

      // Check if it's an API endpoint that needs Authorization header
      // Static resource files do not need it and should bypass blob fetching
      const isBackendApiUrl =
        selectedVideo.videoUrl &&
        ((selectedVideo.videoUrl.includes(
          "najot-edu.softwareengineer.uz/api/v1",
        ) &&
          !selectedVideo.videoUrl.includes("/files/")) ||
          (selectedVideo.videoUrl.startsWith("/") &&
            !selectedVideo.videoUrl.startsWith("/files/")) ||
          (!selectedVideo.videoUrl.startsWith("http") &&
            !selectedVideo.videoUrl.includes("/files/")));

      if (!isBackendApiUrl) {
        setVideoBlobUrl(selectedVideo.videoUrl);
        return;
      }

      try {
        setVideoBlobLoading(true);
        let endpoint = "";
        if (selectedVideo.videoUrl.startsWith("http")) {
          endpoint = selectedVideo.videoUrl.replace(
            "https://najot-edu.softwareengineer.uz/api/v1",
            "",
          );
        } else {
          endpoint = selectedVideo.videoUrl;
        }

        const response = await axiosClient.get(endpoint, {
          responseType: "blob",
        });

        if (active) {
          url = URL.createObjectURL(response.data);
          setVideoBlobUrl(url);
        }
      } catch (err) {
        console.error("Error fetching video blob:", err);
        if (active) {
          setVideoBlobUrl(selectedVideo.videoUrl);
        }
      } finally {
        if (active) {
          setVideoBlobLoading(false);
        }
      }
    };

    loadVideoBlob();

    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [selectedVideo]);

  useEffect(() => {
    const init = async () => {
      let startDateVal = null;
      try {
        setLoading(true);
        const role = window.localStorage.getItem("role") || "TEACHER";
        let res = null;
        const isTeacher = role === "TEACHER";

        if (isTeacher) {
          try {
            const [myGroupsRes, profileRes] = await Promise.all([
              axiosClient.get("/teachers/my/groups"),
              axiosClient.get("/teachers/my/profile").catch(() => null),
            ]);
            const myGroupsList = myGroupsRes?.data?.success
              ? myGroupsRes.data.data
              : Array.isArray(myGroupsRes?.data)
                ? myGroupsRes.data
                : [];
            const matchingGroup = myGroupsList.find(
              (g) => Number(g.id) === Number(id),
            );
            if (matchingGroup) {
              const teacherProfile = profileRes?.data?.success
                ? profileRes.data.data
                : profileRes?.data || null;
              if (teacherProfile && teacherProfile.full_name) {
                matchingGroup.teacher = {
                  full_name: teacherProfile.full_name,
                  name: teacherProfile.full_name,
                };
                if (
                  !matchingGroup.teachers ||
                  matchingGroup.teachers.length === 0
                ) {
                  matchingGroup.teachers = [
                    {
                      id: teacherProfile.id,
                      full_name: teacherProfile.full_name,
                      photo: teacherProfile.photo,
                    },
                  ];
                } else {
                  const exists = matchingGroup.teachers.some(
                    (t) => t.id === teacherProfile.id,
                  );
                  if (!exists) {
                    matchingGroup.teachers.unshift({
                      id: teacherProfile.id,
                      full_name: teacherProfile.full_name,
                      photo: teacherProfile.photo,
                    });
                  }
                }
              }
              res = { data: { success: true, data: matchingGroup } };
            }
          } catch (teacherErr) {
            console.error(
              "Fetch teacher groups or profile failed:",
              teacherErr.message,
            );
          }
        }

        if (!res) {
          try {
            res = await axiosClient.get(`/groups/one/${id}`);
          } catch (err) {
            console.warn(
              "GET /groups/one/:id failed, falling back to /teachers/my/groups:",
              err.message,
            );
            try {
              const [myGroupsRes, profileRes] = await Promise.all([
                axiosClient.get("/teachers/my/groups"),
                axiosClient.get("/teachers/my/profile").catch(() => null),
              ]);
              const myGroupsList = myGroupsRes?.data?.success
                ? myGroupsRes.data.data
                : Array.isArray(myGroupsRes?.data)
                  ? myGroupsRes.data
                  : [];
              const matchingGroup = myGroupsList.find(
                (g) => Number(g.id) === Number(id),
              );
              if (matchingGroup) {
                const teacherProfile = profileRes?.data?.success
                  ? profileRes.data.data
                  : profileRes?.data || null;
                if (teacherProfile && teacherProfile.full_name) {
                  matchingGroup.teacher = {
                    full_name: teacherProfile.full_name,
                    name: teacherProfile.full_name,
                  };
                  if (
                    !matchingGroup.teachers ||
                    matchingGroup.teachers.length === 0
                  ) {
                    matchingGroup.teachers = [
                      {
                        id: teacherProfile.id,
                        full_name: teacherProfile.full_name,
                        photo: teacherProfile.photo,
                      },
                    ];
                  } else {
                    const exists = matchingGroup.teachers.some(
                      (t) => t.id === teacherProfile.id,
                    );
                    if (!exists) {
                      matchingGroup.teachers.unshift({
                        id: teacherProfile.id,
                        full_name: teacherProfile.full_name,
                        photo: teacherProfile.photo,
                      });
                    }
                  }
                }
                res = { data: { success: true, data: matchingGroup } };
              }
            } catch (fallbackErr) {
              console.error(
                "Fallback fetch teacher groups failed:",
                fallbackErr.message,
              );
            }
          }
        }

        if (!res) {
          try {
            const localGroups = JSON.parse(window.localStorage.getItem("local_groups") || "[]");
            const localMatch = localGroups.find(g => String(g.id) === String(id));
            if (localMatch) {
              // Resolve student details
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

              res = {
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
            console.error("Local group resolution failed:", localErr);
          }
        }

        const [activeRes, archiveRes] = await Promise.all([
          axiosClient.get("/teachers").catch(() => null),
          axiosClient.get("/teachers/archive").catch(() => null),
        ]);

        // Build combined map of all teachers
        const activeList = activeRes?.data?.success
          ? activeRes.data.data
          : Array.isArray(activeRes?.data)
            ? activeRes.data
            : [];
        const archiveList = archiveRes?.data?.success
          ? archiveRes.data.data
          : Array.isArray(archiveRes?.data)
            ? archiveRes.data
            : [];
        const combined = [...activeList, ...archiveList];
        const map = {};
        combined.forEach((t) => {
          if (t && t.id) {
            map[t.id] = t;
          }
        });
        setTeachersMap(map);

        if (res?.data?.success && res?.data?.data) {
          const item = res.data.data;
          startDateVal = item.start_date;

          // Fallback: If group object has no students (or empty array), attempt to load all students and filter by group ID.
          if (
            (!item.students || item.students.length === 0) &&
            !isNaN(Number(id))
          ) {
            try {
              const studentsRes = await axiosClient
                .get("/students")
                .catch(() => null);
              const studentsData = studentsRes?.data?.success
                ? studentsRes.data.data
                : Array.isArray(studentsRes?.data)
                  ? studentsRes.data
                  : studentsRes?.data?.data || [];
              if (Array.isArray(studentsData)) {
                const filteredStudents = studentsData.filter((student) => {
                  const sGroupIds = Array.isArray(student.groups)
                    ? student.groups.map((g) =>
                        typeof g === "object" ? g.id : g,
                      )
                    : Array.isArray(student.groupIds)
                      ? student.groupIds
                      : [];
                  return sGroupIds.map(Number).includes(Number(id));
                });
                if (filteredStudents.length > 0) {
                  item.students = filteredStudents.map((student) => ({
                    id: student.id,
                    full_name:
                      student.name || student.full_name || "Noma'lum talaba",
                    name:
                      student.name || student.full_name || "Noma'lum talaba",
                    phone: student.phone || "—",
                    avatarSeed: student.name || student.full_name || "User",
                  }));
                }
              }
            } catch (studentErr) {
              console.error(
                "Failed to load group students via fallback:",
                studentErr.message,
              );
            }
          }

          const teacherStr =
            Array.isArray(item.teachers) && item.teachers.length > 0
              ? item.teachers.map((t) => t.full_name).join(", ")
              : item.teacher?.full_name || item.teacher?.name || "—";

          setGroupInfo({
            name: item.name || "—",
            status: "FAOL",
            course: item.course?.name || "—",
            duration: item.course?.duration_month
              ? String(item.course.duration_month)
              : "6.0",
            teacher: teacherStr,
            studentsCount: item.student_count || item.students?.length || 0,
            room: item.room || "—",
            avgAge: 16,
            capacity: 20,
            monthlyLessons: 20,
            totalLessons: 20,
            students: item.students || [],
            teachers: item.teachers || [],
            startDate: item.start_date,
          });
        }
      } catch (err) {
        console.error(
          "Fetch group details error:",
          err?.response?.data || err.message,
        );
      } finally {
        setLoading(false);
      }
      fetchSchedules(startDateVal);
    };

    init();
  }, [id]);

  // Imtihonlar tabiga o'tilganda fetch
  useEffect(() => {
    if (activeTab === "syllabus" && subTab === "exams") {
      fetchExams();
    }
  }, [activeTab, subTab, id]);

  // Uyga vazifalar tabiga o'tilganda fetch
  useEffect(() => {
    if (activeTab === "syllabus" && subTab === "homework") {
      fetchHomeworks();
    }
  }, [activeTab, subTab, id]);

  // Videolar tabiga o'tilganda fetch
  useEffect(() => {
    if (activeTab === "syllabus" && subTab === "videos") {
      fetchVideos();
      fetchLessons();
    }
  }, [activeTab, subTab, id]);

  // Attendance tabiga o'tilganda fetch
  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendance();
    }
  }, [activeTab, id]);

  const defaultGroup = {
    name: "Bootcamp Full Stack N26",
    status: "FAOL",
    course: "Backend",
    duration: "6.0",
    teacher: "Mohirbek",
    studentsCount: 4,
    room: "Autodesk",
    avgAge: 15,
    capacity: 20,
    monthlyLessons: 20,
    totalLessons: 20,
    teachers: [{ id: 1, full_name: "Mohirbek" }],
    students: [
      { id: 1, full_name: "Ali Valiyev" },
      { id: 2, full_name: "Salim Qodirov" },
      { id: 3, full_name: "Bobur" },
      { id: 4, full_name: "Qodir Salimov" },
    ],
  };

  const currentGroup = groupInfo || defaultGroup;

  const groupedMonths = getGroupedMonths();
  const currentMonthData = groupedMonths[activeMonthIndex] || null;

  const currentLessons = currentMonthData ? currentMonthData.lessons : [];

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

      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/groups")}
            className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {currentGroup.name}
            </h1>
            <span className="px-2.5 py-0.5 bg-green-100 dark:bg-green-900/35 text-green-600 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {currentGroup.status === "FAOL"
                ? t("groupDetail.active")
                : t("groupDetail.inactive")}
            </span>
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm font-bold text-sm">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"
            />
          </svg>
          {t("groupDetail.statistics")}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-px">
        <button
          onClick={() => setActiveTab("info")}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === "info"
              ? "text-[#7C3AED] dark:text-purple-400"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {t("groupDetail.info")}
          {activeTab === "info" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("syllabus")}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === "syllabus"
              ? "text-[#7C3AED] dark:text-purple-400"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {t("groupDetail.syllabus")}
          {activeTab === "syllabus" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === "attendance"
              ? "text-[#7C3AED] dark:text-purple-400"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {t("groupDetail.attendance")}
          {activeTab === "attendance" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px]">
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative z-10">
            {/* Guruh mentorlari Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#3B82F6] px-6 py-4 flex items-center justify-between text-white">
                <h3 className="font-bold text-[15px]">
                  {t("groupDetail.mentors")}
                </h3>
                <button
                  onClick={() => setIsMentorsVisible(!isMentorsVisible)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  {isMentorsVisible ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {isMentorsVisible && (
                <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.isArray(currentGroup.teachers) &&
                  currentGroup.teachers.length > 0 ? (
                    currentGroup.teachers.map((teacher, idx) => {
                      const teacherId =
                        typeof teacher === "object" ? teacher.id : teacher;
                      const fullTeacher = teachersMap[teacherId] || {};
                      const teacherPhoto =
                        fullTeacher.photo ||
                        fullTeacher.avatar ||
                        fullTeacher.image ||
                        (typeof teacher === "object"
                          ? teacher.photo || teacher.avatar || teacher.image
                          : null);
                      const photoUrlRaw = teacherPhoto
                        ? getImageUrl(teacherPhoto)
                        : null;
                      const photoUrl = photoUrlRaw || "/bane-profile.jpg";

                      const teacherName =
                        fullTeacher.full_name ||
                        (typeof teacher === "object"
                          ? teacher.full_name || teacher.name
                          : null) ||
                        `O'qituvchi #${teacherId}`;

                      return (
                        <div
                          key={teacherId || idx}
                          className="bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center gap-4"
                        >
                          <img
                            src={photoUrl}
                            alt={teacherName}
                            className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-gray-700 border border-blue-100 dark:border-gray-600 object-cover shadow-sm"
                            onError={(e) => {
                              e.target.src = "/bane-profile.jpg";
                            }}
                          />
                          <div className="min-w-0">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
                                idx === 0
                                  ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-300"
                                  : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-300"
                              }`}
                            >
                              {idx === 0 ? "Teacher" : "Assistant"}
                            </span>
                            <h4 className="text-base font-bold text-gray-800 dark:text-white truncate">
                              {teacherName}
                            </h4>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex items-center gap-4">
                      <img
                        src="/bane-profile.jpg"
                        alt={currentGroup.teacher}
                        className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-gray-700 border border-blue-100 dark:border-gray-600 object-cover"
                      />
                      <div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-300">
                          Teacher
                        </span>
                        <h4 className="text-base font-bold text-gray-800 dark:text-white">
                          {currentGroup.teacher}
                        </h4>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Parametrlar Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-[#3B82F6] px-6 py-4 flex items-center justify-between text-white">
                <h3 className="font-bold text-[15px]">
                  {t("groupDetail.params")}
                </h3>
                <button
                  onClick={() => setIsParamsVisible(!isParamsVisible)}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg flex items-center justify-center cursor-pointer"
                >
                  {isParamsVisible ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {isParamsVisible && (
                <div className="p-6 divide-y divide-gray-100 dark:divide-gray-700 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.courseLabel")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.course}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.avgAge")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.avgAge}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.capacity")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.capacity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.currentStudents")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.studentsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.monthlyLessons")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.monthlyLessons}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.courseDuration")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {t("groupDetail.totalLessons")}
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentGroup.totalLessons}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Dars jadvali Section */}
            <div className="col-span-1 md:col-span-2 mt-8 space-y-4 z-10 relative">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {t("groupDetail.schedule")}
              </h3>

              <div className="space-y-3">
                {/* Row 1 */}
                <div className="bg-white dark:bg-gray-800 p-5 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      Mohirbek
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[120px]">
                    Du/Se/Ch/Pa/Ju
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-white min-w-[150px]">
                    09:30 dan - 12:30 gacha
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[180px]">
                    15 Yan, 2026 - 27 Iyun, 2026
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    F2 Autodesk // 18
                  </div>
                </div>

                {/* Row 2 */}
                <div className="bg-white dark:bg-gray-800 p-5 border border-gray-100 dark:border-gray-700 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                      +++Yusupova Barchinoy
                    </span>
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[120px]">
                    Du/Se/Ch/Pa/Ju
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-white min-w-[150px]">
                    08:00 dan - 09:30 gacha
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 min-w-[180px]">
                    15 Yan, 2026 - 27 Iyun, 2026
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    F2 Autodesk // 18
                  </div>
                </div>
              </div>

              {/* Yana ko'rsatish Button */}
              <div className="flex justify-center pt-2">
                <button className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  Yana ko'rsatish (9)
                </button>
              </div>
            </div>

            {/* O'quv oyi & Kunlar Carousel */}
            <div className="col-span-1 md:col-span-2 mt-8 border-t border-gray-100 dark:border-gray-800 pt-8 space-y-6 z-10 relative">
              {!isAllLessonsExpanded ? (
                <>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevMonth}
                      disabled={activeMonthIndex === 0}
                      className={`w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm ${activeMonthIndex === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {currentMonthData
                        ? `${currentMonthData.monthName} oyi`
                        : "O'quv oyi"}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      disabled={activeMonthIndex === groupedMonths.length - 1}
                      className={`w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm ${activeMonthIndex === groupedMonths.length - 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <svg
                        className="w-4 h-4 text-gray-600 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Horizontal Date carousel */}
                  <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
                    {schedulesLoading ? (
                      <div className="py-4 text-gray-400 font-semibold text-xs flex items-center gap-2">
                        <svg
                          className="w-4 h-4 animate-spin text-[#7C3AED]"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        <span>{t("groupDetail.loading")}</span>
                      </div>
                    ) : currentLessons.length === 0 ? (
                      <div className="py-4 text-gray-400 dark:text-gray-500 font-semibold text-xs">
                        {t("groupDetail.noLessons")}
                      </div>
                    ) : (
                      currentLessons.map((lesson, index) => {
                        const lDate = new Date(lesson.date);
                        const dayNum = lDate.getDate();
                        const active = isLessonActive(lesson.date);
                        const monthShort = currentMonthData.monthName.substring(
                          0,
                          3,
                        );
                        const y = lDate.getFullYear();
                        const m = String(lDate.getMonth() + 1).padStart(2, "0");
                        const d = String(lDate.getDate()).padStart(2, "0");
                        const dateUrlParam = `${y}-${m}-${d}`;
                        const isCompleted = getIsLessonCompleted(lesson.date);

                        return (
                          <div
                            key={lesson.id || index}
                            onClick={() => {
                              if (active) {
                                navigate(
                                  `/dashboard/groups/${id || "1"}/lesson/${dateUrlParam}`,
                                );
                              } else {
                                triggerAlert("Dars vaqti hali kelmagan");
                              }
                            }}
                            className={`flex flex-col items-center ${isCompleted ? "justify-between" : "justify-center gap-1"} p-2 min-w-[72px] h-[80px] rounded-2xl border transition-all relative ${
                              isCompleted
                                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 cursor-pointer hover:border-emerald-400"
                                : active
                                  ? "bg-gray-50 dark:bg-gray-700/20 border-gray-100 dark:border-gray-700/50 text-gray-400 dark:text-gray-500 cursor-pointer hover:border-[#7C3AED]"
                                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#7C3AED] dark:hover:border-purple-400 cursor-pointer shadow-sm"
                            }`}
                          >
                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                              {monthShort}
                            </span>
                            <span className="text-xl font-black leading-none">
                              {dayNum}
                            </span>
                            {isCompleted && (
                              <span className="text-[7.5px] font-extrabold uppercase px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/35 text-emerald-700 dark:text-emerald-300 tracking-tight leading-none text-center">
                                {t("lessonAttendance.lessonCompleted")}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                // Stacked display of all months when expanded
                <div className="space-y-8 animate-in fade-in duration-300">
                  {groupedMonths.map((monthData, mIdx) => {
                    const isCurrentMonth =
                      monthData.lessons.some((l) => l.isActiveMonth) ||
                      mIdx === activeMonthIndex;

                    return (
                      <div key={monthData.key || mIdx} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-bold text-gray-800 dark:text-white">
                            {monthData.monthName} oyi
                          </h4>
                          {isCurrentMonth && (
                            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold">
                              {t("groupDetail.currentMonth")}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 py-2">
                          {monthData.lessons.map((lesson, index) => {
                            const lDate = new Date(lesson.date);
                            const dayNum = lDate.getDate();
                            const active = isLessonActive(lesson.date);
                            const monthShort = monthData.monthName.substring(
                              0,
                              3,
                            );
                            const y = lDate.getFullYear();
                            const m = String(lDate.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const d = String(lDate.getDate()).padStart(2, "0");
                            const dateUrlParam = `${y}-${m}-${d}`;
                            const isCompleted = getIsLessonCompleted(
                              lesson.date,
                            );

                            return (
                              <div
                                key={lesson.id || index}
                                onClick={() => {
                                  if (active) {
                                    navigate(
                                      `/dashboard/groups/${id || "1"}/lesson/${dateUrlParam}`,
                                    );
                                  } else {
                                    triggerAlert("Dars vaqti hali kelmagan");
                                  }
                                }}
                                className={`flex flex-col items-center ${isCompleted ? "justify-between" : "justify-center gap-1"} p-2 min-w-[72px] h-[80px] rounded-2xl border transition-all relative ${
                                  isCompleted
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 cursor-pointer hover:border-emerald-400"
                                    : active
                                      ? "bg-gray-50 dark:bg-gray-700/20 border-gray-100 dark:border-gray-700/50 text-gray-400 dark:text-gray-500 cursor-pointer hover:border-[#7C3AED]"
                                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#7C3AED] dark:hover:border-purple-400 cursor-pointer shadow-sm"
                                }`}
                              >
                                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                                  {monthShort}
                                </span>
                                <span className="text-xl font-black leading-none">
                                  {dayNum}
                                </span>
                                {isCompleted && (
                                  <span className="text-[7.5px] font-extrabold uppercase px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/35 text-emerald-700 dark:text-emerald-300 tracking-tight leading-none text-center">
                                    {t("lessonAttendance.lessonCompleted")}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Barchasini ko'rish / Kamroq ko'rsatish Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setIsAllLessonsExpanded(!isAllLessonsExpanded)}
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm cursor-pointer"
                >
                  {isAllLessonsExpanded
                    ? t("groupDetail.showLess")
                    : t("groupDetail.showAll")}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "syllabus" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
            {/* ===== HEADER: sarlavha + tablar + tugma ===== */}
            <div className="px-6 pt-5 pb-0">
              {/* Sarlavha + "Yangi imtihon" tugmasi */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-bold text-gray-800 dark:text-white">
                  {t("groupDetail.syllabus")}
                </h3>
                {subTab === "exams" && (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/groups/${id}/exam/create`)
                    }
                    className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {t("groupDetail.newExam")}
                  </button>
                )}
                {subTab === "homework" && (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/groups/${id}/homework/create`)
                    }
                    className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {t("btn.add")}
                  </button>
                )}
                {subTab === "videos" && (
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setCustomVideoName("");
                      setSelectedLesson("");
                      setIsVideoModalOpen(true);
                    }}
                    className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {t("groupDetail.addVideo")}
                  </button>
                )}
              </div>

              {/* Border-bottom style sub-tabs — rasmga mos */}
              <div className="flex items-center border-b border-gray-100 dark:border-gray-700">
                {[
                  { id: "homework", label: t("groupDetail.homework") },
                  { id: "videos", label: t("groupDetail.videos") },
                  { id: "exams", label: t("groupDetail.exams") },
                  { id: "journal", label: t("groupDetail.journal") },
                ].map((tab) => {
                  const isActive = subTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSubTab(tab.id)}
                      className={`px-4 py-2 text-sm transition-all cursor-pointer relative whitespace-nowrap ${
                        isActive
                          ? "font-bold text-[#10B981] dark:text-[#34D399]"
                          : "font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#10B981] dark:bg-[#34D399] rounded-t-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="p-6 pt-4">
              {/* Table or Placeholder based on subTab */}
              {subTab === "homework" ? (
                <div className="overflow-x-auto no-scrollbar border border-gray-100 dark:border-gray-700/50 rounded-2xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-700/10">
                        <th className="py-4 px-4 text-center w-12">#</th>
                        <th className="py-4 px-4">{t("groupDetail.topic")}</th>
                        <th className="py-4 px-4 text-center w-16">
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg text-sm font-bold"
                            title="Talabalar soni"
                          >
                            👤
                          </span>
                        </th>
                        <th className="py-4 px-4 text-center w-16">
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-lg text-sm font-bold"
                            title="Kutilmoqda"
                          >
                            ⏱️
                          </span>
                        </th>
                        <th className="py-4 px-4 text-center w-16">
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg text-sm font-bold"
                            title="Tekshirilgan"
                          >
                            ✅
                          </span>
                        </th>
                        <th className="py-4 px-4">
                          {t("groupDetail.givenTime")}
                        </th>
                        <th className="py-4 px-4">
                          {t("groupDetail.endTime")}
                        </th>
                        <th className="py-4 px-4">
                          {t("groupDetail.lessonDate")}
                        </th>
                        <th className="py-4 px-4 text-center w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {homeworksLoading ? (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-8 text-gray-400 font-semibold text-sm"
                          >
                            <div className="flex flex-col items-center justify-center gap-3">
                              <svg
                                className="w-8 h-8 animate-spin text-[#7C3AED]"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              <span>{t("groupDetail.loading")}</span>
                            </div>
                          </td>
                        </tr>
                      ) : homeworks.length === 0 ? (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-12 text-gray-400 dark:text-gray-500 font-semibold text-sm"
                          >
                            {t("groupDetail.noHomework")}
                          </td>
                        </tr>
                      ) : (
                        homeworks.map((hw) => {
                          const gt = formatDT(hw.created_at);
                          const givenText = `${gt.date} ${gt.time}`;

                          const createdDate = new Date(
                            hw.created_at || "2026-06-03T00:00:00.000Z",
                          );
                          createdDate.setDate(createdDate.getDate() + 1);
                          const et = formatDT(createdDate.toISOString());
                          const endText = `${et.date} ${et.time}`;

                          return (
                            <tr
                              key={hw.id}
                              onClick={() =>
                                navigate(
                                  `/dashboard/groups/${id}/homework/${hw.id}`,
                                  { state: { homeworkData: hw } },
                                )
                              }
                              className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors cursor-pointer"
                            >
                              <td className="py-4 px-4 text-center font-bold text-gray-400 dark:text-gray-500 text-xs">
                                {hw.id}
                              </td>
                              <td className="py-4 px-4">
                                <button
                                  type="button"
                                  onClick={(e) => e.stopPropagation()}
                                  className={`inline-flex items-center justify-center min-w-[280px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                                    hw.unreviewed ||
                                    (Number(hw.homeworkAccept) === 0 &&
                                      Number(hw.homeworkPending) > 0)
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                  }`}
                                >
                                  {hw.topic ||
                                    (typeof hw.title === "object"
                                      ? hw.title?.topic ||
                                        hw.title?.title ||
                                        hw.title?.name ||
                                        "—"
                                      : hw.title || "—")}
                                </button>
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-gray-700 dark:text-gray-300 text-sm">
                                {hw.existStudentsIngroup ??
                                  currentGroup.studentsCount}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-sm text-gray-800 dark:text-white">
                                {hw.homeworkPending ?? 0}
                              </td>
                              <td className="py-4 px-4 text-center font-bold text-sm text-gray-800 dark:text-white">
                                {hw.homeworkAccept ?? 0}
                              </td>
                              <td className="py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                {givenText}
                              </td>
                              <td className="py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                {endText}
                              </td>
                              <td className="py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300">
                                {gt.date}
                              </td>
                              <td
                                className="py-4 px-4 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              ) : subTab === "videos" ? (
                <div className="overflow-x-auto no-scrollbar border border-gray-100 dark:border-gray-700/50 rounded-2xl">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-700/10">
                        <th className="py-4 px-6 text-center w-16">#</th>
                        <th className="py-4 px-6">
                          {t("groupDetail.videoName")}
                        </th>
                        <th className="py-4 px-6">
                          {t("groupDetail.lessonName")}
                        </th>
                        <th className="py-4 px-6">{t("common.status")}</th>
                        <th className="py-4 px-6">
                          {t("groupDetail.lessonDate")}
                        </th>
                        <th className="py-4 px-6">{t("groupDetail.size")}</th>
                        <th className="py-4 px-6">
                          {t("groupDetail.addedTime")}
                        </th>
                        <th className="py-4 px-6 text-center w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                      {videosLoading ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-8 text-gray-400 font-semibold text-sm"
                          >
                            <div className="flex flex-col items-center justify-center gap-3">
                              <svg
                                className="w-8 h-8 animate-spin text-[#7C3AED]"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              <span>{t("groupDetail.loading")}</span>
                            </div>
                          </td>
                        </tr>
                      ) : videosList.length === 0 ? (
                        <tr>
                          <td
                            colSpan="8"
                            className="text-center py-12 text-gray-400 dark:text-gray-500 font-semibold text-sm"
                          >
                            {t("groupDetail.noVideos")}
                          </td>
                        </tr>
                      ) : (
                        videosList.map((video) => (
                          <tr
                            key={video.id}
                            className="hover:bg-gray-50/50 dark:hover:bg-gray-700/10 transition-colors"
                          >
                            <td className="py-4 px-6 text-center font-bold text-gray-400 dark:text-gray-500 text-xs">
                              {video.id}
                            </td>
                            <td className="py-4 px-6 text-sm font-bold">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedVideo(video);
                                  setIsVideoPlayerOpen(true);
                                }}
                                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                              >
                                <svg
                                  className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {video.videoName}
                              </button>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300 font-semibold">
                              {video.topic}
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-3 py-1 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                {video.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-xs font-bold text-gray-700 dark:text-gray-300">
                              {video.lessonDate}
                            </td>
                            <td className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
                              {video.size}
                            </td>
                            <td className="py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
                              {video.addedTime}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : subTab === "exams" ? (
                <ExamsTab
                  exams={exams}
                  examsLoading={examsLoading}
                  mockExams={mockExams}
                  formatDT={formatDT}
                  navigate={navigate}
                  id={id}
                  setIsExamModalOpen={setIsExamModalOpen}
                />
              ) : subTab === "journal" ? (
                <div className="py-12 text-center text-gray-400 dark:text-gray-500 font-semibold text-sm">
                  {t("groupDetail.journalEmpty")}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 dark:text-gray-500 font-semibold text-sm">
                  {t("groupDetail.sectionEmpty")}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "attendance" &&
          (() => {
            // API ma'lumotlardan unique sanalarni ajratib olish
            const allDates = [
              ...new Set(
                attendanceData
                  .map((a) => {
                    const d = new Date(
                      a.created_at ||
                        a.date ||
                        a.lesson_date ||
                        a.lessonDate ||
                        "",
                    );
                    if (isNaN(d.getTime())) return null;
                    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
                  })
                  .filter(Boolean),
              ),
            ].sort();

            // Har bir talaba uchun davomati map: { studentId -> { 'dd.mm': isPresent } }
            const attendanceMap = {};
            attendanceData.forEach((a) => {
              const sid =
                a.student_id || a.studentId || (a.student && a.student.id);
              if (!sid) return;
              if (!attendanceMap[sid]) attendanceMap[sid] = {};
              const d = new Date(
                a.created_at || a.date || a.lesson_date || a.lessonDate || "",
              );
              if (!isNaN(d.getTime())) {
                const key = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
                attendanceMap[sid][key] =
                  a.isPresent ?? a.is_present ?? a.attended ?? false;
              }
            });

            const students = currentGroup.students || [];
            const displayDates =
              allDates.length > 0
                ? allDates
                : ["12.05", "14.05", "16.05", "19.05", "21.05", "23.05"];

            return (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#7C3AED]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-800 dark:text-white">
                        {t("groupDetail.attendance")}
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {students.length} {t("students")} •{" "}
                        {displayDates.length} {t("groupDetail.lessons")}
                      </p>
                    </div>
                  </div>
                  {attendanceLoading && (
                    <svg
                      className="w-5 h-5 animate-spin text-[#7C3AED]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  )}
                </div>

                <div className="p-6">
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          <th className="py-3 pr-4 min-w-[160px]">
                            {t("groupDetail.studentName")}
                          </th>
                          {displayDates.map((date) => (
                            <th
                              key={date}
                              className="py-3 px-3 text-center whitespace-nowrap"
                            >
                              {date}
                            </th>
                          ))}
                          <th className="py-3 px-4 text-center">
                            {t("groupDetail.total")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {attendanceLoading ? (
                          <tr>
                            <td
                              colSpan={displayDates.length + 2}
                              className="text-center py-10"
                            >
                              <div className="flex flex-col items-center gap-3 text-gray-400">
                                <svg
                                  className="w-8 h-8 animate-spin text-[#7C3AED]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                  />
                                </svg>
                                <span className="text-sm font-semibold">
                                  {t("groupDetail.attendanceLoading")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : students.length === 0 ? (
                          <tr>
                            <td
                              colSpan={displayDates.length + 2}
                              className="text-center py-12 text-gray-400 dark:text-gray-500 font-semibold text-sm"
                            >
                              {t("groupDetail.noStudents")}
                            </td>
                          </tr>
                        ) : (
                          students.map((student, sIdx) => {
                            const sMap = attendanceMap[student.id] || {};
                            const presentCount = displayDates.filter(
                              (d) => sMap[d] === true,
                            ).length;
                            const totalWithData = displayDates.filter(
                              (d) => d in sMap,
                            ).length;
                            const percent =
                              totalWithData > 0
                                ? Math.round(
                                    (presentCount / totalWithData) * 100,
                                  )
                                : null;

                            return (
                              <tr
                                key={student.id || sIdx}
                                className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors"
                              >
                                <td className="py-4 pr-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs font-bold flex-shrink-0">
                                      {(
                                        student.full_name ||
                                        student.name ||
                                        "?"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-sm text-gray-800 dark:text-white whitespace-nowrap">
                                      {student.full_name || student.name}
                                    </span>
                                  </div>
                                </td>
                                {displayDates.map((date) => {
                                  const hasData = date in sMap;
                                  const present = sMap[date];
                                  return (
                                    <td
                                      key={date}
                                      className="py-4 px-3 text-center"
                                    >
                                      {hasData ? (
                                        <span
                                          className={`inline-flex p-1.5 rounded-full ${
                                            present
                                              ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"
                                              : "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400"
                                          }`}
                                        >
                                          {present ? (
                                            <svg
                                              className="w-3.5 h-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          ) : (
                                            <svg
                                              className="w-3.5 h-3.5"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={3}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          )}
                                        </span>
                                      ) : (
                                        <span className="inline-flex w-5 h-5 items-center justify-center text-gray-200 dark:text-gray-600 text-base font-bold">
                                          —
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="py-4 px-4 text-center">
                                  {percent !== null ? (
                                    <span
                                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                        percent >= 80
                                          ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400"
                                          : percent >= 60
                                            ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                                            : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                                      }`}
                                    >
                                      {presentCount}/{totalWithData}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300 dark:text-gray-600 text-xs font-bold">
                                      —
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
      </div>

      {/* Homework Create Modal */}
      <CreateHomeworkModal
        isOpen={isHomeworkModalOpen}
        onClose={() => setIsHomeworkModalOpen(false)}
        onSave={(data) => {
          const newHomework = {
            id: `new-${Date.now()}`,
            topic: data.topic,
            title: data.topic,
            created_at: new Date().toISOString(),
            description: data.description,
            file: data.file,
            homeworkPending: 0,
            homeworkAccept: 0,
            unreviewed: true,
          };
          setHomeworks((prev) => [newHomework, ...(prev || [])]);
          setIsHomeworkModalOpen(false);
        }}
      />

      {/* Video Upload Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop / Background overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={() => {
              setIsVideoModalOpen(false);
              setUploadedFile(null);
              setSelectedLesson("");
              setCustomVideoName("");
            }}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-[17px] font-black text-gray-850 dark:text-white">
                {t("groupDetail.addVideo")}
              </h2>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setUploadedFile(null);
                  setSelectedLesson("");
                  setCustomVideoName("");
                }}
                className="p-1.5 text-gray-400 hover:text-gray-650 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Dropzone Body */}
            <div className="p-8 space-y-6">
              {/* Hidden file input */}
              <input
                type="file"
                id="video-file-input"
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />

              <div
                onClick={() =>
                  document.getElementById("video-file-input").click()
                }
                className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50/10 dark:hover:bg-emerald-950/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-350">
                  {/* Briefcase/case with plus icon matching the screenshot */}
                  <svg
                    className="w-10 h-10 text-[#10B981]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="9"
                      width="18"
                      height="11"
                      rx="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 9V5.5a2 2 0 00-2-2h-4a2 2 0 00-2 2V9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12.5v4M14 14.5H10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-[14px] font-black text-gray-800 dark:text-white mb-2 leading-relaxed max-w-lg">
                  {t("groupDetail.uploadVideoTitle")}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold max-w-md">
                  {t("groupDetail.uploadVideoFormat")}
                </p>
              </div>

              {/* Uploaded File Row form (Shows ONLY when file selected) */}
              {uploadedFile && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                        <th className="p-4 font-bold text-[10px]">File name</th>
                        <th className="p-4 w-[220px] font-bold text-[10px]">
                          <span className="text-red-500 mr-1">*</span>Dars
                        </th>
                        <th className="p-4 w-[220px] font-bold text-[10px]">
                          <span className="text-red-500 mr-1">*</span>Video nomi
                        </th>
                        <th className="p-4 text-center w-20 font-bold text-[10px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-900">
                        <td
                          className="p-4 font-bold text-gray-800 dark:text-white max-w-[120px] truncate"
                          title={uploadedFile.name}
                        >
                          {uploadedFile.name}
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <select
                              value={selectedLesson}
                              onChange={(e) =>
                                setSelectedLesson(e.target.value)
                              }
                              className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border border-gray-250 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-semibold appearance-none cursor-pointer text-gray-650"
                            >
                              <option value="">
                                {t("groupDetail.selectLesson")}
                              </option>
                              {Array.isArray(groupLessons) &&
                              groupLessons.length > 0 ? (
                                groupLessons.map((lesson, idx) => (
                                  <option
                                    key={lesson.id || idx}
                                    value={lesson.id}
                                  >
                                    {idx + 1}-dars: {lesson.topic || "Dars"}
                                  </option>
                                ))
                              ) : (
                                <>
                                  <option value="4">TypeScript (ID: 4)</option>
                                  <option value="1">HTML (ID: 1)</option>
                                  <option value="2">CRM (ID: 2)</option>
                                </>
                              )}
                            </select>
                            <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-gray-400">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={customVideoName}
                            onChange={(e) => setCustomVideoName(e.target.value)}
                            placeholder={t("groupDetail.videoName")}
                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 dark:text-white border border-gray-250 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-semibold text-gray-700"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFile(null);
                              setSelectedLesson("");
                              setCustomVideoName("");
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
                            title="O'chirish"
                          >
                            <svg
                              className="w-4.5 h-4.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-gray-150/10 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800">
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setUploadedFile(null);
                  setSelectedLesson("");
                  setCustomVideoName("");
                }}
                className="px-6 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors"
              >
                {t("btn.cancel")}
              </button>
              {uploadedFile && (
                <button
                  onClick={handleUploadVideos}
                  className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100/30 dark:shadow-none transition-colors cursor-pointer"
                >
                  {t("groupDetail.uploadFiles")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Yangi Imtihon Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setIsExamModalOpen(false);
              setExamForm({ name: "", start_time: "", duration: 60 });
            }}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#10B981]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h2 className="text-[17px] font-black text-gray-800 dark:text-white">
                  {t("groupDetail.newExam")}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsExamModalOpen(false);
                  setExamForm({ name: "", start_time: "", duration: 60 });
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Mavzu nomi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="text-red-500 mr-1">*</span>
                  {t("groupDetail.examName")}
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Examination"
                  value={examForm.name}
                  onChange={(e) =>
                    setExamForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Boshlanish vaqti */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <span className="text-red-500 mr-1">*</span>
                  {t("groupDetail.examStartTime")}
                </label>
                <input
                  type="datetime-local"
                  value={examForm.start_time}
                  onChange={(e) =>
                    setExamForm((prev) => ({
                      ...prev,
                      start_time: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>

              {/* Davomiyligi */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t("groupDetail.examDuration")}
                </label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  placeholder="60"
                  value={examForm.duration}
                  onChange={(e) =>
                    setExamForm((prev) => ({
                      ...prev,
                      duration: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsExamModalOpen(false);
                  setExamForm({ name: "", start_time: "", duration: 60 });
                }}
                className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                {t("btn.cancel")}
              </button>
              <button
                disabled={examSaving}
                onClick={async () => {
                  if (!examForm.name.trim()) {
                    triggerAlert("Imtihon nomini kiriting");
                    return;
                  }
                  if (!examForm.start_time) {
                    triggerAlert("Boshlanish vaqtini kiriting");
                    return;
                  }
                  try {
                    setExamSaving(true);
                    await axiosClient.post("/exams", {
                      name: examForm.name.trim(),
                      group_id: id,
                      start_time: new Date(examForm.start_time).toISOString(),
                      duration: examForm.duration,
                    });
                    triggerAlert("Imtihon muvaffaqiyatli qo'shildi!");
                    setIsExamModalOpen(false);
                    setExamForm({ name: "", start_time: "", duration: 60 });
                    fetchExams();
                  } catch (err) {
                    const msg =
                      err?.response?.data?.message || "Xatolik yuz berdi";
                    triggerAlert(msg);
                  } finally {
                    setExamSaving(false);
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-60 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-100/40 dark:shadow-none transition-colors cursor-pointer"
              >
                {examSaving ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {t("btn.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {isVideoPlayerOpen && selectedVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsVideoPlayerOpen(false);
              setSelectedVideo(null);
            }}
          />

          {/* Player Container */}
          <div className="relative w-full max-w-5xl bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">
                    {selectedVideo.videoName}
                  </h3>
                  <p className="text-white/50 text-xs font-medium">
                    {selectedVideo.topic} &bull; {selectedVideo.lessonDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVideoPlayerOpen(false);
                  setSelectedVideo(null);
                }}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Video Player Area */}
            <div className="relative bg-black w-full aspect-video flex items-center justify-center">
              {videoBlobLoading ? (
                <div className="flex flex-col items-center gap-3 text-white">
                  <svg
                    className="animate-spin w-8 h-8 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-sm font-semibold">
                    {t("groupDetail.videoLoading")}
                  </span>
                </div>
              ) : (
                <video
                  src={
                    videoBlobUrl ||
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  }
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <div className="flex items-center gap-4 text-white/50 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {selectedVideo.lessonDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                  {selectedVideo.size}
                </span>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {selectedVideo.status}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
