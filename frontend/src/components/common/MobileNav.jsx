import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import DayflowLogo from './DayflowLogo';
import Avatar from './Avatar';
import Badge from './Badge';
import ThemeToggle from './ThemeToggle';
import {
  LayoutDashboard,
  User,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  BarChart3,
  LogOut,
  X
} from 'lucide-react';

const MobileNav = ({ isOpen, onClose }) => {
  const { isHR, logout, currentUser, role, employeeId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const employeeNavItems = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'Attendance', path: '/employee/attendance', icon: CalendarCheck },
    { label: 'Time Off', path: '/employee/time-off', icon: CalendarDays },
    { label: 'My Payroll', path: '/employee/payroll', icon: CreditCard }
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
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-dark-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-dark-950 border-r border-slate-200 dark:border-dark-700/80 shadow-2xl flex flex-col z-10 transform transition-transform duration-300 animate-in slide-in-from-left">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-dark-700/60">
          <DayflowLogo size="sm" linkTo={isHR ? '/admin/dashboard' : '/employee/dashboard'} />

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Card inside Mobile Drawer */}
        <div className="p-4 border-b border-slate-200 dark:border-dark-700/60 bg-slate-50 dark:bg-dark-900/50">
          <div className="flex items-center gap-3">
            <Avatar src={currentUser?.avatar} name={currentUser?.name || 'User'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant={isHR ? 'purple' : 'cyan'} size="sm">
                  {role}
                </Badge>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{employeeId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-brand-purple/15 text-brand-purple dark:text-white border border-brand-purple/30 dark:border-brand-purple/40 dark:bg-gradient-to-r dark:from-brand-purple/20 dark:to-brand-magenta/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-850'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-dark-700/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
