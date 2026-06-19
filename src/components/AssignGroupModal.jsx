import React, { useState, useEffect } from "react";
import axiosClient from "../api/axios";

export default function AssignGroupModal({
  isOpen,
  onClose,
  onAssign,
  selectedGroups = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState(selectedGroups);
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Fetch real groups from API when modal opens
  useEffect(() => {
    if (!isOpen) return;
    setTempSelected(selectedGroups);
    setLoadingGroups(true);
    axiosClient
      .get("/groups/all")
      .then((res) => {
        const data = res?.data;
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.data)) list = data.data;
        
        const apiMapped = list.map((g) => ({
          id: g.id,
          name: g.name || `Guruh #${g.id}`,
        }));

        // Load local groups
        const localGroups = JSON.parse(window.localStorage.getItem("local_groups") || "[]");
        const localMapped = localGroups.map((g) => ({
          id: g.id,
          name: g.name,
        }));

        // Merge & deduplicate by name
        const merged = [...localMapped];
        apiMapped.forEach(ag => {
          if (!merged.some(lg => lg.name.toLowerCase() === ag.name.toLowerCase())) {
            merged.push(ag);
          }
        });

        setGroups(merged);
      })
      .catch(() => {
        // Fallback to local groups only
        const localGroups = JSON.parse(window.localStorage.getItem("local_groups") || "[]");
        const localMapped = localGroups.map((g) => ({
          id: g.id,
          name: g.name,
        }));
        setGroups(localMapped);
      })
      .finally(() => setLoadingGroups(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleGroup = (groupId) => {
    if (tempSelected.includes(groupId)) {
      setTempSelected(tempSelected.filter((g) => g !== groupId));
    } else {
      setTempSelected([...tempSelected, groupId]);
    }
  };

  const handleAssign = () => {
    onAssign(tempSelected);
    onClose();
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="p-4 pb-1 flex items-start justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">
              Guruhga biriktirish
            </h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5">
              Bir yoki bir nechta guruhni tanlang
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 pt-2 space-y-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Guruh qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-900 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all dark:text-white text-xs"
            />
          </div>

          {/* Selected count */}
          {tempSelected.length > 0 && (
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
              {tempSelected.length} ta guruh tanlandi
            </p>
          )}

          {/* Groups List */}
          <div className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden divide-y divide-gray-50 dark:divide-gray-800 max-h-[220px] overflow-y-auto custom-scrollbar">
            {loadingGroups ? (
              <div className="flex items-center justify-center gap-2 py-6 text-xs text-gray-400">
                <svg className="animate-spin w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guruhlar yuklanmoqda...
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-400">
                Guruhlar topilmadi
              </div>
            ) : (
              filteredGroups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 py-2 px-3 hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(group.id)}
                    onChange={() => toggleGroup(group.id)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer"
                  />
                  <span className={`text-xs font-medium transition-colors ${
                    tempSelected.includes(group.id)
                      ? "text-purple-700 dark:text-purple-300 font-bold"
                      : "text-gray-900 dark:text-gray-200"
                  }`}>
                    {group.name}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-1 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-1.5 border border-gray-100 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-gray-300 hover:bg-gray-50 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleAssign}
            className="px-5 py-1.5 bg-[#B794F4] text-white rounded-lg text-xs font-bold hover:bg-[#A78BFA] transition-all shadow-sm"
          >
            Qo'shish
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes zoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
      `,
        }}
      />
    </div>
  );
}
