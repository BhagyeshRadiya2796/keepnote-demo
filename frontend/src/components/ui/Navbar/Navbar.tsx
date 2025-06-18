import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Tooltip } from '@mui/material';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import { selectThemeMode, toggleTheme } from '../../../features/theme/state/themeSlice';
import { useLogout } from '../../../features/auth/api/useAuth';
import Cookies from 'js-cookie';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteIcon from '@mui/icons-material/Note';

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = 'KeepNotes' }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(selectThemeMode);
  
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  
  // Get logout function from the useLogout hook
  const logout = useLogout();
  
  const handleLogout = async () => {
    try {
      // Execute the logout function from the hook (now async)
      await logout();
      // Navigate to login page after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Navigate to login page even if there's an error
      navigate('/login');
    }
  };

  // Active link style for NavLink
  const getLinkStyles = ({ isActive }: { isActive: boolean }) => {
    return isActive
      ? "text-primary-main dark:text-primary-light font-medium"
      : "text-gray-600 dark:text-gray-300 hover:text-primary-main dark:hover:text-primary-light";
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
      sx={{ backgroundColor: 'background.paper' }}
    >
      <Toolbar className="container mx-auto px-4">
        <Typography 
          variant="h6" 
          component="div" 
          className="font-bold text-gray-800 dark:text-white mr-8"
        >
          {title}
        </Typography>
        
        {/* Navigation Links */}
        <Box className="hidden md:flex flex-grow items-center space-x-6">
          <NavLink to="/" className={getLinkStyles} end>
            <Box className="flex items-center">
              <DashboardIcon className="mr-1" fontSize="small" />
              <span>Dashboard</span>
            </Box>
          </NavLink>
        </Box>
        
        <Box className="flex items-center">
          <Tooltip title={themeMode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton 
              onClick={handleThemeToggle} 
              color="inherit"
              className="text-gray-700 dark:text-gray-200"
              aria-label="Toggle theme"
            >
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
          
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            className="ml-2 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
