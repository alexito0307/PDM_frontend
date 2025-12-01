import { create } from "zustand";

type AuthStore = {
  username: string | null;
  avatarUrl: string | null;
  token: string | null;
  nombre: string | null;
  biografia: string | null;
  setAuth: (data: { username: string; avatarUrl: string | null; token: string; nombre: string; biografia: string }) => void;
  setUserInfo: (data: {nombre: string; biografia: string; avatarUrl: string }) => void
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  username: null,
  avatarUrl: null,
  token: null,
  nombre: null,
  biografia: null,

  setAuth: ({ username, avatarUrl, token, nombre, biografia }) =>
    set({
      username,
      avatarUrl,
      token,
      nombre, 
      biografia,
    }),

  setUserInfo:({nombre, biografia, avatarUrl}) =>
    set({
      nombre, biografia, avatarUrl
    }),

  clearAuth: () =>
    set({
      username: null,
      avatarUrl: null,
      token: null,
      nombre: null,
      biografia: null,
    }),
}));
