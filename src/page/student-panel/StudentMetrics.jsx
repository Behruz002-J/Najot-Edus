import React from "react";

// Diamond Icon SVG
const DiamondIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3 8 9l4 12 4-12-3-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
  </svg>
);

// Globe Icon SVG
const GlobeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20" />
  </svg>
);

// Line Chart / Trend Up Icon SVG
const TrendUpIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

// Detail Log Icon SVG (Box-arrow-right)
const DetailLogIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function StudentMetrics() {
  const currentXP = 584;
  const targetXP = 750;
  const stage = 2;
  const silvers = 2860;
  
  // Calculate percentage for progress bar (584 / 750 = ~77.8%)
  const percentage = Math.min(100, Math.max(0, (currentXP / targetXP) * 100));

  const monitoringItems = [
    { text: "Darsga ishtirok bo'yicha jami XP 342, Jami Kumush 1694" },
    { text: "Uyga vazifa bo'yicha jami XP 216, Jami Kumush 1030" },
    { text: "Imtihondan o'tish bo'yicha jami XP 26, Jami Kumush 136" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mening natijalari</h1>
        <div className="flex items-center gap-1.5 text-gray-850 dark:text-gray-250 font-bold">
          <DiamondIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span>Kumushlar: {silvers}</span>
        </div>
      </div>

      {/* Card 1: Bosqich Details */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 w-full md:max-w-md space-y-4">
        <div className="flex items-center gap-2 text-gray-800 dark:text-white font-bold">
          <TrendUpIcon className="w-5 h-5 text-blue-500" />
          <span>Bosqich: {stage}</span>
        </div>

        <div className="flex flex-col space-y-2">
          {/* XP Badge */}
          <div className="bg-[#0b7a39] text-white text-xs font-bold px-2 py-0.5 rounded-md w-fit">
            {currentXP} / {targetXP}
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-green-100 dark:bg-green-950/30 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Globe XP Info */}
        <div className="flex items-center gap-2 text-gray-850 dark:text-white font-bold text-base">
          <GlobeIcon className="w-5.5 h-5.5 text-green-600" />
          <span>XP: {currentXP}</span>
        </div>
      </div>

      {/* Card 2: Yig'ilgan natijalar monitoringi */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 p-5 space-y-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Yig'ilgan natijalar monitoringi</h2>

        {/* List items with borders */}
        <div className="border-t border-b border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          {monitoringItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-4">
              <span className="text-base text-gray-800 dark:text-gray-200 font-medium tracking-wide">
                {item.text}
              </span>
              <button className="text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors p-1">
                <DetailLogIcon className="w-5.5 h-5.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Card Footer Totals */}
        <div className="flex flex-col space-y-3 pt-1">
          <div className="flex items-center gap-2 text-base font-bold text-gray-850 dark:text-white">
            <GlobeIcon className="w-5.5 h-5.5 text-green-600" />
            <span>
              Jami yig'ilgan XP: <span className="text-green-600 dark:text-green-450 font-bold">{currentXP}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-base font-bold text-gray-850 dark:text-white">
            <DiamondIcon className="w-5.5 h-5.5 text-gray-500 dark:text-gray-400" />
            <span>
              Jami yig'ilgan Kumushlar: <span className="text-gray-500 dark:text-gray-400 font-bold">{silvers}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
