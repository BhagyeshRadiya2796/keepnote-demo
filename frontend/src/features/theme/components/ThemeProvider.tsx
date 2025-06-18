import React, { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAppSelector } from '../../../app/store';
import { selectThemeMode } from '../state/themeSlice';
import lightTheme from '../../../styles/theme';
import darkTheme from '../../../styles/darkTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeMode = useAppSelector(selectThemeMode);
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  
  // Apply theme class to body for Tailwind dark mode
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
