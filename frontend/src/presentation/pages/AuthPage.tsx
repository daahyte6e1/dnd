import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../infrastructure/store/authStore';

const AuthPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout
  } = useAuth();
  
  const [username, setUsername] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  // Убираем автоматическое перенаправление - пусть пользователь сам выбирает
  // useEffect(() => {
  //   if (!isAuthenticated && !isLoading) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, isLoading, navigate]);

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Пожалуйста, введите логин');
      return;
    }

    setIsLoggingIn(true);
    setError('');

    try {
      await login(username);
      if (user) {
        console.log('Новый пользователь автоматически зарегистрирован');
      }
    } catch (err) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setIsLoggingIn(false);
    }
  };



  const handleLogout = () => {
    logout();
    setUsername('');
    setError('');
  };



  // Показываем загрузку пока проверяется авторизация
  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          mt: 8, 
          mb: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Проверка авторизации...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Вход в игру
          </Typography>
          
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Авторизация
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={isLoggingIn}
              sx={{ mt: 2 }}
            >
              {isLoggingIn ? 'Вход...' : 'Войти'}
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Добро пожаловать!
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Пользователь: {user?.username}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/profile')}
            >
              Управление персонажами
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage; 