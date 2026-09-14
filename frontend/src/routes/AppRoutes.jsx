import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ComplaintsPage from "../pages/Admin/ComplaintsPage";
import TaskManagementPage from "../pages/Admin/TaskManagement/TaskManagementPage";
import StaffManagementPage from "../pages/Admin/StaffManagement/StaffManagementPage";
import ReportsAnalyticsPage from "../pages/Admin/ReportsAnalytics/ReportsAnalyticsPage";
import SettingsPage from "../pages/Admin/SettingsPage";
import SearchPage from "../pages/Admin/SearchPage";
import CitizenDashboard from "../pages/Citizen/CitizenDashboard";
import StaffDashboard from "../pages/Staff/StaffDashboard";
// import WorkerDashboard from "../pages/Worker/WorkerDashboard";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute role="ADMIN">
              <ComplaintsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tasks"
          element={
            <ProtectedRoute role="ADMIN">
              <TaskManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute role="ADMIN">
              <StaffManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="ADMIN">
              <ReportsAnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="ADMIN">
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/search"
          element={
            <ProtectedRoute role="ADMIN">
              <SearchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute role="CITIZEN">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute role="STAFF">
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute role="WORKER">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
