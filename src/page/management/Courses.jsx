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
  // Filial 1
  { id: 1,  name: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 3, price: '1 000 000', branch: 'Filial 1', color: 0 },
  { id: 2,  name: 'Frontend Developer',       desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 6, price: '1 500 000', branch: 'Filial 1', color: 1 },
  { id: 3,  name: 'Backend Developer',        desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 6, price: '1 500 000', branch: 'Filial 1', color: 2 },
  { id: 4,  name: 'UI/UX Designer',           desc: "A little about the company and the team that you'll be working with.", duration: 60, months: 4, price: '1 200 000', branch: 'Filial 1', color: 3 },
  { id: 5,  name: 'IELTS Preparation',        desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 3, price: '900 000',  branch: 'Filial 1', color: 4 },
  { id: 6,  name: 'Python Dasturlash',        desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 5, price: '1 300 000', branch: 'Filial 1', color: 5 },

  // Filial 2
  { id: 7,  name: 'Human Resources Manager', desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 3, price: '1 000 000', branch: 'Filial 2', color: 0 },
  { id: 8,  name: 'Marketing va SMM',         desc: "A little about the company and the team that you'll be working with.", duration: 60, months: 3, price: '800 000',  branch: 'Filial 2', color: 1 },
  { id: 9,  name: 'Grafik Dizayn',            desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 4, price: '1 100 000', branch: 'Filial 2', color: 2 },
  { id: 10, name: 'React.js kursi',           desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 5, price: '1 400 000', branch: 'Filial 2', color: 3 },
  { id: 11, name: 'Node.js kursi',            desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 5, price: '1 400 000', branch: 'Filial 2', color: 4 },

  // Arxiv
  { id: 12, name: 'Eski Java kursi',          desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 6, price: '900 000',  branch: 'Arxiv', color: 5 },
  { id: 13, name: 'Flash Dizayn',             desc: "A little about the company and the team that you'll be working with.", duration: 60, months: 2, price: '600 000',  branch: 'Arxiv', color: 1 },
  { id: 14, name: 'AutoCAD',                  desc: "A little about the company and the team that you'll be working with.", duration: 90, months: 3, price: '800 000',  branch: 'Arxiv', color: 2 },
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
      const colorIdx = courses.filter(c => c.branch === activeBranch).length % cardColors.length;
      setCourses(prev => [...prev, { id: Date.now(), ...form, branch: activeBranch, color: colorIdx }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800 dark:text-white">Kurslar</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white text-sm font-semibold rounded-lg hover:bg-[#6D28D9] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Kurslar qo'shish
        </button>
      </div>

      {/* Branch Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {branches.map(branch => (
          <button
            key={branch}
            onClick={() => setActiveBranch(branch)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeBranch === branch
                ? 'bg-[#7C3AED] text-white shadow'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {branch}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
          <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm">Bu filialda kurslar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map(course => (
            <div
              key={course.id}
              className={`border rounded-xl p-4 flex flex-col gap-2 group hover:shadow-md transition-shadow relative ${cardColors[course.color % cardColors.length]}`}
            >
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDelete(course.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors"
                  title="O'chirish"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(course)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors"
                  title="Tahrirlash"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <p className="text-sm font-bold text-gray-800 dark:text-white pr-14 leading-tight">{course.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{course.desc}</p>

              {/* Stats */}
              <div className="flex items-center gap-3 mt-auto pt-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.duration} min
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {course.months} oy
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.price} mln
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-5">
              {editCourse ? 'Kursni tahrirlash' : "Yangi kurs qo'shish"}
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Kurs nomi', key: 'name', placeholder: 'Masalan: React.js kursi', type: 'text' },
                { label: 'Tavsif', key: 'desc', placeholder: 'Kurs haqida qisqacha...', type: 'text' },
                { label: 'Davomiyligi (min)', key: 'duration', placeholder: '90', type: 'number' },
                { label: 'Muddat (oy)', key: 'months', placeholder: '3', type: 'number' },
                { label: 'Narxi (mln)', key: 'price', placeholder: '1 000 000', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price}
                className="flex-1 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editCourse ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
