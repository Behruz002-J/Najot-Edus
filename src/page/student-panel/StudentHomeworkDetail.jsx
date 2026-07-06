import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import studentCopyImage from "../../assets/images/student copy.svg";
import axiosClient from "../../api/axios";
import { getVideoFileUrl } from "../../api/video";

// Mock homework list matching StudentGroupDetail.jsx
const homeworkDataList = [
  { id: 1, topic: "NextJs",          video: 0, status: "Qaytarilgan",    deadline: "2026 M06 12 05:44", lessonDate: "2026 M06 11" },
  { id: 2, topic: "crm teacher panel",video: 2, status: "Qabul qilingan", deadline: "2026 M06 10 20:00", lessonDate: "17 Iyun, 2026" },
  { id: 3, topic: "Imtihon",         video: 0, status: "Qabul qilingan", deadline: "2026 M06 02 22:00", lessonDate: "2026 M06 02" },
  { id: 4, topic: "State and Props", video: 1, status: "Berilmagan",     deadline: "Vaqt belgilanmagan", lessonDate: "2026 M05 21" },
  { id: 5, topic: "takrorlash",      video: 1, status: "Bajarilmagan",   deadline: "2026 M05 20 20:00", lessonDate: "2026 M05 19" },
  { id: 6, topic: "Nodejs",          video: 1, status: "Qabul qilingan", deadline: "2026 M05 15 20:00", lessonDate: "2026 M05 14" },
  { id: 7, topic: "Html asoslari",   video: 1, status: "Qaytarilgan",    deadline: "2026 M05 13 20:00", lessonDate: "2026 M05 12" },
  { id: 8, topic: "CSS asoslari",    video: 1, status: "Bajarilmagan",   deadline: "2026 M05 09 20:00", lessonDate: "2026 M05 08" },
];

