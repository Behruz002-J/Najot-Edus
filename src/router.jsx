import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectRoute from "./components/ProtectRoute";

import About from "./page/central/About";
import Central from "./page/central/Central";
import Login from "./page/Login";
import Dashboard from "./page/Dashboard";
import Student from "./page/students/Student";
import Gifts from "./page/central/Gifts";
import Teacher from "./page/teachers/Teacher";
import Groups from "./page/groups/Groups";
import GroupDetails from "./page/groups/GroupDetails";
import LessonAttendance from "./page/groups/LessonAttendance";
import VideoPlayer from "./page/groups/VideoPlayer";
import Rooms from "./page/management/Rooms";
import Courses from "./page/management/Courses";
import ManagementLayout from "./page/management/ManagementLayout";
import Staff from "./page/management/Staff";
import Archive from "./page/management/Archive";
import CreateHomework from "./page/groups/CreateHomework";
import CreateExam from "./page/groups/CreateExam";
import ExamDetail from "./page/groups/ExamDetail";
import HomeworkDetail from "./page/groups/HomeworkDetail";

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
      { path: "gifts", element: <Gifts /> },
      { path: "teacher", element: <Teacher /> },
      { path: "groups", element: <Groups /> },
      { path: "groups/:id", element: <GroupDetails /> },
      { path: "groups/:id/homework/create", element: <CreateHomework /> },
      { path: "groups/:id/homework/:homeworkId", element: <HomeworkDetail /> },
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
          { path: "archive", element: <Archive /> },
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