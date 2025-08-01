import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Group as GroupIcon, 
  Person as PersonIcon,
  Casino as CasinoIcon,
  Map as MapIcon
} from '@mui/icons-material';
import { useAuth } from '../../infrastructure/store/authStore';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGoToAuth = () => {
    navigate('/auth');
  };

  const handleGoToLobby = () => {
    navigate('/lobby');
  };

  const features = [
    {
      title: 'Управление персонажами',
      description: 'Создавайте и управляйте своими персонажами',
      icon: <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      action: handleGoToAuth,
      color: 'primary'
    },
    {
      title: 'Лобби игр',
      description: 'Создавайте игры и присоединяйтесь к существующим',
      icon: <GroupIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      action: handleGoToLobby,
      color: 'secondary'
    },
    {
      title: 'Игровой процесс',
      description: 'Погрузитесь в захватывающий мир D&D',
      icon: <PlayIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      action: () => navigate('/lobby'),
      color: 'success'
    },
    {
      title: 'Броски кубиков',
      description: 'Используйте виртуальные кубики для игры',
      icon: <CasinoIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      action: () => navigate('/lobby'),
      color: 'warning'
    },
    {
      title: 'Карта мира',
      description: 'Исследуйте детализированную карту мира',
      icon: <MapIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      action: () => navigate('/lobby'),
      color: 'info'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Добро пожаловать в D&D
        </Typography>
        
        {isAuthenticated && user && (
          <Typography variant="h5" component="h2" gutterBottom align="center" color="primary" sx={{ mb: 2 }}>
            Привет, {user.username}!
          </Typography>
        )}
        
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary" sx={{ mb: 6 }}>
          Онлайн платформа для игры в Dungeons & Dragons
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          Для начала игры необходимо создать персонажа и присоединиться к игре
        </Alert>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {features.map((feature, index) => (
            <Card 
              key={index}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  variant="contained" 
                  color={feature.color as any}
                  onClick={feature.action}
                  startIcon={feature.title === 'Управление персонажами' ? <PersonIcon /> : 
                            feature.title === 'Лобби игр' ? <GroupIcon /> : 
                            feature.title === 'Игровой процесс' ? <PlayIcon /> :
                            feature.title === 'Броски кубиков' ? <CasinoIcon /> :
                            <MapIcon />}
                >
                  {feature.title === 'Управление персонажами' ? 'Создать персонажа' :
                   feature.title === 'Лобби игр' ? 'Перейти в лобби' :
                   feature.title === 'Игровой процесс' ? 'Начать игру' :
                   feature.title === 'Броски кубиков' ? 'Бросить кубики' :
                   'Исследовать карту'}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
        
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Быстрый старт
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoToAuth}
                  startIcon={<PersonIcon />}
                >
                  Управление персонажами
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGoToLobby}
                  startIcon={<GroupIcon />}
                >
                  Перейти в лобби
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGoToAuth}
                  startIcon={<PersonIcon />}
                >
                  Войти в игру
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGoToLobby}
                  startIcon={<GroupIcon />}
                >
                  Перейти в лобби
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage; 