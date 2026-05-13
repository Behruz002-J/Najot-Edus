import React from 'react';

const teachers = [
  { id: 1, name: 'Qwerty qwert', group: ['Label', 'Label', 'Label', '+4'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 2, name: 'Qwerty qwert', group: ['Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 3, name: 'Qwerty qwert', group: ['Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 4, name: 'Qwerty qwert', group: ['Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 5, name: 'Qwerty qwert', group: ['Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 6, name: 'Qwerty qwert', group: ['Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 7, name: 'Qwerty qwert', group: ['Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 8, name: 'Qwerty qwert', group: ['Label', 'Label', 'Label', '+1'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 9, name: 'Qwerty qwert', group: ['Label', 'Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
  { id: 10, name: 'Qwerty qwert', group: ['Label', 'Label'], phone: '+998(33)4082808', birthDate: '24 Jan 2022', createdDate: '24 Jan 2022', coin: '123 123' },
];

export default function Teacher() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header / Filters */}
      <div className="p-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold border border-gray-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </button>
          <div className="flex items-center gap-2 border-l pl-2 ml-2">
             <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-gray-600 rounded-lg text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-red-400 hover:text-red-600 rounded-lg text-xs font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Delete
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-gray-50 border-none rounded-lg py-1.5 pl-9 pr-4 text-xs w-64 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
              <th className="px-6 py-3 font-medium text-center w-10">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
              </th>
              <th className="px-6 py-3 font-medium">Nomi <svg className="w-3 h-3 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></th>
              <th className="px-6 py-3 font-medium">Guruh</th>
              <th className="px-6 py-3 font-medium">Telefon raqamlari</th>
              <th className="px-6 py-3 font-medium">Tug'ilgan sanasi</th>
              <th className="px-6 py-3 font-medium">Yaratilgan sana</th>
              <th className="px-6 py-3 font-medium">Coin</th>
              <th className="px-6 py-3 font-medium text-center">Amallar</th>
            </tr>
          </thead>
          <tbody className="text-[12px] divide-y divide-gray-50">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.id}`} alt="" className="w-8 h-8 rounded-full bg-gray-100" />
                    <span className="font-semibold text-gray-700">{teacher.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {teacher.group.map((g, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${g.startsWith('+') ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{teacher.phone}</td>
                <td className="px-6 py-4 text-gray-500">{teacher.birthDate}</td>
                <td className="px-6 py-4 text-gray-500">{teacher.createdDate}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 font-bold text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    {teacher.coin}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <button className="p-1.5 text-green-400 hover:bg-green-50 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors ml-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-50 flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-800 text-xs font-semibold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, 2, 3, '...', 8, 9, 10].map((p, i) => (
            <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold ${p === 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
              {p}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-800 text-xs font-semibold">
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
