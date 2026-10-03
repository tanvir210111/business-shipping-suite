import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('bss_token');
    const cachedUser = localStorage.getItem('bss_user');

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem('bss_user');
      }
    }

    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem('bss_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('bss_token');
          localStorage.removeItem('bss_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const res = await api.post('/auth/login', { email, password, rememberMe });
    const { token, user: loggedInUser } = res.data;
    localStorage.setItem('bss_token', token);
    localStorage.setItem('bss_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem('bss_token');
      localStorage.removeItem('bss_user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
