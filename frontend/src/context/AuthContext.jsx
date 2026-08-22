import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dayflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem('dayflow_user');
        const savedToken = localStorage.getItem('dayflow_token');
        if (savedUser && savedToken) {
          setCurrentUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (err) {
        console.error('Error initializing auth state:', err);
        localStorage.removeItem('dayflow_token');
        localStorage.removeItem('dayflow_user');
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setCurrentUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      return await authService.register(formData);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async ({ email, code }) => {
    return await authService.verifyEmail({ email, code });
  };

  const resendVerification = async ({ email }) => {
    return await authService.resendVerification({ email });
  };

  const forgotPassword = async ({ email }) => {
    return await authService.forgotPassword({ email });
  };

  const resetPassword = async ({ email, token, newPassword }) => {
    return await authService.resetPassword({ email, token, newPassword });
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setToken(null);
  };

  const updateUserSession = (updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('dayflow_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isHR = currentUser?.role === 'HR' || currentUser?.role === 'Admin';
  const isEmployee = currentUser?.role === 'Employee';

  const value = {
    currentUser,
    role: currentUser?.role || null,
    employeeId: currentUser?.employeeId || currentUser?.id || null,
    isAuthenticated: Boolean(token && currentUser),
    isHR,
    isEmployee,
    loading,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    logout,
    updateUserSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
