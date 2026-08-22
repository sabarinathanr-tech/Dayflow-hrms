import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AdminLayout from '../layouts/AdminLayout';

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
import AdminProfile from '../pages/admin/AdminProfile';

// Common Pages
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRoutes = () => {
  const { isAuthenticated, isHR } = useAuth();

  return (
    <Routes>
      {/* Root redirector */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={isHR ? '/admin/dashboard' : '/employee/dashboard'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public Authentication routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Support invitation / register alias */}
        <Route path="/invitation" element={<Register />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Employee Portal Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={['Employee', 'EMPLOYEE', 'HR', 'Admin', 'HR Officer']}>
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="time-off" element={<MyLeaves />} />
        <Route path="leaves" element={<MyLeaves />} />
        <Route path="payroll" element={<MyPayroll />} />
      </Route>

      {/* Admin / HR Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['HR', 'Admin', 'HR Officer', 'ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="time-off" element={<LeaveRequests />} />
        <Route path="leaves" element={<LeaveRequests />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* 404 Not Found Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
