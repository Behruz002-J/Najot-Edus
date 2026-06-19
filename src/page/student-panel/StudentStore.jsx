import React from "react";

export default function StudentStore() {
  const products = [
    { id: 1, title: "Najot Edu Hudi", price: 120, image: "🧥", desc: "Sifatli va qulay brendli kiyim" },
    { id: 2, title: "Brendli Termos", price: 60, image: "🥤", desc: "Issiq va sovuq saqlovchi termos" },
    { id: 3, title: "Dasturlash kitoblari", price: 40, image: "📚", desc: "Clean Code va o'zbek tilidagi adabiyotlar" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Najot do'koni (Coin market)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Yig'gan coinlaringiz evaziga ajoyib sovg'alarni xarid qiling</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-5 space-y-4">
            <div className="space-y-2">
              <div className="text-4xl py-6 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg flex items-center justify-center border border-purple-100/30">
                {p.image}
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">{p.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{p.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{p.price} Coin</span>
              <button className="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors">
                Xarid qilish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
