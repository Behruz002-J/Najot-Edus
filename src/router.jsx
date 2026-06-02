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
import Groups from "./page/Groups";
import GroupDetails from "./page/GroupDetails";
import LessonAttendance from "./page/LessonAttendance";
import VideoPlayer from "./page/VideoPlayer";
import Rooms from "./page/management/Rooms";
import Courses from "./page/management/Courses";
import ManagementLayout from "./page/management/ManagementLayout";
import Staff from "./page/management/Staff";
import CreateHomework from "./page/CreateHomework";
import CreateExam from "./page/CreateExam";
import ExamDetail from "./page/ExamDetail";

export const route = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "central",
    element: <MainLayout />,
    children: [
      { index: true, element: <Central /> },
      { path: "about", element: <About /> },
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
      { index: true, element: <Dashboard /> },
      { path: "students", element: <Student /> },
      { path: "teacher", element: <Teacher /> },
      { path: "groups", element: <Groups /> },
      { path: "groups/:id", element: <GroupDetails /> },
      { path: "groups/:id/homework/create", element: <CreateHomework /> },
      { path: "groups/:id/exam/create", element: <CreateExam /> },
      { path: "groups/:id/exam/:examId", element: <ExamDetail /> },
      { path: "groups/:groupId/lesson/:date", element: <LessonAttendance /> },
      { path: "groups/:groupId/video/:videoId", element: <VideoPlayer /> },
      {
        path: "management",
        element: <ManagementLayout />,
        children: [
          { index: true, element: <Navigate to="courses" replace /> },
          { path: "courses", element: <Courses /> },
          { path: "rooms", element: <Rooms /> },
          { path: "branch", element: <div className="p-4 text-gray-500">Filiallar sahifasi (Tez kunda...)</div> },
          { path: "staff", element: <Staff /> },
          { path: "roles", element: <div className="p-4 text-gray-500">Rollar sahifasi (Tez kunda...)</div> },
          { path: "coin", element: <div className="p-4 text-gray-500">Coin sahifasi (Tez kunda...)</div> },
          { path: "reasons", element: <div className="p-4 text-gray-500">Sabablar sahifasi (Tez kunda...)</div> },
          { path: "message", element: <div className="p-4 text-gray-500">Xabar yuborish sahifasi (Tez kunda...)</div> },
          { path: "faq", element: <div className="p-4 text-gray-500">FAQ sahifasi (Tez kunda...)</div> },
          { path: "check", element: <div className="p-4 text-gray-500">Tekshiruv sahifasi (Tez kunda...)</div> },
        ]
      }
    ],
  },
]);