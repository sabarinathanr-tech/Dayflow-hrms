import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Avatar from './Avatar';
import Badge from './Badge';
import {
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  ChevronDown,
  CheckCircle,
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

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/60">
      {/* Left section: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{pageTitle}</span>
          </h1>
        </div>
      </div>

      {/* Right section: Search / Notification / Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors border border-transparent hover:border-dark-700"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-magenta ring-2 ring-dark-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-850 border border-dark-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
              <div className="flex items-center justify-between p-4 border-b border-dark-700/60 bg-dark-800/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge variant="cyan" size="sm">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-brand-purple-light hover:text-white transition-colors font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-dark-750/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 transition-colors hover:bg-dark-800/60 ${
                        !notif.isRead ? 'bg-brand-purple/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            !notif.isRead ? 'bg-brand-purple' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
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
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-dark-800 transition-colors border border-transparent hover:border-dark-700/60 focus:outline-none"
            aria-label="User profile menu"
          >
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name || 'User'}
              size="sm"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-white leading-tight">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] text-brand-cyan-light font-medium tracking-wide">
                {role || 'Employee'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-dark-850 border border-dark-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95">
              {/* Header inside menu */}
              <div className="p-4 border-b border-dark-700/60 bg-dark-800/40">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={currentUser?.avatar}
                    name={currentUser?.name || 'User'}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge variant={isHR ? 'purple' : 'cyan'} size="sm">
                        {role}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {employeeId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="p-2 space-y-1">
                {!isHR && (
                  <Link
                    to="/employee/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-200 hover:text-white rounded-xl hover:bg-dark-750 transition-colors"
                  >
                    <User className="w-4 h-4 text-brand-purple-light" />
                    <span>My Profile</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 rounded-xl hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
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
