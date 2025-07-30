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
      
      // Создаем игру
      const response = await fetch('http://localhost:3000/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: gameName,
          playerName: playerName,
          isHost: true
        }),
      });

      if (response.ok) {
        const gameData = await response.json();
        navigate(`/game/${gameName}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка создания игры');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
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
      
      // Подключаемся к игре
      const response = await fetch(`http://localhost:3000/api/games/${gameName}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: playerName
        }),
      });

      console.log(response, 'xxxxxxxxxxx')
      if (response.ok) {
        navigate(`/game/${gameName}`);
      } else {
        const errorData = await response.json();

        console.log('xxxxxxxxxxx', errorData.message)
        setError(errorData.message || 'Ошибка подключения к игре');
      }
    } catch (err) {
      console.log('xxxxxxxxxxx', err.message)
      setError('Ошибка подключения к серверу');
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