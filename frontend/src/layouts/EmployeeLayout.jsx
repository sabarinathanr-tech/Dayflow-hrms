import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import MobileNav from '../components/common/MobileNav';

const EmployeeLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/employee/dashboard')) return 'Employee Dashboard';
    if (path.includes('/employee/profile')) return 'My Profile';
    if (path.includes('/employee/attendance')) return 'My Attendance';
    if (path.includes('/employee/leaves')) return 'My Leave Requests';
    if (path.includes('/employee/payroll')) return 'My Payroll & Payslips';
    return 'Employee Portal';
  };

  return (
    <div className="min-h-screen bg-dark-900 flex text-slate-100 selection:bg-brand-purple selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pageTitle={getPageTitle()}
          onToggleMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
