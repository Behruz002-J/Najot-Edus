import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ManagementFlyout from './ManagementFlyout';
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const managementRef = useRef(null);
  const flyoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideButton = managementRef.current?.contains(event.target);
      const clickedInsideFlyout = flyoutRef.current?.contains(event.target);
      if (!clickedInsideButton && !clickedInsideFlyout) {
        setIsManagementOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsManagementOpen(false);
  }, [location.pathname]);

  return (
    <>
      <aside className="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col shadow-sm z-20 relative transition-all duration-300"
        style={{ width: isCollapsed ? '80px' : '256px' }}
      >
        <SidebarHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        
        <SidebarNav 
          isCollapsed={isCollapsed} 
          isManagementOpen={isManagementOpen} 
          setIsManagementOpen={setIsManagementOpen} 
          managementRef={managementRef} 
        />

        <SidebarFooter 
          isCollapsed={isCollapsed} 
          handleLogout={handleLogout} 
        />
      </aside>

      <ManagementFlyout 
        isCollapsed={isCollapsed}
        isManagementOpen={isManagementOpen}
        setIsManagementOpen={setIsManagementOpen}
        flyoutRef={flyoutRef}
      />
    </>
  );
}
