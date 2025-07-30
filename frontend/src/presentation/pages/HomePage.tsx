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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import { useWebSocketStore } from '../../infrastructure/store/websocketStore';
import apiClient from '../../infrastructure/api/apiClient';

interface Character {
  id: string;
  name: string;
  characterClass: string;
  level: number;
  hp: number;
  maxHp: number;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('Тест123');
  const [playerName, setPlayerName] = useState('Тест');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  
  // Состояние для авторизации
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Состояние для создания персонажа
  const [isCreatingCharacter, setIsCreatingCharacter] = useState(false);
  const [showCreateCharacterDialog, setShowCreateCharacterDialog] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterClass, setNewCharacterClass] = useState('fighter');
  
  const { connect, isConnected } = useWebSocketStore() as any;

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Пожалуйста, введите логин');
      return;
    }

    setIsLoggingIn(true);
    setError('');

    try {
      const response = await apiClient.loginByUsername(username);
      setUserId(response.user.id);
      setIsAuthenticated(true);
      
      // Загружаем персонажей пользователя
      const charactersResponse = await apiClient.getUserCharacters(response.user.id);
      setCharacters(charactersResponse.characters || []);
    } catch (err) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateCharacter = async () => {
    if (!newCharacterName.trim() || !newCharacterClass) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsCreatingCharacter(true);
    setError('');

    try {
      const characterData = {
        name: newCharacterName,
        characterClass: newCharacterClass
      };
      
      const response = await apiClient.createClassicCharacter(userId, characterData);
      
      // Обновляем список персонажей
      const charactersResponse = await apiClient.getUserCharacters(userId);
      setCharacters(charactersResponse.characters || []);
      
      // Закрываем диалог и очищаем поля
      setShowCreateCharacterDialog(false);
      setNewCharacterName('');
      setNewCharacterClass('fighter');
    } catch (err) {
      setError(err.message || 'Ошибка создания персонажа');
    } finally {
      setIsCreatingCharacter(false);
    }
  };

  const handleLogout = () => {
    setUserId('');
    setCharacters([]);
    setIsAuthenticated(false);
    setUsername('');
  };

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
          
          {/* Форма авторизации */}
          {!isAuthenticated ? (
            <Card sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Авторизация
                </Typography>
                <TextField
                  fullWidth
                  label="Логин"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                  placeholder="Введите ваш логин"
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Вход...' : 'Войти'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Добро пожаловать, {username}!
                  </Typography>
                  <Button variant="outlined" onClick={handleLogout}>
                    Выйти
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Ваши персонажи ({characters.length})
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowCreateCharacterDialog(true)}
                  >
                    Создать персонажа
                  </Button>
                </Box>
                
                {characters.length > 0 ? (
                  <List>
                    {characters.map((character) => (
                      <ListItem key={character.id}>
                        <PersonIcon sx={{ mr: 2 }} />
                        <ListItemText
                          primary={character.name}
                          secondary={`Уровень ${character.level} ${character.characterClass}`}
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="body2" color="text.secondary">
                            HP: {character.hp}/{character.maxHp}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    У вас пока нет персонажей. Создайте первого!
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
          
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
      
      {/* Диалог создания персонажа */}
      <Dialog open={showCreateCharacterDialog} onClose={() => setShowCreateCharacterDialog(false)}>
        <DialogTitle>Создать нового персонажа</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Имя персонажа"
            value={newCharacterName}
            onChange={(e) => setNewCharacterName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            placeholder="Введите имя персонажа"
          />
          <FormControl fullWidth>
            <InputLabel>Класс персонажа</InputLabel>
            <Select
              value={newCharacterClass}
              onChange={(e) => setNewCharacterClass(e.target.value)}
              label="Класс персонажа"
            >
              <MenuItem value="fighter">Воин</MenuItem>
              <MenuItem value="wizard">Волшебник</MenuItem>
              <MenuItem value="rogue">Плут</MenuItem>
              <MenuItem value="cleric">Жрец</MenuItem>
              <MenuItem value="ranger">Следопыт</MenuItem>
              <MenuItem value="barbarian">Варвар</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateCharacterDialog(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleCreateCharacter}
            variant="contained"
            disabled={isCreatingCharacter}
          >
            {isCreatingCharacter ? 'Создание...' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage; 