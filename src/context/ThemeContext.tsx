import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface FeebyThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * Theme provider for Feeby components
 * Wrap your app with this provider to enable theme switching
 */
export const FeebyThemeProvider: React.FC<FeebyThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'feeby-theme',
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey) as Theme;
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      }
    }
  }, [storageKey]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme state and controls
 * Returns theme, setTheme, and toggleTheme
 */
export const useFeebyTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return { theme: 'light' as Theme, setTheme: () => {}, toggleTheme: () => {} };
  }
  return context;
};
