import React, { useState } from 'react';

const initialRooms = [
  // AlCoder markazi
  { id: 1, name: 'Autodesk', capacity: 20, branch: 'AlCoder markazi' },
  { id: 2, name: 'Impact room', capacity: 12, branch: 'AlCoder markazi' },
  { id: 3, name: '99', capacity: 25, branch: 'AlCoder markazi' },
  { id: 4, name: 'Startup room', capacity: 20, branch: 'AlCoder markazi' },
  { id: 5, name: 'Alpha room', capacity: 18, branch: 'AlCoder markazi' },
  { id: 6, name: 'Beta room', capacity: 14, branch: 'AlCoder markazi' },
  { id: 7, name: 'Conference hall', capacity: 40, branch: 'AlCoder markazi' },

  // Fizika va Matematika
  { id: 8, name: '1A', capacity: 25, branch: 'Fizika va Matematika' },
  { id: 9, name: '205-xona', capacity: 32, branch: 'Fizika va Matematika' },
  { id: 10, name: '301-sinf', capacity: 28, branch: 'Fizika va Matematika' },
  { id: 11, name: 'Lab xona', capacity: 20, branch: 'Fizika va Matematika' },
  { id: 12, name: '102-xona', capacity: 30, branch: 'Fizika va Matematika' },

  // 4-maktab
  { id: 13, name: '16-xona', capacity: 18, branch: '4-maktab' },
  { id: 14, name: '22-xona', capacity: 22, branch: '4-maktab' },
  { id: 15, name: '35-xona', capacity: 26, branch: '4-maktab' },
  { id: 16, name: 'Amaliyot xonasi', capacity: 16, branch: '4-maktab' },
  { id: 17, name: '48-xona', capacity: 30, branch: '4-maktab' },
  { id: 18, name: 'Katta sinf', capacity: 35, branch: '4-maktab' },

  // Niner markazi
  { id: 19, name: '5 xona', capacity: 30, branch: 'Niner markazi' },
  { id: 20, name: '7 xona', capacity: 24, branch: 'Niner markazi' },
  { id: 21, name: 'Niner-A', capacity: 20, branch: 'Niner markazi' },
  { id: 22, name: 'Niner-B', capacity: 18, branch: 'Niner markazi' },
  { id: 23, name: 'Guruh xonasi', capacity: 15, branch: 'Niner markazi' },

  // IELTS full mock
  { id: 24, name: 'IELTS with islombek', capacity: 20, branch: 'IELTS full mock' },
  { id: 25, name: 'Speaking room 1', capacity: 8, branch: 'IELTS full mock' },
  { id: 26, name: 'Speaking room 2', capacity: 8, branch: 'IELTS full mock' },
  { id: 27, name: 'Writing hall', capacity: 30, branch: 'IELTS full mock' },
  { id: 28, name: 'Listening room', capacity: 25, branch: 'IELTS full mock' },

  // IELTS full mock centre
  { id: 29, name: 'Beginner', capacity: 18, branch: 'IELTS full mock centre' },
  { id: 30, name: 'Intermediate', capacity: 22, branch: 'IELTS full mock centre' },
  { id: 31, name: 'Advanced', capacity: 20, branch: 'IELTS full mock centre' },
  { id: 32, name: 'Mock test hall', capacity: 35, branch: 'IELTS full mock centre' },
  { id: 33, name: 'Practice room', capacity: 15, branch: 'IELTS full mock centre' },

  // Arxiv
  { id: 34, name: 'Arxiv-1', capacity: 10, branch: 'Arxiv' },
  { id: 35, name: 'Arxiv-2', capacity: 10, branch: 'Arxiv' },
  { id: 36, name: 'Eski sinf xona', capacity: 20, branch: 'Arxiv' },
];

const branches = ['AlCoder markazi', 'Fizika va Matematika', '4-maktab', 'Niner markazi', 'IELTS full mock', 'IELTS full mock centre', 'Arxiv'];

export default function Rooms() {
  const [rooms, setRooms] = useState(initialRooms);
  const [activeBranch, setActiveBranch] = useState('AlCoder markazi');
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState({ name: '', capacity: '' });

  const filtered = rooms.filter(r => r.branch === activeBranch);

  const handleDelete = (id) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setForm({ name: room.name, capacity: room.capacity });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditRoom(null);
    setForm({ name: '', capacity: '' });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.capacity) return;
    if (editRoom) {
      setRooms(prev => prev.map(r => r.id === editRoom.id ? { ...r, name: form.name, capacity: Number(form.capacity) } : r));
    } else {
      setRooms(prev => [...prev, { id: Date.now(), name: form.name, capacity: Number(form.capacity), branch: activeBranch }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[24px] font-black text-gray-900 dark:text-white">Xonalar</h2>
          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors mt-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7B2CBF] text-white text-[15px] font-bold rounded-xl hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-100 dark:shadow-none active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Xonani qo'shish
        </button>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
          <p className="text-base">Xonalar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map(room => (
            <div
              key={room.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition-shadow shadow-sm"
            >
              <div>
                <p className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">{room.name}</p>
                <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Sig'imi: {room.capacity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(room.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="O'chirish"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleEdit(room)}
                  className="p-1.5 text-[#7B2CBF] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  title="Tahrirlash"
                >
                  <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-5">
              {editRoom ? 'Xonani tahrirlash' : 'Yangi xona qo\'shish'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Xona nomi</label>
                <input
                  type="text"
                  placeholder="Masalan: 201-xona"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">Sig'imi (o'rinlar soni)</label>
                <input
                  type="number"
                  placeholder="Masalan: 20"
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
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
                disabled={!form.name || !form.capacity}
                className="flex-1 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editRoom ? 'Saqlash' : 'Qo\'shish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
