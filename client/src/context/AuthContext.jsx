import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signupUser = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.signup(name, email, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const updateCachedUserRole = (newRole) => {
    if (user) {
      const updated = { ...user, targetRole: newRole };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        signup: signupUser,
        logout: logoutUser,
        updateCachedUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
