import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = window.localStorage.getItem("token");
  const role = window.localStorage.getItem("role");

  if (token) {
    if (role === "STUDENT" || role === "student" || role === "PUPIL" || role === "pupil") {
      return <Navigate to="/dashboard/my-groups" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
