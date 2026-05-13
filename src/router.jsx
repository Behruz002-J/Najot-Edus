import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import ProtectRoute from "./components/ProtectRoute";

import About from "./page/About";
import Central from "./page/Central";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Student from "./page/Student";
import Teacher from "./page/Teacher";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "central",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Central />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: (
      <ProtectRoute>
        <DashboardLayout />
      </ProtectRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "student",
        element: <Student />,
      },
      {
        path: "teacher",
        element: <Teacher />,
      }
    ],
  },
]);