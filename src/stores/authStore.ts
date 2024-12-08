import { create } from 'zustand';
import { AuthState, User } from '../types/auth';

// This is a mock implementation. In a real app, you'd integrate with a backend
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock login - replace with real API call
    const mockUser: User = {
      id: '1',
      username: email.split('@')[0],
      email,
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  signup: async (username: string, email: string, password: string) => {
    // Mock signup - replace with real API call
    const mockUser: User = {
      id: '1',
      username,
      email,
    };
    set({ user: mockUser, isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));