const homeworkDetailsDb = {
  1: {
    topic: "NextJs",
    lessonDate: "2026 M06 11",
    deadline: "2026 M06 12 05:44",
    status: "Qaytarilgan",
    statusText: "Vazifa qaytarildi",
    ball: "58",
    description: "Nextjsda loyihani tugatib kelish",
    submission: "loyihani tugatolmadim",
    teacherComment: "loyiha tugatilmagan",
    filesCount: 0,
    submissionFilesCount: 0,
    teacherName: "Mohirbek",
    videoCount: 0,
  },
  2: {
    topic: "crm teacher panel",
    lessonDate: "18:00 15 Iyun, 2026",
    deadline: "17 Iyun, 2026 18:00",
    status: "Qabul qilingan",
    statusText: "Vazifa qabul qilindi",
    ball: "95",
    description: `Product Management
React/Next Js
Tailwind Css
State Management - Redux, Zustand
Css Componenets - Ant, Material Ui
Api integration - Superbase, MockApi
Dashboard - Ko'rish, Xarid qilish
Admin - CRUD`,
    submission: "Barcha sahifalar ulandi, ma'lumotlar state'ga o'tkazildi, deploy qilindi.",
    teacherComment: "Ajoyib ish! Kod toza yozilgan, responsive qismi ham yaxshi ishladi.",
    filesCount: 0,
    submissionFilesCount: 1,
    teacherName: "Behruz Jumanov",
    videoCount: 2,
  },
  3: {
    topic: "Imtihon",
    lessonDate: "2026 M06 02",
    deadline: "2026 M06 02 22:00",
    status: "Qabul qilingan",
    statusText: "Vazifa qabul qilindi",
    ball: "85",
    description: "React bo'yicha oraliq nazorat imtihoni topshiriqlari",
    submission: "Imtihon loyihasi va savollarga javoblar yuklandi.",
    teacherComment: "Yaxshi natija. Ba'zi performance optimizatsiyalariga e'tibor qaratish kerak edi, lekin umumiy hisobda juda yaxshi.",
    filesCount: 1,
    submissionFilesCount: 1,
    teacherName: "Farrux Asqarov",
    videoCount: 0,
  },
  4: {
    topic: "State and Props",
    lessonDate: "2026 M05 21",
    deadline: "Belgilanmagan",
    status: "Berilmagan",
    statusText: "Vazifa berilmagan",
    ball: "—",
    description: "State va props mavzusini mustahkamlash uchun amaliy mashqlar.",
    submission: "—",
    teacherComment: "Ushbu dars bo'yicha vazifa berilmagan.",
    filesCount: 0,
    submissionFilesCount: 0,
    teacherName: "Diyorbek Rustamov",
    videoCount: 1,
  },
  5: {
    topic: "takrorlash",
    lessonDate: "2026 M05 19",
    deadline: "2026 M05 20 20:00",
    status: "Bajarilmagan",
    statusText: "Vazifa topshirilmadi",
    ball: "0",
    description: "O'tilgan mavzular bo'yigan takrorlash savollariga javob berish.",
    submission: "Topshirilmadi.",
    teacherComment: "Belgilangan muddat ichida vazifa topshirilmadi. Shuning uchun 0 ball.",
    filesCount: 0,
    submissionFilesCount: 0,
    teacherName: "Farrux Asqarov",
    videoCount: 1,
  },
  6: {
    topic: "Nodejs",
    lessonDate: "2026 M05 14",
    deadline: "2026 M05 15 20:00",
    status: "Qabul qilingan",
    statusText: "Vazifa qabul qilindi",
    ball: "90",
    description: "Node.js muhitini sozlash va oddiy HTTP server yaratish.",
    submission: "Server yaratildi va localhost portlari ulandi. GitHub repo linki qo'shildi.",
    teacherComment: "Juda yaxshi. Keyingi darsda Express frameworkini o'rganamiz.",
    filesCount: 1,
    submissionFilesCount: 1,
    teacherName: "Behruz Jumanov",
    videoCount: 1,
  },
  7: {
    topic: "Html asoslari",
    lessonDate: "2026 M05 12",
    deadline: "2026 M05 13 20:00",
    status: "Qaytarilgan",
    statusText: "Vazifa qaytarildi",
    ball: "40",
    description: "HTML5 semantik teglari yordamida veb-sahifa maketini tuzish.",
    submission: "Oddiy sahifa tuzib yukladim.",
    teacherComment: "Faqat div lardan foydalanibsiz. HTML5 semantik teglari (header, nav, main, section, article, footer) ishlatilishi shart.",
    filesCount: 0,
    submissionFilesCount: 0,
    teacherName: "Diyorbek Rustamov",
    videoCount: 1,
  },
  8: {
    topic: "CSS asoslari",
    lessonDate: "2026 M05 08",
    deadline: "2026 M05 09 20:00",
    status: "Bajarilmagan",
    statusText: "Vazifa topshirilmadi",
    ball: "0",
    description: "Flexbox yordamida moslashuvchan maket (layout) yaratish.",
    submission: "Bajarilmagan.",
    teacherComment: "Muddat o'tgan.",
    filesCount: 0,
    submissionFilesCount: 0,
    teacherName: "Diyorbek Rustamov",
    videoCount: 1,
  }
};

