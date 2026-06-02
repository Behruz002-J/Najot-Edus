import React, { useState, useEffect } from 'react';
import SelectStudentModal from './SelectStudentModal';
import SelectTeacherModal from './SelectTeacherModal';
import axiosClient from '../api/axios';

export default function AddGroupModal({ isOpen, onClose, onAddSuccess }) {
  const [isSelectStudentOpen, setIsSelectStudentOpen] = useState(false);
  const [isSelectTeacherOpen, setIsSelectTeacherOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [selectedWeekDays, setSelectedWeekDays] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [startDate, setStartDate] = useState('');
  const [maxStudent, setMaxStudent] = useState(20);

  const [coursesList, setCoursesList] = useState([]);
  const [roomsList, setRoomsList] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [saving, setSaving] = useState(false);

  const days = [
    'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'
  ];

  const dayMappings = {
    'Dushanba': 'MONDAY',
    'Seshanba': 'TUESDAY',
    'Chorshanba': 'WEDNESDAY',
    'Payshanba': 'THURSDAY',
    'Juma': 'FRIDAY',
    'Shanba': 'SATURDAY',
    'Yakshanba': 'SUNDAY'
  };

  useEffect(() => {
    const fetchModalData = async () => {
      try {
        const [coursesRes, roomsRes, teachersRes, studentsRes] = await Promise.all([
          axiosClient.get('/courses'),
          axiosClient.get('/rooms'),
          axiosClient.get('/teachers'),
          axiosClient.get('/students')
        ]);
        
        let coursesData = [];
        if (Array.isArray(coursesRes?.data)) coursesData = coursesRes.data;
        else if (Array.isArray(coursesRes?.data?.data)) coursesData = coursesRes.data.data;
        else if (coursesRes?.data?.success && Array.isArray(coursesRes?.data?.data)) coursesData = coursesRes.data.data;
        
        let roomsData = [];
        if (Array.isArray(roomsRes?.data)) roomsData = roomsRes.data;
        else if (Array.isArray(roomsRes?.data?.data)) roomsData = roomsRes.data.data;
        else if (roomsRes?.data?.success && Array.isArray(roomsRes?.data?.data)) roomsData = roomsRes.data.data;

        let teachersData = [];
        if (Array.isArray(teachersRes?.data)) teachersData = teachersRes.data;
        else if (Array.isArray(teachersRes?.data?.data)) teachersData = teachersRes.data.data;
        else if (teachersRes?.data?.success && Array.isArray(teachersRes?.data?.data)) teachersData = teachersRes.data.data;
        
        let studentsData = [];
        if (Array.isArray(studentsRes?.data)) studentsData = studentsRes.data;
        else if (Array.isArray(studentsRes?.data?.data)) studentsData = studentsRes.data.data;
        else if (studentsRes?.data?.success && Array.isArray(studentsRes?.data?.data)) studentsData = studentsRes.data.data;

        setCoursesList(coursesData);
        setRoomsList(roomsData);
        setAllTeachers(teachersData);
        setAllStudents(studentsData);
      } catch (err) {
        console.error('Fetch modal data error:', err);
      }
    };

    if (isOpen) {
      fetchModalData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDayChange = (dayName) => {
    const apiName = dayMappings[dayName];
    setSelectedWeekDays(prev => 
      prev.includes(apiName) ? prev.filter(d => d !== apiName) : [...prev, apiName]
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Guruh nomini kiriting!");
      return;
    }
    if (!courseId) {
      alert("Kursni tanlang!");
      return;
    }
    if (!roomId) {
      alert("Xonani tanlang!");
      return;
    }
    if (selectedWeekDays.length === 0) {
      alert("Kamida bitta dars kunini tanlang!");
      return;
    }
    if (!startDate) {
      alert("Boshlanish sanasini kiriting!");
      return;
    }
    if (!startTime) {
      alert("Dars vaqtini kiriting!");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: name.trim(),
        description: description.trim(),
        course_id: Number(courseId),
        teachers: selectedTeachers.map(Number),
        students: selectedStudents.map(Number),
        room_id: Number(roomId),
        start_date: new Date(startDate).toISOString(),
        week_day: selectedWeekDays,
        start_time: startTime,
        max_student: Number(maxStudent) || 20
      };

      const res = await axiosClient.post('/groups', payload);
      if (res.status === 200 || res.status === 201 || res.data?.success) {
        alert("Guruh muvaffaqiyatli qo'shildi!");
        if (typeof onAddSuccess === 'function') {
          onAddSuccess();
        }
        // Reset states
        setName('');
        setDescription('');
        setCourseId('');
        setRoomId('');
        setSelectedWeekDays([]);
        setStartTime('09:00');
        setStartDate('');
        setMaxStudent(20);
        setSelectedTeachers([]);
        setSelectedStudents([]);
        onClose();
      } else {
        alert("Xatolik yuz berdi: " + (res.data?.message || "Noma'lum xatolik"));
      }
    } catch (err) {
      console.error('Save group error:', err);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      alert("Guruhni qo'shishda xatolik yuz berdi: " + (Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg));
    } finally {
      setSaving(false);
    }
  };

  const selectedTeachersNames = allTeachers.filter(t => selectedTeachers.includes(t.id)).map(t => t.full_name || t.name || '').filter(Boolean).join(', ');
  const selectedStudentsNames = allStudents.filter(s => selectedStudents.includes(s.id)).map(s => s.full_name || s.name || '').filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity duration-300 animate-fade-in" 
        onClick={saving ? null : onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Guruh qo'shish</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Yangi guruh yaratish uchun quyidagi ma'lumotlarni kiriting.</p>
          </div>
          <button 
            disabled={saving}
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          
          {/* Guruh nomi */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Guruh nomi <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Frontend 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none"
            />
          </div>

          {/* Kurs */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Kurs <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                value={courseId} 
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Kursni tanlang</option>
                {coursesList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Xona */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Xona <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>Xonani tanlang</option>
                {roomsList.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Lesson Days */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Dars kunlari <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {days.map((day) => {
                const apiName = dayMappings[day];
                const isChecked = selectedWeekDays.includes(apiName);
                return (
                  <label key={day} className="flex items-center gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => handleDayChange(day)}
                      className="w-4 h-4 rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]" 
                    />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{day}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Lesson Time */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Dars vaqti <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Boshlanish sanasi <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
              />
            </div>
          </div>

          {/* Max Students */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Maksimal talabalar soni</label>
            <input 
              type="number" 
              min="1"
              value={maxStudent}
              onChange={(e) => setMaxStudent(e.target.value)}
              placeholder="20"
              className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Tavsif</label>
            <textarea 
              placeholder="Guruh haqida qo'shimcha ma'lumot (ixtiyoriy)"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-800 dark:text-white focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all resize-none"
            />
          </div>

          {/* Teachers Section */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">O'qituvchilar</label>
            {selectedTeachers.length > 0 && (
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                Tanlanganlar: <span className="text-[#7C3AED] font-bold">{selectedTeachersNames}</span>
              </div>
            )}
            <button 
              onClick={() => setIsSelectTeacherOpen(true)}
              className="w-full py-4 px-4 bg-[#F3F4F6] dark:bg-gray-700 rounded-xl flex items-center gap-2 text-sm font-bold text-[#7C3AED] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tanlash
            </button>
          </div>

          {/* Students Section */}
          <div className="space-y-3 pb-4">
            <label className="text-[13px] font-bold text-gray-800 dark:text-white">Talabalar</label>
            {selectedStudents.length > 0 && (
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                Tanlanganlar: <span className="text-[#7C3AED] font-bold">{selectedStudentsNames}</span>
              </div>
            )}
            <button 
              onClick={() => setIsSelectStudentOpen(true)}
              className="w-full py-4 px-4 bg-[#F3F4F6] dark:bg-gray-700 rounded-xl flex items-center justify-between text-sm font-bold text-[#7C3AED] hover:bg-[#E5E7EB] dark:hover:bg-gray-600 transition-colors overflow-hidden relative"
            >
              <div className="flex items-center gap-2 z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tanlash
              </div>
              <svg className="w-24 h-24 absolute right-0 bottom-[-20px] text-[#7C3AED]/10 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0L8.66 25v50L50 100l41.34-25V25L50 0zm0 15l25 15.2-25 15.2-25-15.2L50 15zm-25 24.3l20 12.1v23.5L15 56.6V39.3zm30 35.6V51.4l20-12.1v17.3L55 74.9z"/>
              </svg>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex gap-3">
          <button 
            disabled={saving}
            onClick={onClose}
            className="flex-1 py-3.5 px-4 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            Bekor qilish
          </button>
          <button 
            disabled={saving}
            onClick={handleSave}
            className="flex-1 py-3.5 px-4 bg-[#7C3AED] text-white rounded-xl text-sm font-bold hover:bg-[#6D28D9] shadow-lg shadow-purple-200/50 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saqlanmoqda...
              </>
            ) : "Saqlash"}
          </button>
        </div>

      </div>

      <SelectStudentModal 
        isOpen={isSelectStudentOpen}
        onClose={() => setIsSelectStudentOpen(false)}
        selectedIds={selectedStudents}
        onSelect={(selected) => setSelectedStudents(selected)}
      />

      <SelectTeacherModal 
        isOpen={isSelectTeacherOpen}
        onClose={() => setIsSelectTeacherOpen(false)}
        selectedIds={selectedTeachers}
        onSelect={(selected) => setSelectedTeachers(selected)}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
