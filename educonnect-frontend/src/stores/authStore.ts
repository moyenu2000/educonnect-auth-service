import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, UserRole } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<boolean>;
  verifyTwoFactor: (tempToken: string, code: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { fullName?: string; bio?: string; avatarUrl?: string }) => Promise<boolean>;
  clearAuth: () => void;
  
  // Utility functions
  hasRole: (role: UserRole) => boolean;
  isAdmin: () => boolean;
  isQuestionSetter: () => boolean;
  isStudent: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        error: null 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: async (usernameOrEmail, password) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login({ usernameOrEmail, password });
          
          if (response.requiresTwoFactor) {
            set({ isLoading: false });
            return false; // Need 2FA verification
          }
          
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return true;
        } catch (error: unknown) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            isLoading: false 
          });
          return false;
        }
      },

      logout: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
          authService.clearAuth();
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          await authService.register(data);
          
          set({ isLoading: false });
          return true;
        } catch (error: unknown) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            isLoading: false 
          });
          return false;
        }
      },

      verifyTwoFactor: async (tempToken, code) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.verifyTwoFactor({ tempToken, code });
          
          set({ 
            user: response.user, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return true;
        } catch (error: unknown) {
          set({ 
            error: error.response?.data?.message || '2FA verification failed', 
            isLoading: false 
          });
          return false;
        }
      },

      refreshUser: async () => {
        try {
          if (authService.isAuthenticated()) {
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true });
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
          get().clearAuth();
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.updateProfile(data);
          
          if (response.data) {
            set({ 
              user: response.data, 
              isLoading: false 
            });
            return true;
          }
          
          set({ isLoading: false });
          return false;
        } catch (error: unknown) {
          set({ 
            error: error.response?.data?.message || 'Profile update failed', 
            isLoading: false 
          });
          return false;
        }
      },

      clearAuth: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
        authService.clearAuth();
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.role === role;
      },

      isAdmin: () => get().hasRole(UserRole.ADMIN),

      isQuestionSetter: () => {
        const { hasRole } = get();
        return hasRole(UserRole.QUESTION_SETTER) || hasRole(UserRole.ADMIN);
      },

      isStudent: () => get().hasRole(UserRole.STUDENT),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);