export default function StudentHomeworkDetail() {
  const { id: groupId, homeworkId } = useParams();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(Number(homeworkId) || 1);
  const [expandedId, setExpandedId] = useState(Number(homeworkId) || 1);
  const [activeVideoName, setActiveVideoName] = useState("");
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState("");
  const [videoBlobLoading, setVideoBlobLoading] = useState(false);
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);

  const fetchHomeworks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      const isMock = token.startsWith("mock-");
      if (isMock) {
        throw new Error("Mock token detected, using mock data");
      }

      // 1. Fetch group lessons
      const lessonsRes = await axiosClient.get(`/groups/${groupId}/lessons`);
      const lessons = lessonsRes.data?.data || lessonsRes.data || [];

      // 2. Fetch homework status and videos for each lesson
      const detailsPromises = lessons.map(async (lesson) => {
        try {
          const [hwRes, videosRes] = await Promise.all([
            axiosClient.get(`/groups/${groupId}/lessons/${lesson.id}/homeworks`).catch(() => ({ data: null })),
            axiosClient.get(`/groups/${groupId}/lessons/${lesson.id}/videos`).catch(() => ({ data: null }))
          ]);
          const hwData = hwRes?.data?.data || hwRes?.data || null;
          const videos = videosRes?.data?.data || videosRes?.data || [];
          return { lesson, hwData, videos };
        } catch (e) {
          console.warn(`Failed to fetch homework details or videos for lesson ${lesson.id}:`, e.message);
          return { lesson, hwData: null, videos: [] };
        }
      });

      const detailsList = await Promise.all(detailsPromises);

      // 3. Map to homework list rows
      const mapped = [];
      detailsList.forEach(({ lesson, hwData, videos }) => {
        if (!hwData || (!hwData.homework && !hwData.answer && !hwData.result)) {
          return; // skip lessons that don't have homework assigned
        }

        const homework = hwData.homework || {};
        const answer = hwData.answer || null;
        const result = hwData.result || null;

        let status = "Bajarilmagan";
        if (result) {
          if (result.homeworkStatus === "ACCEPTED") {
            status = "Qabul qilingan";
          } else if (result.homeworkStatus === "REJECTED") {
            status = "Qaytarilgan";
          } else if (result.homeworkStatus === "PENDING") {
            status = "Kutilmoqda";
          }
        } else if (answer) {
          status = "Kutilmoqda";
        }

        mapped.push({
          id: homework.id,
          topic: homework.title || lesson.topic || "Mavzu",
          videoCount: videos ? videos.length : (lesson.videoCount || 0),
          videos: videos || [],
          status: status,
          deadline: homework.created_at
            ? new Date(new Date(homework.created_at).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString("uz-UZ")
            : "Belgilanmagan",
          lessonDate: homework.created_at
            ? new Date(homework.created_at).toLocaleDateString("uz-UZ")
            : (lesson.created_at ? new Date(lesson.created_at).toLocaleDateString("uz-UZ") : "—"),
          file: homework.file,
          teacherName: result?.checker || (homework.user ? `${homework.user.first_name || ""} ${homework.user.last_name || ""}`.trim() : "O'qituvchi"),
          description: homework.title || "Vazifani bajarib kelish",
          ball: result?.grade || "—",
          submission: answer?.title || "Topshiriq yuborilmagan",
          teacherComment: result?.title || "Izoh yo'q",
          lessonId: lesson.id,
          homeworkId: homework.id
        });
      });

      setHomeworkList(mapped);
    } catch (err) {
      console.warn("Error fetching homework list in detail, falling back:", err.message);
      setHomeworkList(homeworkDataList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchHomeworks();
    }
  }, [groupId]);

    const activeHw = homeworkList.find((h) => Number(h.id) === Number(activeId));

  const activeDetail = activeHw
    ? {
        topic: activeHw.topic,
        lessonDate: activeHw.lessonDate,
        deadline: activeHw.deadline,
        status: activeHw.status,
        statusText: activeHw.status === "Qaytarilgan" ? "Vazifa qaytarildi" : activeHw.status === "Qabul qilingan" ? "Vazifa qabul qilindi" : activeHw.status === "Kutilmoqda" ? "Vazifa kutilmoqda" : "Vazifa topshirilmadi",
        ball: activeHw.ball || "—",
        description: activeHw.description || "Loyihani bajarib kelish",
        submission: activeHw.submission || "Topshiriq yuborilmagan",
        teacherComment: activeHw.teacherComment || "Izoh yo'q",
        filesCount: activeHw.file ? 1 : 0,
        submissionFilesCount: 0,
        teacherName: activeHw.teacherName,
        videoCount: activeHw.videoCount || 0,
        videos: activeHw.videos || [],
        file: activeHw.file,
        lessonId: activeHw.lessonId,
        homeworkId: activeHw.homeworkId
      }
    : {
        ...(homeworkDetailsDb[activeId] || homeworkDetailsDb[1]),
        videos: []
      };

  // Sync state if URL param changes
  useEffect(() => {
    if (homeworkId) {
      const hwId = Number(homeworkId);
      setActiveId(hwId);
      setExpandedId(hwId);
    }
  }, [homeworkId]);

  // Sync active video if active homework has videos
  useEffect(() => {
    setIsPlaying(false);
    if (activeDetail) {
      if (activeDetail.videos && activeDetail.videos.length > 0) {
        const firstVid = activeDetail.videos[0];
        const fileUrlOrPath = firstVid.video_url || firstVid.url || firstVid.path || "";
        setActiveVideoName(firstVid.originalname || firstVid.title || firstVid.name || fileUrlOrPath || "Dars videosi");
        setActiveVideoUrl(getVideoFileUrl(fileUrlOrPath));
      } else if (activeDetail.videoCount > 0) {
        const defaultVideoName = activeDetail.topic === "crm teacher panel"
          ? "72.1.mov"
          : `${activeDetail.topic.toLowerCase().replace(/\s+/g, '_')}_part1.mp4`;
        setActiveVideoName(defaultVideoName);
        setActiveVideoUrl(getVideoFileUrl(""));
      } else {
        setActiveVideoName("");
        setActiveVideoUrl("");
      }
    } else {
      setActiveVideoName("");
      setActiveVideoUrl("");
    }
  }, [activeId, activeDetail]);

  // Load video as blob if it's a backend API URL requiring authentication
  useEffect(() => {
    let active = true;
    let blobUrl = "";

    const loadVideoBlob = async () => {
      if (!activeVideoUrl) {
        setVideoBlobUrl("");
        return;
      }

      const isBackendApiUrl =
        activeVideoUrl &&
        ((activeVideoUrl.includes("najot-edu.softwareengineer.uz/api/v1") &&
          !activeVideoUrl.includes("/files/")) ||
          (activeVideoUrl.startsWith("/") &&
            !activeVideoUrl.startsWith("/files/")) ||
          (!activeVideoUrl.startsWith("http") &&
            !activeVideoUrl.includes("/files/")));

      if (!isBackendApiUrl) {
        setVideoBlobUrl(activeVideoUrl);
        return;
      }

      try {
        setVideoBlobLoading(true);
        let endpoint = activeVideoUrl;
        if (activeVideoUrl.startsWith("https://najot-edu.softwareengineer.uz/api/v1")) {
          endpoint = activeVideoUrl.replace("https://najot-edu.softwareengineer.uz/api/v1", "");
        }

        const response = await axiosClient.get(endpoint, {
          responseType: "blob",
        });

        if (active) {
          blobUrl = URL.createObjectURL(response.data);
          setVideoBlobUrl(blobUrl);
        }
      } catch (err) {
        console.error("Error fetching video blob:", err);
        if (active) {
          setVideoBlobUrl(activeVideoUrl);
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
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [activeVideoUrl]);

  const handleSelectHomework = (hwId) => {
    setActiveId(hwId);
    navigate(`/dashboard/my-groups/${groupId}/homework/${hwId}`);
  };

  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    if (!submissionText.trim() && !submissionFile) {
      alert("Iltimos, javob matnini kiriting yoki fayl yuklang!");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", submissionText.trim() || "Homework Answer");
      if (submissionFile) {
        formData.append("file", submissionFile);
      }

      const hwIdToSubmit = activeDetail.homeworkId || activeId;
      await axiosClient.post(`/students/homeworkAnswer/${hwIdToSubmit}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Vazifa muvaffaqiyatli topshirildi!");
      setSubmissionText("");
      setSubmissionFile(null);
      
      // Reload homeworks
      fetchHomeworks();
    } catch (err) {
      console.error("Error submitting homework:", err);
      alert(err.response?.data?.message || err.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case "Qaytarilgan":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30";
      case "Qabul qilingan":
        return "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30";
      case "Bajarilmagan":
        return "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30";
      case "Kutilmoqda":
        return "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900/30";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/dashboard/my-groups/${groupId}`)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Orqaga qaytish
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column (Video + Details) */}
        <div className="flex-1 space-y-6 w-full">
          {/* Real & Mock Video Player */}
          {activeVideoName && (
            <div className="space-y-4">
              {/* File name above video player */}
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 font-sans tracking-tight">
                {activeVideoName}
              </h2>

              {/* Video Box */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9.5] w-full rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-black shadow-md overflow-hidden flex items-center justify-center">
                {isPlaying ? (
                  videoBlobLoading ? (
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
                        Video yuklanmoqda...
                      </span>
                    </div>
                  ) : (
                    <video
                      src={videoBlobUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <div
                    onClick={() => setIsPlaying(true)}
                    className="w-full h-full flex flex-row group cursor-pointer relative"
                  >
                    {/* Left side: Blue panel with illustration */}
                    <div className="w-1/2 bg-[#17275b] flex items-center justify-center p-4 relative select-none">
                      {/* Outer container border guide */}
                      <div className="absolute inset-3 border border-white/5 rounded-xl pointer-events-none" />
                      <div className="absolute left-6 top-8 w-16 h-24 border border-white/5 rounded pointer-events-none" />
                      <div className="absolute right-6 bottom-8 w-16 h-24 border border-white/5 rounded pointer-events-none" />
                      
                      <img
                        src={studentCopyImage}
                        alt="Study Illustration"
                        className="max-h-[85%] max-w-[85%] object-contain"
                      />
                    </div>

                    {/* Right side: Login form */}
                    <div className="w-1/2 bg-white dark:bg-gray-900 flex flex-col justify-center items-center p-6 relative select-none">
                      <div className="max-w-[200px] w-full space-y-4 text-center">
                        {/* Logo */}
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-1 justify-center">
                            <div className="relative w-7 h-7 flex items-center justify-center">
                              <div className="absolute left-[3px] top-1.5 bottom-1.5 w-1.5 bg-[#0F5EA2] rounded-[1px]" />
                              <div className="absolute right-[3px] top-3.5 bottom-1.5 w-1.5 bg-[#00A896] rounded-[1px]" />
                              <div className="absolute left-[7px] top-[7px] w-2.5 h-2.5 border-r-[5px] border-b-[5px] border-[#0F5EA2] rotate-45 transform origin-top-left" />
                              <div className="absolute right-[1px] top-[1.5px] w-1.5 h-1.5 border-t-[2px] border-r-[2px] border-[#00A896] rotate-45" />
                            </div>
                            <span className="text-sm font-extrabold text-[#0F5EA2] tracking-tight">Najot<span className="text-[#00A896]">Edu</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 w-full justify-center -mt-1">
                            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-3" />
                            <span className="text-[7px] font-black text-gray-400 tracking-wider">CRM</span>
                            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-3" />
                          </div>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-1.5">
                          <div className="w-full text-[9px] px-2.5 py-1.5 rounded border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-800 text-gray-400 text-left font-medium">
                            Login
                          </div>
                          <div className="w-full text-[9px] px-2.5 py-1.5 rounded border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-800 text-gray-400 text-left font-medium">
                            Parol
                          </div>
                          <span className="block text-right text-[7px] text-gray-450 font-medium">Parolni unutdingizmi?</span>
                        </div>

                        {/* Kirish Button */}
                        <div className="w-full py-1.5 bg-[#0f2942] text-white text-[9px] font-bold rounded text-center shadow-sm">
                          Kirish
                        </div>
                      </div>

                      <span className="absolute bottom-2 text-[6px] text-gray-400 font-medium">
                        Copyright © 2026 NajotEdu CRM
                      </span>
                    </div>

                    {/* Big Orange Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors duration-250">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EFC79E]/85 hover:bg-[#EFC79E]/95 flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105">
                        <svg className="w-8 h-8 fill-current ml-1 text-white" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Label card below video */}
              <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-700 rounded-2xl px-5 py-4 shadow-sm flex items-center transition-colors duration-300">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-tight font-sans">
                  {activeDetail.topic === "crm teacher panel" ? "crm front continue" : activeDetail.topic} ({activeVideoName})
                </span>
              </div>
            </div>
          )}

          {/* Vazifalar Tabs Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-px">
            <div className="flex">
              <span className="text-base font-extrabold text-[#C08246] dark:text-[#e0a96d] px-4 py-2 border-b-2 border-[#C08246] dark:border-[#e0a96d] -mb-[2px] select-none">
                Vazifalar
              </span>
            </div>
          </div>

          {/* Uyga vazifa Card */}
          <div className="bg-[#FAF7F2] dark:bg-gray-800/40 border border-[#E7E2D6]/35 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm transition-colors duration-300">
            <div className="space-y-6">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-lg font-extrabold text-gray-800 dark:text-gray-100">
                  Uyga vazifa
                </span>
                {activeDetail.status !== "Berilmagan" && (
                  <span className="text-xs font-extrabold text-white bg-[#FF3B00] px-4 py-1.5 rounded-lg flex items-center gap-1.5 select-none shadow-sm animate-pulse">
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    Uyga vazifa muddati: {activeDetail.deadline}
                  </span>
                )}
                {activeDetail.status !== "Berilmagan" && (
                  <span className="text-sm font-bold text-gray-750 dark:text-gray-300">
                    Fayllar soni: {activeDetail.filesCount}
                  </span>
                )}
              </div>

              {/* Description text */}
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-350 leading-relaxed whitespace-pre-line">
                {activeDetail.description}
              </p>

              {/* Attached file link */}
              {activeDetail.file && (
                <div className="mt-2">
                  <a
                    href={activeDetail.file.startsWith("http") ? activeDetail.file : `https://najot-edu.softwareengineer.uz/files/${activeDetail.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C08246] hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Biriktirilgan faylni yuklab olish
                  </a>
                </div>
              )}

              {/* Lesson date / created date bottom right */}
              {activeDetail.status !== "Berilmagan" && (
                <div className="flex justify-end select-none">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-400">
                    {activeDetail.lessonDate}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mening jo'natmalarim Card or Submission Form */}
          {activeDetail.status === "Bajarilmagan" || activeDetail.status === "Qaytarilgan" ? (
            <form onSubmit={handleHomeworkSubmit} className="bg-[#FAF7F2] dark:bg-gray-800/40 border border-[#E7E2D6]/35 dark:border-gray-700/60 rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-sm font-extrabold text-gray-800 dark:text-gray-100 block">
                Mening jo'natmalarim (Vazifani yuborish)
              </span>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="GitHub havolasi yoki izoh..."
                rows={3}
                className="w-full border border-orange-200 dark:border-gray-600 rounded-xl p-3 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
              />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-orange-300 rounded-xl cursor-pointer hover:bg-orange-50/20 dark:hover:bg-gray-750/20 transition-colors text-xs font-semibold text-orange-600 dark:text-orange-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {submissionFile ? submissionFile.name : "Fayl yuklash"}
                  <input
                    type="file"
                    onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Yuborilmoqda...
                    </>
                  ) : (
                    "Vazifani topshirish"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="relative bg-[#F4F1EB] dark:bg-gray-800/40 border border-[#E7E2D6] dark:border-gray-700/60 rounded-xl p-5 shadow-sm transition-colors duration-300">
              <div className="space-y-4 pr-28">
                <span className="text-sm font-extrabold text-gray-800 dark:text-gray-100 block">
                  Mening jo'natmalarim
                </span>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activeDetail.submission}
                </p>
              </div>
              {activeDetail.status !== "Berilmagan" && (
                <div className="absolute right-5 top-5 bottom-1 flex flex-col justify-between items-end pointer-events-none select-none">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                    Fayllar soni: {activeDetail.submissionFilesCount}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-bold mb-1">
                    {activeDetail.lessonDate}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* O'qituvchi izohi Card */}
          <div className="bg-[#F4F1EB] dark:bg-gray-800/40 border border-[#E7E2D6] dark:border-gray-700/60 rounded-xl p-5 shadow-sm flex items-start justify-between gap-6 transition-colors duration-300">
            <div className="space-y-4 flex-1">
              <span className="text-sm font-extrabold text-gray-800 dark:text-gray-100 block">
                O'qituvchi izohi
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {activeDetail.teacherComment}
                </p>
                <p className="text-xs text-gray-800 dark:text-gray-200 font-bold">
                  Tekshiruvchi: {activeDetail.teacherName}
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-md border shrink-0 mt-0.5 ${getStatusBadgeStyles(activeDetail.status)}`}>
              {activeDetail.statusText}
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden lg:block w-[3px] bg-[#C07F43]/20 self-stretch rounded-full my-4" />

        {/* Right Column (Homework Topics List) */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          {homeworkList.map((hw) => {
            const isExpanded = expandedId === hw.id;
            const hwDetail = hw;
            
            return (
              <div key={hw.id} className="w-full">
                {isExpanded ? (
                  /* Expanded state container matching user screenshot */
                  <div className="bg-[#FAF8F5] dark:bg-gray-800/40 border border-[#E7E2D6] dark:border-gray-700/60 rounded-2xl p-4 flex gap-3 w-full">
                    {/* Left side: Header + Videos aligned and sharing same width */}
                    <div className="flex-1 space-y-2 min-w-0">
                      {/* Header block with `#EFC79E` background */}
                      <div className="bg-[#EFC79E] dark:bg-[#4a3522]/60 rounded-2xl p-4 text-left">
                        <h4 className="text-sm font-extrabold text-[#163656] dark:text-gray-100 truncate">
                          {hw.topic}
                        </h4>
                        <p className="text-xs font-semibold text-[#163656]/80 dark:text-gray-450 mt-1">
                          Dars sanasi: {hw.lessonDate}
                        </p>
                      </div>

                      {/* Video blocks list */}
                      <div className="space-y-2">
                        {hwDetail.videos && hwDetail.videos.length > 0 ? (
                          hwDetail.videos.map((video, idx) => {
                            const videoNum = idx + 1;
                            const fileUrlOrPath = video.video_url || video.url || video.path || "";
                            const videoName = video.originalname || video.title || video.name || fileUrlOrPath || `${videoNum}-video`;
                            const videoUrl = getVideoFileUrl(fileUrlOrPath);

                            return (
                              <div
                                key={video.id || idx}
                                className="bg-[#EFC79E] dark:bg-[#4a3522]/60 py-3 px-5 rounded-2xl flex items-center gap-3 hover:bg-[#ebbd8d] dark:hover:bg-[#4a3522]/85 transition-all duration-150 cursor-pointer shadow-sm group text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVideoName(videoName);
                                  setActiveVideoUrl(videoUrl);
                                  setIsPlaying(true);
                                }}
                              >
                                {/* Play Circle Icon */}
                                <div className="w-7 h-7 rounded-full border-2 border-[#C08246] bg-white dark:bg-gray-800 flex items-center justify-center text-[#C08246] group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-[#163656] dark:text-gray-200 truncate">
                                  {videoNum}-video: {videoName}
                                </span>
                              </div>
                            );
                          })
                        ) : hwDetail.videoCount > 0 ? (
                          Array.from({ length: hwDetail.videoCount }).map((_, idx) => {
                            const videoNum = idx + 1;
                            const videoName = hwDetail.topic === "crm teacher panel" && videoNum === 1
                              ? "72.1.mov"
                              : hwDetail.topic === "crm teacher panel" && videoNum === 2
                              ? "72.2.mov"
                              : `${hw.topic.toLowerCase().replace(/\s+/g, '_')}_part${videoNum}.mp4`;
                            const videoUrl = getVideoFileUrl(""); // mock/default video URL

                            return (
                              <div
                                key={idx}
                                className="bg-[#EFC79E] dark:bg-[#4a3522]/60 py-3 px-5 rounded-2xl flex items-center gap-3 hover:bg-[#ebbd8d] dark:hover:bg-[#4a3522]/85 transition-all duration-150 cursor-pointer shadow-sm group text-left"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVideoName(videoName);
                                  setActiveVideoUrl(videoUrl);
                                  setIsPlaying(true);
                                }}
                              >
                                {/* Play Circle Icon */}
                                <div className="w-7 h-7 rounded-full border-2 border-[#C08246] bg-white dark:bg-gray-800 flex items-center justify-center text-[#C08246] group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                                  <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-[#163656] dark:text-gray-200 truncate">
                                  {videoNum}-video: {videoName}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="bg-[#EFC79E] dark:bg-[#4a3522]/60 py-3 px-5 rounded-2xl text-center text-xs font-semibold text-[#163656] dark:text-gray-300">
                            Video darslik yuklanmagan
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side: Accordion Arrow (outside colored block) */}
                    <div
                      className="flex items-start pt-6 cursor-pointer select-none"
                      onClick={() => setExpandedId(null)}
                    >
                      <svg
                        className="w-4.5 h-4.5 text-gray-600 dark:text-gray-400 rotate-180 transition-transform duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  /* Standard non-expanded state card */
                  <div
                    className="w-full rounded-2xl transition-all duration-200 cursor-pointer flex items-center justify-between p-5 bg-[#FAF8F5] dark:bg-gray-800/40 border border-[#E7E2D6] dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    onClick={() => {
                      handleSelectHomework(hw.id);
                      setExpandedId(hw.id);
                    }}
                  >
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm font-extrabold text-gray-800 dark:text-gray-100">
                        {hw.topic}
                      </h4>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        Dars sanasi: {hw.lessonDate}
                      </p>
                    </div>
                    
                    <svg
                      className="w-4.5 h-4.5 text-gray-600 dark:text-gray-400 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
