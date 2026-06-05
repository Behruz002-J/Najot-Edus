import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignGroupModal from './AssignGroupModal';
import { getValidToken } from '../api/tokenUtils';
import axiosClient from '../api/axios';

export default function AddTeacherModal({ isOpen, onClose, setTeachers, teacherData }) {
  const navigate = useNavigate();
  const [isAssignGroupModalOpen, setIsAssignGroupModalOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [allGroups, setAllGroups] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    fullName: '',
    address: '',
    password: ''
  });

  // Fetch groups for badge name display
  useEffect(() => {
    if (!isOpen) return;
    axiosClient.get("/groups/all").then((res) => {
      const data = res?.data;
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data?.data)) list = data.data;
      setAllGroups(list.map((g) => ({ id: g.id, name: g.name || `Guruh #${g.id}` })));
    }).catch(() => {});
  }, [isOpen]);

  // Set form data when teacherData is provided for editing
  useEffect(() => {
    if (teacherData && isOpen) {
      setFormData({
        fullName: teacherData.name || '',
        phone: (teacherData.phone || '').replace(/\D/g, '').replace(/^998/, '').replace(/^8/, ''),
        email: teacherData.email || '',
        address: teacherData.address || '',
        password: '' // Don't pre-fill password for security
      });
      
      // Match group names to group IDs
      if (allGroups.length > 0 && Array.isArray(teacherData.group)) {
        const matchedIds = teacherData.group.map(groupName => {
          const found = allGroups.find(g => g.name === groupName || `Guruh #${g.id}` === groupName);
          return found ? found.id : null;
        }).filter(Boolean);
        setSelectedGroups(matchedIds);
      } else {
        setSelectedGroups([]);
      }
    } else if (isOpen) {
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        password: ''
      });
      setSelectedGroups([]);
      setSelectedFile(null);
    }
  }, [teacherData, isOpen, allGroups]);

  const isEdit = !!teacherData;

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digits = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, phone: digits }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || (!isEdit && !formData.password)) {
      alert(`Iltimos, barcha majburiy maydonlarni (O'qituvchi FIO, Telefon raqam, Mail, Manzil${isEdit ? '' : ', Parol'}) to'ldiring!`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Iltimos, to'g'ri elektron pochta (Mail) kiriting (masalan: oqituvchi@example.com)!");
      return;
    }

    try {
      let token;
      try {
        token = await getValidToken();
      } catch (tokenErr) {
        alert(tokenErr.message + "\n\nLogin sahifasiga o'tilmoqda...");
        navigate("/");
        return;
      }

      // Construct multipart FormData as required by the backend schema
      const postData = new FormData();
      postData.append('full_name', formData.fullName);
      postData.append('phone', formData.phone);
      
      if (formData.email) {
        postData.append('email', formData.email);
      }
      
      if (formData.password) {
        postData.append('password', formData.password);
      }
      
      if (formData.address) {
        postData.append('address', formData.address);
      }
      
      if (selectedFile) {
        postData.append('photo', selectedFile);
      } else if (!isEdit) {
        try {
          const responseDefault = await fetch('/bane-profile.jpg');
          const blobDefault = await responseDefault.blob();
          const defaultFile = new File([blobDefault], 'bane-profile.jpg', { type: 'image/jpeg' });
          postData.append('photo', defaultFile);
        } catch (err) {
          console.warn('Failed to load default bane-profile.jpg:', err);
        }
      }

      // Append array items for 'groups' individually
      selectedGroups.forEach(id => {
        postData.append('groups', id);
      });

      const url = isEdit 
        ? `https://najot-edu.softwareengineer.uz/api/v1/teachers/${teacherData.id}`
        : "https://najot-edu.softwareengineer.uz/api/v1/teachers";

      const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: postData
      });

      // Handle 401 Unauthorized — token expired, redirect to login
      if (response.status === 401) {
        window.localStorage.removeItem("token");
        alert("Sessiya muddati tugadi! Iltimos, qayta login qiling.");
        navigate("/");
        return;
      }

      // Handle non-JSON response gracefully (e.g. 500 server error, HTML pages)
      const contentType = response.headers.get("content-type");
      let resData = null;
      if (contentType && contentType.includes("application/json")) {
        resData = await response.json();
      } else {
        const errorText = await response.text();
        console.error("Non-JSON API Error:", errorText);
        alert(`Server xatoligi (Status: ${response.status}):\n${errorText.substring(0, 300)}`);
        return;
      }

      console.log("API Response:", resData);

      if (response.ok && (resData.success || resData.message === "Teacher created" || resData.message === "Teacher updated" || isEdit)) {
        const newTeacher = {
          id: teacherData?.id || resData.data?.id || resData.id || Date.now(),
          name: formData.fullName,
          group: selectedGroups.map(id => {
            const grp = allGroups.find(g => g.id === id);
            return grp ? grp.name : `Guruh #${id}`;
          }),
          phone: '+998 ' + formData.phone,
          email: formData.email,
          address: formData.address,
          photo: resData.data?.photo || resData.photo || (selectedFile ? URL.createObjectURL(selectedFile) : (teacherData ? teacherData.photo : null)),
          createdDate: teacherData ? teacherData.createdDate : new Date().toLocaleDateString('ru-RU')
        };

        if (isEdit) {
          setTeachers(prev => prev.map(t => t.id === teacherData.id ? newTeacher : t));
          alert("O'qituvchi ma'lumotlari muvaffaqiyatli tahrirlandi!");
        } else {
          setTeachers(prev => [newTeacher, ...prev]);
          alert("O'qituvchi muvaffaqiyatli qo'shildi!");
        }
        
        // Reset form
        setFormData({
          phone: '',
          email: '',
          fullName: '',
          address: '',
          password: ''
        });
        setSelectedGroups([]);
        setSelectedFile(null);
        onClose();
      } else {
        // Display exact validation messages from backend if available
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join("\n")
          : typeof resData.message === 'string'
          ? resData.message
          : JSON.stringify(resData, null, 2);
        
        console.error("Server validation failed:", resData);
        alert(`O'qituvchini saqlashda xatolik yuz berdi!\n\nServer xabari:\n${errorMsg}\n\nYuborilgan ma'lumotlar:\n- Ism: ${formData.fullName}\n- Telefon: ${formData.phone}\n- Email: ${formData.email}\n- Guruhlar: ${JSON.stringify(selectedGroups)}`);
      }
    } catch (err) {
      console.error("Save teacher error:", err);
      alert(`Xatolik yuz berdi: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-[450px] bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-[28px] font-bold text-gray-900 dark:text-white mb-2">
            {isEdit ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-[15px]">
            {isEdit ? "Bu yerda siz o'qituvchi ma'lumotlarini tahrirlashingiz mumkin." : "Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin."}
          </p>
        </div>

        <div className="border-b border-gray-100 dark:border-gray-800 mx-8"></div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {/* Telefon raqam */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">Telefon raqam</label>
            <div className="flex">
              <span className="inline-flex items-center px-5 py-3.5 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl text-base font-semibold text-gray-500 dark:text-gray-400 select-none">
                +998
              </span>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="901234567"
                maxLength={9}
                className="flex-1 px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7B2CBF] transition-all text-gray-900 dark:text-white text-base"
              />
            </div>
          </div>

          {/* Mail */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">Mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Elektron pochtani kiriting"
              className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7B2CBF] transition-all text-gray-900 dark:text-white text-base"
            />
          </div>

          {/* O'qituvchi FIO */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">O'qituvchi FIO</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Ma'mulotni kiriting"
              className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7B2CBF] transition-all text-gray-900 dark:text-white text-base"
            />
          </div>

          {/* Guruh */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">Guruh</label>
            <div className="space-y-3">
              {selectedGroups.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedGroups.map((groupId, index) => {
                    const group = allGroups.find(g => g.id === groupId);
                    return (
                      <span key={index} className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-[#7B2CBF] dark:text-purple-300 rounded-full text-sm font-bold border border-purple-100 dark:border-purple-800 flex items-center gap-2">
                        {group?.name || groupId}
                        <button onClick={() => setSelectedGroups(selectedGroups.filter(g => g !== groupId))}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
              <button 
                onClick={() => setIsAssignGroupModalOpen(true)}
                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center gap-3 text-[#7B2CBF] font-bold text-lg hover:bg-purple-50/50 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Qo'shish
              </button>
            </div>
          </div>

          {/* Surati */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">Surati</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/30 dark:bg-gray-800/30 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 text-center">
                <span className="text-[#7B2CBF] font-bold">
                  {selectedFile ? selectedFile.name : 'Click to upload'}
                </span> or drag and drop
              </p>
              <p className="text-[13px] text-gray-400 mt-1 uppercase">JPG or PNG (max. 800x800px)</p>
            </div>
          </div>

          {/* Manzil */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">Manzil</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Yashash manzilini kiriting"
              className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7B2CBF] transition-all text-gray-900 dark:text-white text-base"
            />
          </div>

          {/* Parol */}
          <div>
            <label className="block text-base font-semibold text-gray-900 dark:text-gray-200 mb-3">Parol</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isEdit ? "Parolni o'zgartirish (ixtiyoriy)" : "Parol yarating"}
              className="w-full px-5 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7B2CBF] transition-all text-gray-900 dark:text-white text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-100 dark:border-gray-700 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl text-[17px] font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-4 bg-[#6A1B9A] dark:bg-[#7B2CBF] text-white rounded-2xl text-[17px] font-bold hover:bg-[#5E35B1] transition-colors shadow-lg shadow-purple-200/50 dark:shadow-none relative overflow-hidden group"
          >
            <span className="relative z-10">Saqlash</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>

      {/* Assign Group Modal (Centered) */}
      <AssignGroupModal 
        isOpen={isAssignGroupModalOpen}
        onClose={() => setIsAssignGroupModalOpen(false)}
        selectedGroups={selectedGroups}
        onAssign={(groups) => setSelectedGroups(groups)}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
