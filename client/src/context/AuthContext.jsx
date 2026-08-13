import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('travelguide_token') || null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user on mount if token exists
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('travelguide_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem('travelguide_token');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to load user:', error.message);
      localStorage.removeItem('travelguide_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('travelguide_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  // Google Login handler
  const googleLogin = async (tokenData, role = 'traveler') => {
    try {
      const payload = typeof tokenData === 'string'
        ? { credential: tokenData, role }
        : { ...tokenData, role };

      const data = await authService.googleAuth(payload);
      if (data.success && data.token) {
        localStorage.setItem('travelguide_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome, ${data.user.name}!`, 'success');
        return {
          success: true,
          user: data.user,
          isNewGuide: data.isNewGuide,
        };
      }
      return { success: false, message: 'Google authentication failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Unable to sign in with Google. Please try again.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (data.success && data.token) {
        localStorage.setItem('travelguide_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast('Registration successful! Welcome to TravelGuide.', 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      showToast(error.message, 'error');
      return { success: false, message: error.message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('travelguide_token');
    setUser(null);
    setToken(null);
    showToast('You have been logged out successfully.', 'info');
  };

  // Update local user state
  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
        isGuide: user?.role === 'guide',
        isTraveler: user?.role === 'traveler',
        login,
        googleLogin,
        register,
        logout,
        updateUserState,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
