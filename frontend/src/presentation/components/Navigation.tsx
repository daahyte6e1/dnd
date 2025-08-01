import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Casino as CasinoIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../infrastructure/store/authStore';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Главная';
      case '/auth':
        return 'Авторизация';
      case '/lobby':
        return 'Лобби игр';
      case '/profile':
        return 'Профиль';
      default:
        if (location.pathname.startsWith('/game/')) {
          return 'Игра';
        }
        return 'D&D';
    }
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          D&D
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Главная
          </Button>

          <Button
            color="inherit"
            startIcon={<GroupIcon />}
            onClick={() => navigate('/lobby')}
            sx={{ 
              backgroundColor: isActive('/lobby') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Лобби
          </Button>

          <Button
            color="inherit"
            startIcon={<HelpIcon />}
            onClick={() => navigate('/help')}
            sx={{ 
              backgroundColor: isActive('/help') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Помощь
          </Button>

          {isAuthenticated && user ? (
            <>
              <Chip
                label={user.username}
                color="secondary"
                size="small"
                sx={{ mr: 1 }}
              />
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ 
                  backgroundColor: isActive('/profile') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Профиль
                </MenuItem>
                <MenuItem onClick={() => { navigate('/auth'); handleMenuClose(); }}>
                  <CasinoIcon sx={{ mr: 1 }} />
                  Управление персонажами
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  Настройки
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/auth')}
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 