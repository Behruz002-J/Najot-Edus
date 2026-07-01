import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";

export default function MyGroups() {
  const [activeTab, setActiveTab] = useState("active");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const getGroupTeachers = (groupName, fallbackTeacherName) => {
    const nameNorm = String(groupName).toLowerCase().trim();
    if (nameNorm === "n105") {
      return [
        { name: "Mohirbek", role: "TEACHER", days: "Se, Pa, Sha", time: "16:00 - 18:00" },
        { name: "Azizbek", role: "TEACHER", days: "Se, Pa, Sha", time: "16:00 - 18:00" },
        { name: "Nosirxon", role: "TEACHER", days: "Se, Pa, Sha", time: "16:00 - 18:00" },
        { name: "Raxmonbergan", role: "TEACHER", days: "Se, Pa, Sha", time: "16:00 - 18:00" }
      ];
    }
    return [
      { name: fallbackTeacherName || "O'qituvchi", role: "TEACHER", days: "Se, Pa, Sha", time: "16:00 - 18:00" }
    ];
  };

  useEffect(() => {
    const fetchStudentGroups = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const isMock = token.startsWith("mock-");
        
        let apiGroups = [];
        let fetchedFromApi = false;

        // Try to fetch from /students/my/groups endpoint
        if (token && !isMock) {
          try {
            const res = await axiosClient.get("/students/my/groups");
            const data = res?.data;
            if (Array.isArray(data)) {
              apiGroups = data;
              fetchedFromApi = true;
            } else if (Array.isArray(data?.data)) {
              apiGroups = data.data;
              fetchedFromApi = true;
            }
          } catch (err) {
            console.warn("Fetch from /students/my/groups failed, trying local fallback:", err.message);
          }
        }

        let mapped = [];

        if (fetchedFromApi) {
          // Save these groups to local_groups in localStorage so that detail pages can load them
          const localGroups = JSON.parse(localStorage.getItem("local_groups") || "[]");
          const localGroupsMap = new Map(localGroups.map(lg => [String(lg.id), lg]));
          apiGroups.forEach(g => {
            const id = g.groupId || g.id;
            const name = g.groupName || g.name || g.group_name || "Guruh";
            const direction = g.courseName || g.course || g.courses?.name || g.course?.name || "Frontend";
            const teacherName = g.teacher || (Array.isArray(g.teachers) && g.teachers.length > 0 ? g.teachers.map(t => t.full_name || t.name).join(', ') : "O'qituvchi");
            const firstTeacher = Array.isArray(g.teachers) && g.teachers[0] ? g.teachers[0] : {};
            const rawStartDate = g.startDate || g.start_date;

            localGroupsMap.set(String(id), {
              ...localGroupsMap.get(String(id)),
              ...g,
              id: id,
              name: name,
              course: direction,
              teacher: teacherName,
              teacherPhone: firstTeacher.phone || g.teacherPhone || "+998 90 123 45 67",
              teacherEmail: firstTeacher.email || g.teacherEmail || "mentor@najottedu.uz",
              teacherTelegram: firstTeacher.telegram || g.teacherTelegram || "najottedu_mentor",
              status: g.status === 'FAOL' || g.is_active !== false ? "Faol" : "Faol emas",
              start_date: rawStartDate || "2026-05-01"
            });
          });
          localStorage.setItem("local_groups", JSON.stringify(Array.from(localGroupsMap.values())));

          mapped = apiGroups.map(g => {
            const id = g.groupId || g.id;
            const name = g.groupName || g.name || g.group_name || "Guruh";
            const direction = g.courseName || g.course || g.courses?.name || g.course?.name || "Frontend";
            const teacherName = g.teacher || (Array.isArray(g.teachers) && g.teachers.length > 0 ? g.teachers.map(t => t.full_name || t.name).join(', ') : "O'qituvchi");
            const avatarLetter = teacherName[0]?.toUpperCase() || "?";
            const rawStartDate = g.startDate || g.start_date;
            
            return {
              id: id,
              name: name,
              direction: direction,
              status: g.status === 'FAOL' || g.is_active !== false ? "Faol" : "Faol emas",
              teacher: {
                name: teacherName,
                avatarLetter: avatarLetter,
                color: "bg-[#E29543] text-white"
              },
              startDate: rawStartDate ? new Date(rawStartDate).toLocaleDateString("uz-UZ") : "2026 M05 1"
            };
          });
        } else {
          // Fallback to local students mapping logic
          const loggedInPhone = localStorage.getItem("student_phone");
          const localStudents = JSON.parse(localStorage.getItem("local_students") || "[]");
          const currentStudent = localStudents.find(s => {
            const sPhone = (s.phone || "").replace(/\D/g, "");
            const cleanLoggedIn = (loggedInPhone || "").replace(/\D/g, "");
            const sNorm = sPhone.length === 9 ? `998${sPhone}` : sPhone;
            const userNorm = cleanLoggedIn.length === 9 ? `998${cleanLoggedIn}` : cleanLoggedIn;
            return sNorm === userNorm;
          });

          if (!currentStudent) {
            setGroups([
              {
                id: 1,
                name: "n105",
                direction: "Backend",
                status: "Faol",
                teacher: {
                  name: "O'qituvchi",
                  avatarLetter: "4",
                  color: "bg-[#E29543] text-white"
                },
                startDate: "2026 M05 1",
              }
            ]);
            setLoading(false);
            return;
          }

          let allGroups = [];
          try {
            const res = await axiosClient.get('/groups/all');
            const data = res?.data;
            if (Array.isArray(data)) allGroups = data;
            else if (Array.isArray(data?.data)) allGroups = data.data;
          } catch (err) {
            console.warn("API load groups failed in MyGroups:", err.message);
          }

          const localGroups = JSON.parse(localStorage.getItem("local_groups") || "[]");
          const combinedGroups = [...localGroups, ...allGroups];

          const studentGroupIds = currentStudent.groupIds || [];
          const studentGroupsList = currentStudent.groups || [];

          const studentAssignedGroups = combinedGroups.filter(g => {
            const idMatch = studentGroupIds.map(Number).includes(Number(g.id));
            const nameMatch = studentGroupsList.some(gn => String(gn).toLowerCase().trim() === String(g.name).toLowerCase().trim());
            const nameIdMatch = studentGroupsList.some(gn => String(gn).includes(String(g.id)));
            return idMatch || nameMatch || nameIdMatch;
          });

          mapped = studentAssignedGroups.map(g => {
            const direction = g.course || g.courses?.name || g.course?.name || "Frontend";
            const teacherName = g.teacher || (Array.isArray(g.teachers) && g.teachers.length > 0 ? g.teachers.map(t => t.full_name).join(', ') : "O'qituvchi");
            const avatarLetter = teacherName[0]?.toUpperCase() || "?";
            
            return {
              id: g.id,
              name: g.name,
              direction: direction,
              status: g.status === 'FAOL' || g.is_active !== false ? "Faol" : "Faol emas",
              teacher: {
                name: teacherName,
                avatarLetter: avatarLetter,
                color: "bg-[#E29543] text-white"
              },
              startDate: g.start_date ? new Date(g.start_date).toLocaleDateString("uz-UZ") : "2026 M05 1"
            };
          });
        }

        if (mapped.length === 0) {
          const loggedInPhone = localStorage.getItem("student_phone");
          const localStudents = JSON.parse(localStorage.getItem("local_students") || "[]");
          const currentStudent = localStudents.find(s => {
            const sPhone = (s.phone || "").replace(/\D/g, "");
            const cleanLoggedIn = (loggedInPhone || "").replace(/\D/g, "");
            const sNorm = sPhone.length === 9 ? `998${sPhone}` : sPhone;
            const userNorm = cleanLoggedIn.length === 9 ? `998${cleanLoggedIn}` : cleanLoggedIn;
            return sNorm === userNorm;
          });

          if (currentStudent && (currentStudent.groupIds?.length > 0 || currentStudent.groups?.length > 0)) {
            let allGroups = [];
            try {
              const res = await axiosClient.get('/groups/all');
              const data = res?.data;
              if (Array.isArray(data)) allGroups = data;
              else if (Array.isArray(data?.data)) allGroups = data.data;
            } catch (err) {
              console.warn("API load groups failed in MyGroups fallback:", err.message);
            }

            const localGroups = JSON.parse(localStorage.getItem("local_groups") || "[]");
            const combinedGroups = [...localGroups, ...allGroups];

            const studentGroupIds = currentStudent.groupIds || [];
            const studentGroupsList = currentStudent.groups || [];

            const studentAssignedGroups = combinedGroups.filter(g => {
              const idMatch = studentGroupIds.map(Number).includes(Number(g.id));
              const nameMatch = studentGroupsList.some(gn => String(gn).toLowerCase().trim() === String(g.name).toLowerCase().trim());
              const nameIdMatch = studentGroupsList.some(gn => String(gn).includes(String(g.id)));
              return idMatch || nameMatch || nameIdMatch;
            });

            mapped = studentAssignedGroups.map(g => {
              const direction = g.course || g.courses?.name || g.course?.name || "Frontend";
              const teacherName = g.teacher || (Array.isArray(g.teachers) && g.teachers.length > 0 ? g.teachers.map(t => t.full_name).join(', ') : "O'qituvchi");
              const avatarLetter = teacherName[0]?.toUpperCase() || "?";
              
              return {
                id: g.id,
                name: g.name,
                direction: direction,
                status: g.status === 'FAOL' || g.is_active !== false ? "Faol" : "Faol emas",
                teacher: {
                  name: teacherName,
                  avatarLetter: avatarLetter,
                  color: "bg-[#E29543] text-white"
                },
                startDate: g.start_date ? new Date(g.start_date).toLocaleDateString("uz-UZ") : "2026 M05 1"
              };
            });
          }
        }

        if (mapped.length === 0) {
          setGroups([
            {
              id: 1,
              name: "n105",
              direction: "Backend",
              status: "Faol",
              teacher: {
                name: "O'qituvchi",
                avatarLetter: "O",
                color: "bg-[#E29543] text-white"
              },
              startDate: "2026 M05 1",
            }
          ]);
        } else {
          setGroups(mapped);
        }
      } catch (err) {
        console.error("Error loading student groups:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentGroups();
  }, []);

  const filteredGroups = groups.filter(g => {
    const isFaol = g.status === "Faol";
    if (activeTab === "active") return isFaol;
    return !isFaol;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 px-6 pt-4">
        {["active", "finished"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === tab
                ? "text-orange-500 dark:text-orange-400 font-bold"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab === "active" ? "Faol" : "Tugagan"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 dark:bg-orange-400 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400 font-medium">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Yuklanmoqda...
          </div>
        ) : activeTab === "active" ? (
          <div className="overflow-x-auto">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                Faol guruhlar topilmadi.
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-4 w-16">#</th>
                    <th className="py-4 px-4">Guruh nomi</th>
                    <th className="py-4 px-4">Yo'nalishi</th>
                    <th className="py-4 px-4">O'qituvchi</th>
                    <th className="py-4 px-4">Boshlash vaqti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {filteredGroups.map((group, index) => (
                    <tr
                      key={group.id}
                      onClick={() => navigate(`/dashboard/my-groups/${group.id}`)}
                      className="hover:bg-orange-50/40 dark:hover:bg-orange-900/10 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {index + 1}
                      </td>
                      <td 
                        className="py-4 px-4 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGroup(group);
                          setModalOpen(true);
                        }}
                      >
                        {group.name}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {group.direction}
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${group.teacher.color}`}
                          title={group.teacher.name}
                        >
                          {group.teacher.avatarLetter}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {group.startDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            Tugallangan guruhlar topilmadi.
          </div>
        )}
      </div>

      {/* Group Detail Modal (Screenshot Style) */}
      {modalOpen && selectedGroup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              setModalOpen(false);
              setSelectedGroup(null);
            }}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[24px] shadow-2xl p-8 border border-gray-150 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalOpen(false);
                setSelectedGroup(null);
              }}
              className="absolute top-6 right-6 text-gray-450 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Content */}
            <div className="space-y-1.5 mb-6 text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {selectedGroup.name}
              </h2>
              <p className="text-base text-gray-500 dark:text-gray-400 font-semibold">
                {selectedGroup.status || "Faol"}
              </p>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 text-left text-sm font-bold text-gray-900 dark:text-gray-100">
                    <th className="py-4 px-6">O'qituvchi</th>
                    <th className="py-4 px-6">Roli</th>
                    <th className="py-4 px-6">Dars kunlari</th>
                    <th className="py-4 px-6">Dars vaqti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {getGroupTeachers(selectedGroup.name, selectedGroup.teacher.name).map((t, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-white text-left">{t.name}</td>
                      <td className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">{t.role}</td>
                      <td className="py-4 px-6 text-left">{t.days}</td>
                      <td className="py-4 px-6 font-semibold text-left">{t.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
