import React from "react";
import { Link, useLocation } from "react-router-dom";
import { managementSubItems } from "../../data/navigation";
import { useLanguage } from "../../context/LanguageContext";

export default function ManagementFlyout({
  isCollapsed,
  isManagementOpen,
  setIsManagementOpen,
  flyoutRef,
}) {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div
      ref={flyoutRef}
      style={{
        left: isCollapsed ? "80px" : "256px",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
        transform: isManagementOpen ? "translateX(0)" : "translateX(-20px)",
        opacity: isManagementOpen ? 1 : 0,
        pointerEvents: isManagementOpen ? "auto" : "none",
      }}
      className="fixed top-0 bottom-0 h-full w-[280px] bg-white dark:bg-gray-900 border-r border-gray-50 dark:border-gray-800 shadow-[20px_0_40px_rgba(0,0,0,0.05)] z-[60] rounded-tr-[30px] rounded-br-[30px] overflow-hidden"
    >
      <div className="p-8 h-full flex flex-col relative">
        {/* Header */}
        <div className="flex items-center mb-8 pl-8">
          <h2 className="text-[22px] font-bold text-gray-900 dark:text-white">
            Menu
          </h2>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-50 dark:bg-gray-800 mb-8 ml-[-32px] w-[calc(100%+64px)]"></div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2">
          {managementSubItems.map((subItem) => {
            const isSubItemActive = location.pathname === subItem.path;
            return (
              <Link
                key={subItem.name}
                to={subItem.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isSubItemActive
                    ? "bg-gray-100 dark:bg-gray-800/50"
                    : "hover:bg-purple-200 dark:hover:bg-purple-800/40"
                }`}
              >
                <div
                  className={`transition-colors duration-300 ${isSubItemActive ? "text-[#5A6376] dark:text-gray-300" : "text-[#6B7280] group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300"}`}
                >
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={subItem.icon}
                    />
                  </svg>
                </div>
                <span
                  className={`text-[17px] tracking-tight font-medium transition-colors duration-300 ${
                    isSubItemActive
                      ? "text-gray-900 dark:text-gray-300"
                      : "text-gray-900 dark:text-gray-300 group-hover:text-[#7B2CBF] dark:group-hover:text-purple-300"
                  }`}
                >
                  {subItem.key ? t(subItem.key) : subItem.name}
                </span>

              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
