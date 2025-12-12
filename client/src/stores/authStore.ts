import { create } from "zustand";
import { jwtDecode } from "jwt-decode";   // ✅ FIXED

const TOKEN_KEY = "productivity_jwt";

type User = {
  id?: string;
  email?: string;
  [key: string]: any;
} | null;

type AuthState = {
  token: string | null;
  user: User;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,

  user: (() => {
    try {
      const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      return t ? (jwtDecode(t) as User) : null;
    } catch {
      return null;
    }
  })(),

  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      try {
        const decoded = jwtDecode(token) as User;
        set({ token, user: decoded });
      } catch {
        set({ token, user: null });
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      set({ token: null, user: null });
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null });
  },
}));
