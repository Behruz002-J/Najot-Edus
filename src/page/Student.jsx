import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AddStudentModal from '../components/AddStudentModal';

const initialStudents = [
  { id: 1, name: 'Ali Valiyev', groups: ['N26', 'n105'], phone: '+998976541223', email: 'ali@gmail.com', birthDate: '12.12.2010', address: 'Sirdaryo', createdDate: '12.05.2026' },
  { id: 2, name: 'Salim Qodirov', groups: ['n105'], phone: '+998977777777', email: 'salim@gmail.com', birthDate: '14.01.2007', address: 'Buxoro', createdDate: '14.05.2026', initial: 'S', bgColor: 'bg-purple-100 text-purple-600' },
  { id: 3, name: 'Bobur', groups: ['n105'], phone: '+998999999999', email: 'bobur@gmail.com', birthDate: '14.03.2002', address: 'Toshkent', createdDate: '14.05.2026', initial: 'B', bgColor: 'bg-blue-100 text-blue-600' },
  { id: 4, name: 'Qodir Salimov', groups: ['n105'], phone: '+998911111111', email: 'qodir@gmail.com', birthDate: '29.04.2026', address: "O'zbekcha", createdDate: '14.05.2026', initial: 'Q', bgColor: 'bg-purple-100 text-purple-600' },
];

export default function Student() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(initialStudents);
  const { isStudentModalOpen, setIsStudentModalOpen } = useOutletContext();
  const [editingStudent, setEditingStudent] = useState(null);

  const handleAddStudent = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: students.length + 1,
      groups: ['Yangi'],
      createdDate: new Date().toLocaleDateString('uz-UZ'),
    };
    setStudents([studentWithId, ...students]);
  };

  const handleEditStudent = (updatedStudent) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setEditingStudent(null);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Haqiqatdan ham ushbu talabani o'chirib tashlamoqchimisiz?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };

  const handleViewStudent = (student) => {
    alert(`Talaba ma'lumotlari:\nFIO: ${student.name}\nTel: ${student.phone}\nEmail: ${student.email}`);
  };

  // Reset editingStudent when modal closes
  useEffect(() => {
    if (!isStudentModalOpen) {
      setEditingStudent(null);
    }
  }, [isStudentModalOpen]);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-72 focus:ring-1 focus:ring-blue-100 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold border border-gray-100 dark:border-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-semibold border border-gray-100 dark:border-gray-600">
              Arxiv
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[12px] text-gray-400 font-semibold border-b border-gray-50 dark:border-gray-700">
                <th className="px-6 py-4 w-10">
                  <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4">Nomi <svg className="w-3 h-3 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></th>
                <th className="px-6 py-4">Guruh</th>
                <th className="px-6 py-4">Telefon raqamlari</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Tug'ilgan sanasi</th>
                <th className="px-6 py-4">Manzil</th>
                <th className="px-6 py-4">Yaratilgan sana</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-gray-50 dark:divide-gray-700">
              {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {student.initial ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${student.bgColor}`}>
                          {student.initial}
                        </div>
                      ) : (
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700" />
                      )}
                      <span className="font-medium text-gray-700 dark:text-gray-200">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {student.groups.map((group, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-[11px] font-medium border border-gray-200 dark:border-gray-600">
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{student.phone}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.email}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.birthDate}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.address}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{student.createdDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewStudent(student)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <button 
                        onClick={() => openEditModal(student)}
                        className="p-1.5 text-purple-400 hover:text-purple-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" /></svg>
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3, '...', 8, 9, 10].map((p, i) => (
              <button key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold ${p === 1 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-semibold">
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
      <AddStudentModal 
        isOpen={isStudentModalOpen} 
        onClose={() => setIsStudentModalOpen(false)} 
        onAdd={handleAddStudent} 
        onEdit={handleEditStudent}
        studentData={editingStudent}
      />
    </>
  );
}
