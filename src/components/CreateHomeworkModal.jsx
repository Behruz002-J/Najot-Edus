import React, { useState, useRef, useEffect } from 'react';

// Simple Rich Text Toolbar actions
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

export default function CreateHomeworkModal({ isOpen, onClose, onSave }) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fontSize, setFontSize] = useState('Normal');
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close topic dropdown on outside click
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

  if (!isOpen) return null;

  const execCmd = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  };

  const handleFontSize = (size) => {
    const sizeMap = { 'Normal': '3', 'Katta': '5', 'Kichik': '1' };
    execCmd('fontSize', sizeMap[size] || '3');
    setFontSize(size);
  };

  const handleFile = (f) => {
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleSave = () => {
    if (!selectedTopic) {
      alert("Iltimos, mavzuni tanlang!");
      return;
    }
    const content = editorRef.current?.innerHTML || '';
    if (!content || content === '<br>') {
      alert("Iltimos, izoh kiriting!");
      return;
    }
    onSave?.({ topic: selectedTopic, description: content, file });
    handleClose();
  };

  const handleClose = () => {
    setSelectedTopic('');
    setDescription('');
    setFile(null);
    setIsTopicOpen(false);
    if (editorRef.current) editorRef.current.innerHTML = '';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl my-8 mx-4 flex flex-col animate-hw-modal overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-[18px] font-black text-gray-800 dark:text-white">
            Yangi uyga vazifa yaratish
          </h2>
        </div>

        <div className="p-7 space-y-6 flex-1 overflow-y-auto">
          {/* Mavzu */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-red-500 mr-1">*</span>Mavzu
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsTopicOpen(!isTopicOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-left transition-all focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-400"
              >
                <span className={selectedTopic ? 'text-gray-800 dark:text-white font-semibold' : 'text-gray-400'}>
                  {selectedTopic || 'Mavzulardan birini tanlang'}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTopicOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isTopicOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden animate-dropdown">
                  {TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => { setSelectedTopic(topic); setIsTopicOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 ${
                        selectedTopic === topic
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-bold'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Izoh — Rich Text Editor */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <span className="text-red-500 mr-1">*</span>Izoh
            </label>
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-400/30 focus-within:border-purple-400 transition-all">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 flex-wrap">
                {/* H1, H2 */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'h1'); }}
                  className="px-2 py-1 text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Sarlavha 1"
                >H1</button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'h2'); }}
                  className="px-2 py-1 text-xs font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Sarlavha 2"
                >H2</button>

                {/* Divider */}
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                {/* Font Family */}
                <select
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => execCmd('fontName', e.target.value)}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-600 rounded px-1.5 py-1 cursor-pointer focus:outline-none"
                >
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Mono</option>
                </select>

                {/* Font Size */}
                <select
                  value={fontSize}
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => handleFontSize(e.target.value)}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-transparent border border-gray-200 dark:border-gray-600 rounded px-1.5 py-1 cursor-pointer focus:outline-none"
                >
                  <option>Kichik</option>
                  <option>Normal</option>
                  <option>Katta</option>
                </select>

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                {/* Bold, Italic, Underline, Strikethrough */}
                {[
                  { cmd: 'bold', icon: <span className="font-black text-sm">B</span>, title: 'Qalin' },
                  { cmd: 'italic', icon: <span className="italic text-sm font-bold">I</span>, title: 'Kursiv' },
                  { cmd: 'underline', icon: <span className="underline text-sm font-bold">U</span>, title: 'Tagiga chizilgan' },
                  { cmd: 'strikeThrough', icon: <span className="line-through text-sm font-bold">S</span>, title: "O'rtadan chizilgan" },
                ].map(({ cmd, icon, title }) => (
                  <button
                    key={cmd}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCmd(cmd); }}
                    title={title}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {icon}
                  </button>
                ))}

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                {/* Blockquote */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'blockquote'); }}
                  title="Iqtibos"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-bold"
                >❝</button>

                {/* Code */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('formatBlock', 'pre'); }}
                  title="Kod"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </button>

                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />

                {/* List, ordered list */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }}
                  title="Ro'yxat"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList'); }}
                  title="Raqamli ro'yxat"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </button>

                {/* Align */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('justifyLeft'); }}
                  title="Chap hizalash"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('justifyCenter'); }}
                  title="Markazga"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); execCmd('justifyRight'); }}
                  title="O'ng hizalash"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M4 18h16" />
                  </svg>
                </button>

                {/* Link */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const url = prompt('URL kiriting:');
                    if (url) execCmd('createLink', url);
                  }}
                  title="Havola"
                  className="w-7 h-7 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>

              {/* Editable Area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => setDescription(e.currentTarget.innerHTML)}
                className="min-h-[140px] p-4 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none leading-relaxed"
                data-placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
                style={{ '--placeholder-color': '#9ca3af' }}
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl py-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                isDragging
                  ? 'border-purple-400 bg-purple-50/30 dark:bg-purple-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              {/* Upload cloud icon */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                isDragging ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-emerald-50 dark:bg-emerald-900/20'
              }`}>
                <svg className={`w-8 h-8 ${isDragging ? 'text-purple-500' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{file.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-gray-700 dark:text-gray-200">Faylni tanlash</span> yoki shu yerga tashlang
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">PDF, Word, ZIP va boshqalar</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-7 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-100/50 dark:shadow-none"
          >
            E'lon qilish
          </button>
        </div>
      </div>

      <style>{`
        @keyframes hwModal {
          from { opacity: 0; transform: translateY(-16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-hw-modal { animation: hwModal 0.28s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown { animation: dropdown 0.15s ease both; }
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: var(--placeholder-color, #9ca3af);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
