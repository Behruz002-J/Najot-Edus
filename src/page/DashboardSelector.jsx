import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import StudentDashboard from "./student-panel/StudentDashboard";

export default function DashboardSelector() {
  const role = window.localStorage.getItem("role") || "TEACHER";
  const isStudent = role === "STUDENT" || role === "student" || role === "PUPIL" || role === "pupil";
  const isTeacher = role === "TEACHER" || role === "teacher";

  if (isStudent) {
    return <StudentDashboard />;
  }
  if (isTeacher) {
    return <Navigate to="/dashboard/groups" replace />;
  }
  return <Dashboard />;
}
