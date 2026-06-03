import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ManagementFlyout from "./ManagementFlyout";
import SidebarHeader from "./SidebarHeader";
import SidebarNav from "./SidebarNav";
import SidebarFooter from "./SidebarFooter";
import axiosClient from "../../api/axios";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const managementRef = useRef(null);
  const flyoutRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [roomsCount, setRoomsCount] = useState(null);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("username");
    navigate("/login");
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

  // fetch rooms count for Management -> Xonalar
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fallbackToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhYmR1a2hvc2hpbTk5QGdtYWlsLmNvbSIsInJvbGUiOiJTVVBFUkFETUlOIiwiaWF0IjoxNzc5ODgwMjcyLCJleHAiOjE3Nzk4ODM4NzJ9.Ycve5YHkjOJVOcOY5ZtB7kDrr_z_QUw-_xoBpI1Jq5I";
        if (!window.localStorage.getItem("token")) {
          window.localStorage.setItem("token", fallbackToken);
        }
        const res = await axiosClient.get("/rooms");
        const data = res?.data;
        let count = 0;
        if (Array.isArray(data)) count = data.length;
        else if (Array.isArray(data?.data)) count = data.data.length;
        setRoomsCount(count);
      } catch (err) {
        console.error("Fetch rooms error:", err?.response?.data || err.message);
        setRoomsCount(null);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>
      <aside
        className="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col shadow-sm z-[70] relative transition-all duration-300"
        style={{ width: isCollapsed ? "80px" : "256px" }}
      >
        <SidebarHeader
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <SidebarNav
          isCollapsed={isCollapsed}
          isManagementOpen={isManagementOpen}
          setIsManagementOpen={setIsManagementOpen}
          managementRef={managementRef}
        />

        <SidebarFooter isCollapsed={isCollapsed} handleLogout={handleLogout} />
      </aside>

      <ManagementFlyout
        isCollapsed={isCollapsed}
        isManagementOpen={isManagementOpen}
        setIsManagementOpen={setIsManagementOpen}
        flyoutRef={flyoutRef}
        roomsCount={roomsCount}
      />
    </>
  );
}
