import React, { useState } from 'react';

const cardColors = [
  'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800',
  'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800',
  'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800',
  'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800',
  'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800',
  'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800',
];

const initialCourses = [
  { id: 1, name: 'Backend', desc: 'Yaxshi', duration: 120, months: 6, price: '2400000', branch: 'Filial 1' },
  { id: 2, name: 'Frontend', desc: 'Zo\'r', duration: 120, months: 6, price: '2500000', branch: 'Filial 1' },
  { id: 3, name: 'Android', desc: 'Yaxshi', duration: 120, months: 6, price: '2600000', branch: 'Filial 1' },
];

const branches = ['Filial 1', 'Filial 2', 'Arxiv'];

export default function Courses() {
  const [courses, setCourses] = useState(initialCourses);
  const [activeBranch, setActiveBranch] = useState('Filial 1');
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ name: '', desc: '', duration: '', months: '', price: '' });

  const filtered = courses.filter(c => c.branch === activeBranch);

  const handleDelete = (id) => setCourses(prev => prev.filter(c => c.id !== id));

  const handleEdit = (course) => {
    setEditCourse(course);
    setForm({ name: course.name, desc: course.desc, duration: course.duration, months: course.months, price: course.price });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditCourse(null);
    setForm({ name: '', desc: '', duration: '', months: '', price: '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editCourse) {
      setCourses(prev => prev.map(c => c.id === editCourse.id ? { ...c, ...form } : c));
    } else {
      setCourses(prev => [...prev, { id: Date.now(), ...form, branch: activeBranch }]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Kurslar</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] text-white text-[15px] font-bold rounded-2xl hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-100 dark:shadow-none active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Kurs qo'shish
        </button>
      </div>

      {/* Courses Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <p>Kurslar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(course => (
            <div
              key={course.id}
              className="bg-[#EEF4FF] dark:bg-gray-700 rounded-[32px] p-8 flex flex-col gap-6 relative group border border-blue-50/50 dark:border-gray-600 shadow-sm transition-all hover:shadow-md"
            >
              {/* Header: Title and Actions */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-[22px] font-bold text-gray-900 dark:text-white leading-none">{course.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-base font-medium">{course.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleEdit(course)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 mt-2">
                <div className="bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl text-[15px] font-bold text-gray-900 dark:text-white shadow-sm border border-gray-50/50 dark:border-gray-600">
                  {course.duration} min
                </div>
                <div className="bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl text-[15px] font-bold text-gray-900 dark:text-white shadow-sm border border-gray-50/50 dark:border-gray-600">
                  {course.months} oy
                </div>
                <div className="bg-white dark:bg-gray-800 px-5 py-2.5 rounded-xl text-[15px] font-bold text-gray-900 dark:text-white shadow-sm border border-gray-50/50 dark:border-gray-600">
                  {course.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Right Side Drawer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[450px] bg-white dark:bg-gray-800 h-full shadow-2xl flex flex-col animate-[slideInRight_0.3s_ease-out]">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[20px] font-bold text-gray-900 dark:text-white mb-1">
                    {editCourse ? 'Kursni tahrirlash' : "Kurs qo'shish"}
                  </h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">
                    Bu yerda siz yangi kurs qo'shishingiz mumkin.
                  </p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">Nomi</label>
                  <input
                    type="text"
                    placeholder="HR Manager..."
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">Dars davomiyligi</label>
                  <div className="relative">
                    <select
                      value={form.duration}
                      onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                      className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                    >
                      <option value="" disabled hidden></option>
                      <option value="60">60 daqiqa</option>
                      <option value="90">90 daqiqa</option>
                      <option value="120">120 daqiqa</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">Kurs davomiyligi (oylarda)</label>
                  <div className="relative">
                    <select
                      value={form.months}
                      onChange={e => setForm(f => ({ ...f, months: e.target.value }))}
                      className="w-full border border-blue-500 dark:border-blue-500 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="" disabled hidden></option>
                      <option value="3">3 oy</option>
                      <option value="6">6 oy</option>
                      <option value="9">9 oy</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">Narx</label>
                  <input
                    type="text"
                    placeholder="Narxini kiriting"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-[13px] font-bold text-gray-800 dark:text-gray-200 mb-1.5 block">Description</label>
                  <textarea
                    placeholder="A little about the company and the team that you'll be working with."
                    value={form.desc}
                    onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                    rows="3"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-400 resize-none"
                  ></textarea>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">This is a hint text to help user.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price}
                className="px-8 py-2.5 rounded-xl bg-[#6B21A8] text-white text-[14px] font-bold hover:bg-[#581C87] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
