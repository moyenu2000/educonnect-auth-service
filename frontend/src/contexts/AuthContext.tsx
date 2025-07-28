import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message: string; requiresTwoFactor?: boolean; tempToken?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = async () => {
    if (authService.isLoggedIn()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        // Store user data in localStorage for messaging components
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        // Token is invalid or expired, clear it
        authService.clearAuth();
        setUser(null);
        localStorage.removeItem('user');
        console.log('Auth token invalid, cleared from storage');
      }
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const response = await authService.login({ usernameOrEmail, password });
    
    if (response.success && response.user && !response.requiresTwoFactor) {
      setUser(response.user);
      // Store user data in localStorage for messaging components
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return {
      success: response.success,
      message: response.message,
      requiresTwoFactor: response.requiresTwoFactor,
      tempToken: response.tempToken
    };
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    // Update user data in localStorage for messaging components
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isLoggedIn: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.displayName = 'AuthProvider';