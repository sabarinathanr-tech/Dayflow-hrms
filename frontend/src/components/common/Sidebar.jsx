import React from 'react';
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
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { isHR, logout, currentUser } = useAuth();
  const navigate = useNavigate();

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
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-dark-950 border-r border-dark-700/60 h-screen sticky top-0 select-none">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-dark-700/60">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-magenta flex items-center justify-center shadow-glow-purple flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
            Dayflow <span className="text-[10px] uppercase font-bold tracking-widest text-brand-cyan px-1.5 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/20">HRMS</span>
          </span>
          <span className="text-[10px] text-slate-400 -mt-0.5">Every workday, aligned.</span>
        </div>
      </div>

      {/* Role Badge Section */}
      <div className="px-6 py-4">
        <div className="p-3 rounded-xl bg-dark-850/70 border border-dark-700/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Workspace</span>
            <span className="text-xs font-semibold text-slate-200">{isHR ? 'HR Administration' : 'Employee Portal'}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${isHR ? 'bg-brand-purple shadow-glow-purple' : 'bg-brand-cyan shadow-glow-cyan'}`} />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Main Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-purple/20 to-brand-magenta/10 text-white border border-brand-purple/40 shadow-[0_0_15px_-4px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-magenta-light' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-glow-cyan" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer / User & Logout */}
      <div className="p-4 border-t border-dark-700/60 bg-dark-900/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
