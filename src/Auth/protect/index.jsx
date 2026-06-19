import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProtectRoute({ children }) {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    const handleOffline = () => {
      // Internet uzilganda yoki ishlamay qolganda loginga yo'naltirish
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("_creds");
      window.localStorage.removeItem("username");
      navigate("/login", { replace: true });
    };

    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
