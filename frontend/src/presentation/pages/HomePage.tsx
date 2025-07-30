import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Divider
} from '@mui/material';
import { useWebSocketStore } from '../../infrastructure/store/websocketStore';
import apiClient from '../../infrastructure/api/apiClient';

const HomePage = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('Тест123');
  const [playerName, setPlayerName] = useState('Тест');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  
  const { connect, isConnected } = useWebSocketStore();

  const handleCreateGame = async () => {
    if (!gameName.trim() || !playerName.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Подключаемся к WebSocket
      await connect();
      
      // Создаем игру через API клиент
      const gameData = await apiClient.createGame({
        name: gameName,
        playerName: playerName,
        isHost: true
      });

      navigate(`/game/${gameName}`);
    } catch (err) {
      setError(err.message || 'Ошибка создания игры');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGame = async () => {
    if (!gameName.trim() || !playerName.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsJoining(true);
    setError('');

    try {
      // Подключаемся к WebSocket
      await connect();
      
      // Подключаемся к игре через API клиент
      await apiClient.joinGame(gameName, {
        playerName: playerName
      });

      navigate(`/game/${gameName}`);
    } catch (err) {
      setError(err.message || 'Ошибка подключения к игре');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Dragon & Dungeons
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Создайте или присоединитесь к игре
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Создать новую игру
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Создайте новое лобби и станьте мастером игры
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Имя игры"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Введите уникальное имя игры"
                  />
                  
                  <TextField
                    fullWidth
                    label="Ваше имя"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Введите имя персонажа"
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleCreateGame}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Создание...' : 'Создать игру'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Присоединиться к игре
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Присоединитесь к существующему лобби
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Имя игры"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Введите имя игры для подключения"
                  />
                  
                  <TextField
                    fullWidth
                    label="Ваше имя"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Введите имя персонажа"
                  />
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleJoinGame}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Подключение...' : 'Присоединиться'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Возможности игры
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  🎲 Система броска кубиков
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  🌍 Автогенерация мира
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  👥 Многопользовательская игра
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  ⚔️ Система боя и взаимодействий
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage; 