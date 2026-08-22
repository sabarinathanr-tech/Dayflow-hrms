import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import {
  LayoutDashboard,
  User,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  BarChart3,
  LogOut,
  X,
  Sparkles
} from 'lucide-react';
import Avatar from './Avatar';
import Badge from './Badge';

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
    { label: 'Leave Requests', path: '/employee/leaves', icon: CalendarDays },
    { label: 'My Payroll', path: '/employee/payroll', icon: CreditCard }
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Attendance', path: '/admin/attendance', icon: CalendarCheck },
    { label: 'Leave Requests', path: '/admin/leaves', icon: CalendarDays },
    { label: 'Payroll', path: '/admin/payroll', icon: CreditCard },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 }
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
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-dark-950 border-r border-dark-700/80 shadow-2xl flex flex-col z-10 transform transition-transform duration-300 animate-in slide-in-from-left">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-dark-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">Dayflow</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Mobile Drawer */}
        <div className="p-4 border-b border-dark-700/60 bg-dark-900/50">
          <div className="flex items-center gap-3">
            <Avatar src={currentUser?.avatar} name={currentUser?.name || 'User'} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge variant={isHR ? 'purple' : 'cyan'} size="sm">
                  {role}
                </Badge>
                <span className="text-[10px] text-slate-400 font-mono">{employeeId}</span>
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 text-white border border-brand-purple/40 shadow-glow-purple'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
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
        <div className="p-4 border-t border-dark-700/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
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
