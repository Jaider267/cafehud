import { create } from 'zustand';
import { authApi } from '../api/api';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('cafe_user');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error('Error al parsear cafe_user:', e);
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  initializing: true,
  loading: false,
  error: null,

  initialize: async () => {
    set({ initializing: true, error: null });
    try {
      const response = await authApi.me();
      const user = response.data?.data?.user || response.data?.user || response.user || response;
      localStorage.setItem('cafe_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, initializing: false, loading: false });
    } catch (err) {
      localStorage.removeItem('cafe_user');
      set({ user: null, isAuthenticated: false, initializing: false, loading: false });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const user = response.data?.data?.user || response.data?.user || response.user || response;
      localStorage.setItem('cafe_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false, error: null });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales inválidas';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      const user = response.data?.data?.user || response.data?.user || response.user || response;
      localStorage.setItem('cafe_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, loading: false, error: null });
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al registrarse';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Error cerrando sesión:', err);
    }
    localStorage.removeItem('cafe_user');
    set({ user: null, isAuthenticated: false, loading: false, error: null });
  },

  isAdmin: () => {
    const currentUser = get().user;
    return currentUser?.role === 'admin';
  }
}));
