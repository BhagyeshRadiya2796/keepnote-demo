import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

// Define a type for the slice state
interface ThemeState {
  mode: 'light' | 'dark';
}

// Get initial theme from cookies or default to light
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = Cookies.get('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as 'light' | 'dark';
    }
    
    // Check user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

// Define the initial state
const initialState: ThemeState = {
  mode: getInitialTheme(),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      // Save to cookies
      if (typeof window !== 'undefined') {
        Cookies.set('theme', state.mode, { expires: 365 }); // Set cookie to expire in 1 year
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      // Save to cookies
      if (typeof window !== 'undefined') {
        Cookies.set('theme', state.mode, { expires: 365 }); // Set cookie to expire in 1 year
      }
    },
  },
});

// Export actions
export const { toggleTheme, setTheme } = themeSlice.actions;

// Export selectors
export const selectThemeMode = (state: RootState) => state.theme.mode;

export default themeSlice.reducer;
