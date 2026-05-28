import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  setUser: (user: any | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  setLoading: (isLoading) => set({ isLoading }),
  setUser: (user) => set({ user, isLoading: false }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null, isLoading: false }),
}));
