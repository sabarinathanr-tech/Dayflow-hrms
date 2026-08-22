import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import DayflowLogo from './DayflowLogo';
import {
  LayoutDashboard,
  User,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  BarChart3,
  LogOut,
  Sparkles,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { isHR, logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const employeeNavItems = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'Attendance', path: '/employee/attendance', icon: CalendarCheck },
    { label: 'Time Off', path: '/employee/time-off', icon: CalendarDays },
    { label: 'Payroll', path: '/employee/payroll', icon: CreditCard }
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { label: 'Time Off', path: '/admin/time-off', icon: CalendarDays },
    { label: 'Payroll', path: '/admin/payroll', icon: CreditCard },
    { label: 'Reports / Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Admin Profile', path: '/admin/profile', icon: User }
  ];

  const navItems = isHR ? adminNavItems : employeeNavItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-dark-950 border-r border-slate-200 dark:border-dark-700/60 h-screen sticky top-0 select-none transition-colors">
      {/* Brand Logo Header */}
      <div className="flex items-center px-6 h-16 border-b border-slate-200 dark:border-dark-700/60">
        <DayflowLogo size="md" linkTo={isHR ? '/admin/dashboard' : '/employee/dashboard'} />
      </div>

      {/* Role Badge Section */}
      <div className="px-5 py-4">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-dark-850/80 border border-slate-200 dark:border-dark-700/60 flex items-center justify-between shadow-card-light dark:shadow-none">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400">Portal</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isHR ? 'HR Administration' : 'Employee Workspace'}
            </span>
          </div>
          <div className={`w-2.5 h-2.5 rounded-full ${isHR ? 'bg-brand-purple shadow-glow-purple' : 'bg-brand-cyan shadow-glow-cyan'}`} />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple/15 to-brand-magenta/10 text-brand-purple dark:text-white border border-brand-purple/30 dark:border-brand-purple/40 shadow-card-light dark:shadow-[0_0_15px_-4px_rgba(168,85,247,0.3)]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-850 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-purple dark:text-brand-magenta-light' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple dark:bg-brand-cyan shadow-glow-purple dark:shadow-glow-cyan" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer / User & Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-dark-700/60 bg-slate-50/50 dark:bg-dark-900/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
