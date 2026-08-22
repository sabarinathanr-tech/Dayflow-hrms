import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AdminLayout from '../layouts/AdminLayout';

// Guard
import ProtectedRoute from '../components/common/ProtectedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Employee Pages
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import MyProfile from '../pages/employee/MyProfile';
import MyAttendance from '../pages/employee/MyAttendance';
import MyLeaves from '../pages/employee/MyLeaves';
import MyPayroll from '../pages/employee/MyPayroll';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Employees from '../pages/admin/Employees';
import EmployeeDetails from '../pages/admin/EmployeeDetails';
import AdminAttendance from '../pages/admin/AdminAttendance';
import LeaveRequests from '../pages/admin/LeaveRequests';
import Payroll from '../pages/admin/Payroll';
import Reports from '../pages/admin/Reports';

// 404
import NotFound from '../pages/NotFound';

// Root redirector based on authentication
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = (role || '').toUpperCase();
  if (normalizedRole === 'HR' || normalizedRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/employee/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Entry */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public / Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Employee Protected Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['Employee', 'HR', 'Admin']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="leaves" element={<MyLeaves />} />
        <Route path="payroll" element={<MyPayroll />} />
      </Route>

      {/* Admin / HR Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['HR', 'Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="leaves" element={<LeaveRequests />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
