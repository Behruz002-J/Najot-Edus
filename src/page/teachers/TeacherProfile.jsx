import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axios';

const AVATAR_COLORS = [
  "bg-purple-100 text-purple-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

const getImageUrl = (photo) => {
  if (!photo || String(photo).includes('bane-profile.jpg')) return null;
  if (photo.startsWith('http') || photo.startsWith('blob:')) return photo;
  const path = photo.startsWith('/') ? photo : `/${photo}`;
  if (path.startsWith('/files/')) {
    return `https://najot-edu.softwareengineer.uz${path}`;
  }
  return `https://najot-edu.softwareengineer.uz/files${path}`;
};

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/teachers');
        const data = res?.data;
        let teachersList = [];

        if (Array.isArray(data)) {
          teachersList = data;
        } else if (Array.isArray(data?.data)) {
          teachersList = data.data;
        }

        // Get logged in teacher information
        const loggedInUser = window.localStorage.getItem("username") || "";
        const creds = JSON.parse(window.localStorage.getItem("_creds") || "{}");
        const loggedInPhoneClean = creds.phone ? creds.phone.replace(/\D/g, "") : "";

        // Find teacher in list
        let matchedTeacher = teachersList.find(t => {
          const tPhoneClean = t.phone ? t.phone.replace(/\D/g, "") : "";
          if (loggedInPhoneClean && tPhoneClean && tPhoneClean.includes(loggedInPhoneClean)) {
            return true;
          }
          return t.full_name?.toLowerCase() === loggedInUser.toLowerCase();
        });

        if (matchedTeacher) {
          setProfile({
            id: matchedTeacher.id,
            name: matchedTeacher.full_name || matchedTeacher.name || "Mohirbek",
            role: "O'qituvchi",
            email: matchedTeacher.email || "moxirbek@gmail.com",
            phone: matchedTeacher.phone || "+998944481309",
            address: matchedTeacher.address || "Tashkent",
            createdDate: matchedTeacher.created_at
              ? new Date(matchedTeacher.created_at).toLocaleDateString("uz-UZ")
              : "12.05.2026",
            photo: matchedTeacher.photo || matchedTeacher.avatar || null,
            groups: Array.isArray(matchedTeacher.groups) ? matchedTeacher.groups : [],
            initial: (matchedTeacher.full_name || "M")[0].toUpperCase()
          });
        } else {
          // Fallback to mock data matching screenshot
          setProfile({
            id: 0,
            name: loggedInUser || "Mohirbek",
            role: "O'qituvchi",
            email: "moxirbek@gmail.com",
            phone: "+998944481309",
            address: "Tashkent",
            createdDate: "12.05.2026",
            photo: null,
            groups: ["N26", "n105", "n25"],
            initial: (loggedInUser || "M")[0].toUpperCase()
          });
        }
      } catch (err) {
        console.error("Fetch teacher profile error, using fallback:", err);
        // Fallback mock
        const loggedInUser = window.localStorage.getItem("username") || "Mohirbek";
        setProfile({
          id: 0,
          name: loggedInUser,
          role: "O'qituvchi",
          email: "moxirbek@gmail.com",
          phone: "+998 94 448 13 09",
          address: "Tashkent",
          createdDate: "12.05.2026",
          photo: null,
          groups: ["N26", "n105", "n25"],
          initial: loggedInUser[0].toUpperCase()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-[#7C3AED]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-bold text-gray-500 dark:text-gray-400">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  const avatarBgColor = AVATAR_COLORS[(profile.id || 0) % AVATAR_COLORS.length];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Bio Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col items-center pb-8 group">
          {/* Cover Header */}
          <div className="w-full h-32 relative overflow-hidden">
            <img 
              src="/creation-projects.jpg" 
              alt="Cover Banner" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Soft dark overlay for text contrast and premium feel */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Photo */}
          <div className="-mt-8 relative z-10">
            {getImageUrl(profile.photo) && !imageError ? (
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={getImageUrl(profile.photo)}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className={`w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center font-bold text-2xl group-hover:scale-105 transition-transform duration-300 ${avatarBgColor}`}>
                {profile.initial}
              </div>
            )}
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
          </div>

          {/* Teacher Info */}
          <div className="mt-4 text-center px-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-wide">{profile.name}</h2>
            <span className="inline-block mt-1 px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-[#7B2CBF] dark:text-purple-300 rounded-full text-xs font-bold border border-purple-100 dark:border-purple-800">
              {profile.role}
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 w-full px-8 border-t border-gray-100 dark:border-gray-700/60 pt-6">
            <div className="text-center border-r border-gray-100 dark:border-gray-700/60">
              <span className="block text-xl font-bold text-gray-800 dark:text-white">{profile.groups?.length || 0}</span>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Guruhlar</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-gray-800 dark:text-white">Active</span>
              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Status</span>
            </div>
          </div>
        </div>

        {/* Right Side: Details and Groups */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shaxsiy Ma'lumotlar Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Shaxsiy ma'lumotlar</h2>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-750 border border-gray-100/50 dark:border-gray-700/30 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group">
                <div className="p-2.5 bg-white dark:bg-gray-850 rounded-xl shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-200 mt-0.5 break-all">{profile.email}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-750 border border-gray-100/50 dark:border-gray-700/30 hover:border-blue-205 dark:hover:border-blue-800 transition-colors group">
                <div className="p-2.5 bg-white dark:bg-gray-850 rounded-xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Telefon raqam</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-205 mt-0.5">{profile.phone}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-750 border border-gray-100/50 dark:border-gray-700/30 hover:border-red-205 dark:hover:border-red-800 transition-colors group">
                <div className="p-2.5 bg-white dark:bg-gray-850 rounded-xl shadow-sm text-red-500 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Manzil</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-205 mt-0.5">{profile.address}</span>
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-750 border border-gray-100/50 dark:border-gray-700/30 hover:border-purple-205 dark:hover:border-purple-800 transition-colors group">
                <div className="p-2.5 bg-white dark:bg-gray-850 rounded-xl shadow-sm text-purple-500 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Ro'yxatdan o'tgan sana</span>
                  <span className="block text-sm font-bold text-gray-700 dark:text-gray-205 mt-0.5">{profile.createdDate}</span>
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="border-b border-gray-100 dark:border-gray-700/60 my-8"></div>

            {/* Guruhlar Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center text-purple-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Guruhlar</h2>
                <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-[#7B2CBF] dark:text-purple-300 rounded-md text-xs font-bold">
                  {profile.groups?.length || 0}
                </span>
              </div>

              {/* Groups badges */}
              <div className="flex flex-wrap gap-3">
                {profile.groups.length === 0 ? (
                  <span className="text-sm font-semibold text-gray-400">Guruhlar mavjud emas</span>
                ) : (
                  profile.groups.map((group, idx) => {
                    const name = typeof group === 'object' ? (group.name || group.fullName || `Guruh #${group.id}`) : group;
                    return (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-100/50 dark:border-emerald-800 flex items-center gap-2 hover:scale-105 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-default shadow-sm"
                      >
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {name}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
