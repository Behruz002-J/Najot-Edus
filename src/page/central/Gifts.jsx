import React, { useState } from "react";

const INITIAL_GIFTS = [
  { id: 1, name: "NajotEdu Hoodie", cost: 150, category: "Kiyimlar", image: "👕", desc: "Premium sifatli brend kapyushonli sviter", count: 12 },
  { id: 2, name: "Smart Termos", cost: 100, category: "Aksessuarlar", image: "☕", desc: "Harorat datchigiga ega zanglamaydigan po'lat termos", count: 8 },
  { id: 3, name: "Rukzak brendli", cost: 120, category: "Aksessuarlar", image: "🎒", desc: "Suv o'tkazmaydigan qulay va sig'imli rukzak", count: 15 },
  { id: 4, name: "NajotEdu Bloknot", cost: 40, category: "Kanselyariya", image: "📓", desc: "Charm muqovali maxsus rejalashtiruvchi bloknot", count: 45 },
  { id: 5, name: "Brendlangan ruchka", cost: 15, category: "Kanselyariya", image: "🖊️", desc: "Elegant metall korpusli brend ruchka", count: 120 },
  { id: 6, name: "Powerbank 10000mAh", cost: 90, category: "Texnika", image: "🔋", desc: "Tezkor quvvatlash xususiyatiga ega tashqi akkumulyator", count: 5 },
  { id: 7, name: "Stikerlar to'plami", cost: 10, category: "Kanselyariya", image: "🎨", desc: "Loyiha va dasturlashga oid ajoyib stikerlar paketi", count: 200 },
  { id: 8, name: "Brendlangan fleshka 64GB", cost: 60, category: "Texnika", image: "💾", desc: "USB 3.0 tezkor ma'lumot uzatuvchi flesh-disk", count: 22 }
];

export default function Gifts() {
  const [gifts, setGifts] = useState(INITIAL_GIFTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Kiyimlar", "Aksessuarlar", "Kanselyariya", "Texnika"];

  const filtered = gifts.filter((gift) => {
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          gift.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || gift.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sovg'alar do'koni</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            O'quvchilar o'zlarining to'plagan EduCoin'larini sovg'alarga almashtirish bo'limi.
          </p>
        </div>
        <button 
          onClick={() => alert("Yangi sovg'a qo'shish oynasi (Tez kunda...)")}
          className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg text-sm font-semibold hover:bg-[#6D28D9] transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi sovg'a qo'shish
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="relative w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Sovg'alardan qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#7C3AED] dark:text-white outline-none"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-[#7C3AED] text-white"
                  : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {cat === "all" ? "Barchasi" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gift Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500 font-semibold">
          Qidiruv bo'yicha sovg'alar topilmadi.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((gift) => (
            <div 
              key={gift.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              {/* Image Box */}
              <div className="h-40 bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center text-6xl relative select-none">
                {gift.image}
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 shadow-sm">
                  🪙 {gift.cost} Coin
                </span>
              </div>

              {/* Info Box */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">
                      {gift.category}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">
                      Zaxira: {gift.count} ta
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#7C3AED] transition-colors">
                    {gift.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {gift.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 dark:border-gray-700/50 flex gap-2">
                  <button 
                    onClick={() => alert(`"${gift.name}" tahrirlash oynasi (Tez kunda...)`)}
                    className="flex-1 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border border-gray-100 dark:border-gray-600"
                  >
                    Tahrirlash
                  </button>
                  <button 
                    onClick={() => alert(`O'quvchiga taqdim etish: "${gift.name}"`)}
                    className="flex-1 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Taqdim etish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
