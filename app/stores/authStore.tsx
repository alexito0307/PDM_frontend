import { create } from "zustand";

type AuthStore = {
  username: string | null;
  avatarUrl: string | null;
  token: string | null;
  setAuth: (data: { username: string; avatarUrl: string | null; token: string }) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  username: null,
  avatarUrl: null,
  token: null,

  setAuth: ({ username, avatarUrl, token }) =>
    set({
      username,
      avatarUrl,
      token,
    }),

  clearAuth: () =>
    set({
      username: null,
      avatarUrl: null,
      token: null,
    }),
}));
