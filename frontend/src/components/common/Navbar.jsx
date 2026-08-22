import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import Badge from './Badge';
import ThemeToggle from './ThemeToggle';
import {
  Bell,
  LogOut,
  User,
  Menu,
  ChevronDown,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';
import { getMockStore } from '../../services/api';
import { formatRelative } from '../../utils/formatDate';

const Navbar = ({ pageTitle = 'Dashboard', onToggleMobileNav }) => {
  const { currentUser, role, employeeId, logout, isHR } = useAuth();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const profileMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Load user notifications
  useEffect(() => {
    try {
      const store = getMockStore();
      const userNotifs = store.notifications.filter(
        (n) => !n.userId || n.userId === employeeId || (isHR && n.userId === 'HR-001')
      );
      setNotifications(userNotifs);
    } catch {
      // ignore
    }
  }, [employeeId, isHR]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    const store = getMockStore();
    const updated = store.notifications.map((n) => ({ ...n, isRead: true }));
    store.save('NOTIFICATIONS', updated);
    setNotifications(
      updated.filter((n) => !n.userId || n.userId === employeeId || (isHR && n.userId === 'HR-001'))
    );
  };

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileLink = isHR ? '/admin/profile' : '/employee/profile';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-slate-200 dark:border-dark-700/60 transition-colors">
      {/* Left section: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{pageTitle}</span>
          </h1>
        </div>
      </div>

      {/* Right section: Theme Toggle / Notification / Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Switcher */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/80 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-magenta ring-2 ring-white dark:ring-dark-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-dark-700/60 bg-slate-50 dark:bg-dark-800/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="cyan" size="sm">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-brand-purple hover:text-brand-magenta dark:text-brand-purple-light dark:hover:text-white transition-colors font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-dark-750/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    You're all caught up! No notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 transition-colors hover:bg-slate-50 dark:hover:bg-dark-800/60 ${
                        !notif.isRead ? 'bg-purple-50/50 dark:bg-brand-purple/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            !notif.isRead ? 'bg-brand-purple' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                            {formatRelative(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-dark-700/60 focus:outline-none"
            aria-label="User profile menu"
          >
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name || 'User'}
              size="sm"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] text-brand-purple dark:text-brand-cyan-light font-semibold tracking-wide">
                {role || 'Employee'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
              {/* Header inside menu */}
              <div className="p-4 border-b border-slate-200 dark:border-dark-700/60 bg-slate-50 dark:bg-dark-800/40">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={currentUser?.avatar}
                    name={currentUser?.name || 'User'}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge variant={isHR ? 'purple' : 'cyan'} size="sm">
                        {role}
                      </Badge>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {employeeId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="p-2 space-y-1">
                <Link
                  to={profileLink}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-purple dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-dark-750 transition-colors"
                >
                  <User className="w-4 h-4 text-brand-purple" />
                  <span>{isHR ? 'Admin Profile' : 'My Profile'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
