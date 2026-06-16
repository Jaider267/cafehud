import { create } from 'zustand';

const canUseDOM = () =>
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  typeof localStorage !== 'undefined';

const getPreferredTheme = () => {
  if (!canUseDOM()) {
    return false;
  }

  return localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

const applyThemeClass = (isDark) => {
  if (!canUseDOM()) {
    return;
  }

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create((set) => ({
  isDark: false,
  
  toggleTheme: () => set((state) => {
    const newIsDark = !state.isDark;
    
    if (canUseDOM()) {
      localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    }

    applyThemeClass(newIsDark);
    
    return { isDark: newIsDark };
  }),

  // Inicializador para ejecutar cuando carga la app
  initTheme: () => {
    const isDark = getPreferredTheme();
    applyThemeClass(isDark);
    set({ isDark });
  }
}));
