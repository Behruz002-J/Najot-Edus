import React from "react";

export default function MyPayments() {
  const payments = [
    { id: 1, amount: "1,200,000 UZS", date: "2026-05-10", status: "Muvaffaqiyatli", type: "Karta orqali" },
    { id: 2, amount: "1,200,000 UZS", date: "2026-04-12", status: "Muvaffaqiyatli", type: "Payme" }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">To'lovlar tarixi</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Barcha amalga oshirgan o'quv to'lovlaringiz ro'yxati</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Miqdori</th>
              <th className="py-3 px-4">Sana</th>
              <th className="py-3 px-4">Usul</th>
              <th className="py-3 px-4">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50 text-sm">
            {payments.map((p, index) => (
              <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20">
                <td className="py-4 px-4 font-medium text-gray-900 dark:text-gray-100">{index + 1}</td>
                <td className="py-4 px-4 font-semibold text-gray-850 dark:text-gray-200">{p.amount}</td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{p.date}</td>
                <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{p.type}</td>
                <td className="py-4 px-4">
                  <span className="bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-medium border border-green-100 dark:border-green-900/30">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
