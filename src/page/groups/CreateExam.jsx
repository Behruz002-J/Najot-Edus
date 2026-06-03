import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axios';

const TOPICS = [
  'Html asoslari',
  'CSS kirish',
  'JavaScript asoslari',
  'Nodejs',
  'React kirish',
  'State and Props',
  'Hooks',
  'API integratsiya',
  'Loyiha yaratish',
  'Takrorlash',
];

export default function CreateExam() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [selectedTopic, setSelectedTopic] = useState('');
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fontSize, setFontSize] = useState('Normal');
  const [saving, setSaving] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isTopicOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTopicOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isTopicOpen]);

  const goBack = () => navigate(`/dashboard/groups/${id}`);

  const execCmd = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleFontSize = (size) => {
    const map = { Normal: '3', Katta: '5', Kichik: '1' };
    execCmd('fontSize', map[size] || '3');
    setFontSize(size);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handlePublish = async () => {
    if (!selectedTopic) {
      alert('Iltimos, mavzuni tanlang!');
      return;
    }
    if (!endDate) {
      alert("Iltimos, tugash sanasini kiriting!");
      return;
    }
    if (!endTime) {
      alert("Iltimos, tugash vaqtini kiriting!");
      return;
    }

    setSaving(true);
    let newExamId = 'new';
    const description = editorRef.current?.innerHTML || '';

    try {
      const res = await axiosClient.post('/exams', {
        group_id: id,
        name: selectedTopic,
        description,
        start_time: `${endDate}T${endTime}:00`,
        duration: 60,
      });
      // API dan qaytgan ID
      newExamId = res?.data?.data?.id ?? res?.data?.id ?? 'new';
    } catch (err) {
      console.error('Create exam error:', err?.response?.data || err.message);
    } finally {
      setSaving(false);
    }

    // ExamDetail sahifasiga o'tish — form ma'lumotlarini state orqali yuboramiz
    navigate(`/dashboard/groups/${id}/exam/${newExamId}`, {
      state: {
        examData: {
          name: selectedTopic,
          description,
          start_time: `${endDate}T${endTime}:00`,
        },
        description,
      },
    });
  };

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-black text-gray-800 dark:text-white">
          Imtihon yaratish
        </h2>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-visible">
        <div className="p-7 space-y-7">

          {/* Info banner */}
          <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Oxirgi 7 kundagi uyga vazifa berilmagan mavzularni tanlay olasiz!
            </p>
          </div>

          {/* Mavzu */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-red-500 mr-1">*</span>Mavzu
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsTopicOpen(!isTopicOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-left transition-all focus:outline-none hover:border-gray-300 dark:hover:border-gray-600"
              >
                <span className={selectedTopic ? 'text-gray-800 dark:text-white font-semibold' : 'text-gray-400 dark:text-gray-500'}>
                  {selectedTopic || 'Mavzulardan birini tanlang'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isTopicOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isTopicOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="max-h-56 overflow-y-auto">
                    {TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => { setSelectedTopic(topic); setIsTopicOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 ${
                          selectedTopic === topic
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Izoh */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-red-500 mr-1">*</span>Izoh
            </label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400/30 focus-within:border-emerald-400 transition-all">
              {/* Toolbar */}
              <div className="flex items-center flex-wrap gap-0.5 gap-y-1 px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60">
                <TB label="H1" title="Sarlavha 1" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'h1'); }} />
                <TB label="H2" title="Sarlavha 2" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'h2'); }} />
                <Sep />

                <select onMouseDown={(e) => e.stopPropagation()} onChange={(e) => execCmd('fontName', e.target.value)}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 cursor-pointer focus:outline-none">
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Mono</option>
                </select>

                <select value={fontSize} onMouseDown={(e) => e.stopPropagation()} onChange={(e) => handleFontSize(e.target.value)}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1 cursor-pointer focus:outline-none">
                  <option>Kichik</option>
                  <option>Normal</option>
                  <option>Katta</option>
                </select>
                <Sep />

                <TI title="Qalin" onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }}><span className="font-black text-sm leading-none">B</span></TI>
                <TI title="Kursiv" onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }}><span className="italic font-bold text-sm leading-none">I</span></TI>
                <TI title="Tagiga chizilgan" onMouseDown={(e) => { e.preventDefault(); execCmd('underline'); }}><span className="underline font-bold text-sm leading-none">U</span></TI>
                <TI title="O'rtadan chizilgan" onMouseDown={(e) => { e.preventDefault(); execCmd('strikeThrough'); }}><span className="line-through font-bold text-sm leading-none">S</span></TI>
                <Sep />

                <TI title="Iqtibos" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'blockquote'); }}><span className="text-sm font-black leading-none">❝</span></TI>
                <TI title="Kod" onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'pre'); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                </TI>
                <Sep />

                <TI title="Chapga" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyLeft'); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                </TI>
                <TI title="Markaz" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyCenter'); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /></svg>
                </TI>
                <TI title="O'nga" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyRight'); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" /></svg>
                </TI>
                <TI title="To'la" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyFull'); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </TI>
                <Sep />

                <TI title="Havola" onMouseDown={(e) => { e.preventDefault(); const url = prompt('URL kiriting:'); if (url) execCmd('createLink', url); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </TI>
              </div>

              {/* Editable area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[140px] p-4 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none leading-relaxed"
                data-placeholder="Imtihon haqida batafsil ma'lumot kiriting..."
              />
            </div>
          </div>

          {/* Fayl yuklash */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]); }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border border-dashed rounded-xl py-4 flex items-center justify-center gap-2 cursor-pointer transition-all select-none text-sm font-semibold ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500 dark:text-gray-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {file ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  {file.name}{' '}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="ml-2 text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ) : (
                <span>Yuklash</span>
              )}
            </div>
          </div>

          {/* Tugash sanasi + vaqti */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <span className="text-red-500 mr-1">*</span>Tugash sanasi
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-gray-400"
                  placeholder="Sanani kiriting"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <span className="text-red-500 mr-1">*</span>Tugash vaqti
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder-gray-400"
                  placeholder="Vaqtni kiriting"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={goBack}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="px-7 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            E'lon qilish
          </button>
        </div>
      </div>

      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}

function TB({ label, title, onMouseDown }) {
  return (
    <button type="button" title={title} onMouseDown={onMouseDown}
      className="px-2 py-1 text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
      {label}
    </button>
  );
}

function TI({ children, title, onMouseDown }) {
  return (
    <button type="button" title={title} onMouseDown={onMouseDown}
      className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
      {children}
    </button>
  );
}

function Sep() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0" />;
}
