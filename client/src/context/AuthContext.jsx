import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, handleAPIError } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (token && role) {
      setUser({
        name: userName,
        email: userEmail,
        role
      });
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);

      setUser({
        name: data.name,
        email: data.email,
        role: data.role
      });

      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, error: handleAPIError(error) };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      return { success: true, message: data.msg };
    } catch (error) {
      return { success: false, error: handleAPIError(error) };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    user,
    loading,
    language,
    login,
    register,
    logout,
    changeLanguage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
