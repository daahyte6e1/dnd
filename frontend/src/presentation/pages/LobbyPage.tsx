import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Chip
} from '@mui/material';
import { Add as AddIcon, PlayArrow as PlayIcon, Group as GroupIcon } from '@mui/icons-material';

import useApiStore from '../../infrastructure/store/apiStore';

interface Game {
  id: string;
  name: string;
  status: string;
  players: any[];
  maxPlayers: number;
  createdAt: string;
}

interface Character {
  id: string;
  name: string;
  characterClass: string;
  level: number;
  hp: number;
  maxHp: number;
}

const LobbyPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Состояние для создания игры
  const [showCreateGameDialog, setShowCreateGameDialog] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [gameName, setGameName] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  
  // Состояние для присоединения к игре
  const [showJoinGameDialog, setShowJoinGameDialog] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [joinCharacterId, setJoinCharacterId] = useState('');

  // Получаем методы из API store
  const { getGames, getUserCharacters, createGame, joinGame } = useApiStore();

  useEffect(() => {
    loadData();
  }, [getGames, getUserCharacters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Загружаем список игр
      const gamesResponse = await getGames();
      setGames(gamesResponse.games || []);
      
      // Загружаем персонажей пользователя
      const userId = localStorage.getItem('userId');
      if (userId) {
        const charactersResponse = await getUserCharacters(userId);
        setCharacters(charactersResponse.characters || []);
      }
    } catch (err) {
      setError(err.message || 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async () => {
    if (!gameName.trim() || !selectedCharacter) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsCreatingGame(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      const response = await createGame({
        name: gameName,
        maxPlayers,
        characterId: selectedCharacter
      });
      
      setGames(prev => [...prev, response.game]);
      setShowCreateGameDialog(false);
      setGameName('');
      setSelectedCharacter('');
      setMaxPlayers(4);
      
      // Переходим в созданную игру
      navigate(`/game/${response.game.id}`);
    } catch (err) {
      setError(err.message || 'Ошибка создания игры');
    } finally {
      setIsCreatingGame(false);
    }
  };

  const handleJoinGame = async () => {
    if (!joinGameId.trim() || !joinCharacterId) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsJoiningGame(true);
    setError('');

    try {
      const response = await joinGame(joinGameId, joinCharacterId);
      
      setShowJoinGameDialog(false);
      setJoinGameId('');
      setJoinCharacterId('');
      
      // Переходим в игру
      navigate(`/game/${joinGameId}`);
    } catch (err) {
      setError(err.message || 'Ошибка присоединения к игре');
    } finally {
      setIsJoiningGame(false);
    }
  };

  const handleGoToAuth = () => {
    navigate('/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'playing':
        return 'success';
      case 'finished':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Ожидание';
      case 'playing':
        return 'Игра идет';
      case 'finished':
        return 'Завершена';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="h5">Загрузка...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Лобби игр
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Доступные игры</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={handleGoToAuth}
              sx={{ mr: 2 }}
            >
              Управление персонажами
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateGameDialog(true)}
              disabled={characters.length === 0}
            >
              Создать игру
            </Button>
          </Box>
        </Box>
        
        {characters.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Для участия в играх необходимо создать персонажа. 
            <Button 
              color="inherit" 
              onClick={handleGoToAuth}
              sx={{ ml: 1 }}
            >
              Создать персонажа
            </Button>
          </Alert>
        )}
        
        {games.length === 0 ? (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <GroupIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Нет доступных игр
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Создайте новую игру или присоединитесь к существующей
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateGameDialog(true)}
              disabled={characters.length === 0}
            >
              Создать игру
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {games.map((game) => (
              <Grid item xs={12} md={6} lg={4} key={game.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {game.name}
                      </Typography>
                      <Chip 
                        label={getStatusText(game.status)}
                        color={getStatusColor(game.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Игроков: {game.players.length}/{game.maxPlayers}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Создана: {new Date(game.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setJoinGameId(game.id);
                        setShowJoinGameDialog(true);
                      }}
                      disabled={game.status !== 'waiting' || game.players.length >= game.maxPlayers}
                    >
                      Присоединиться
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Диалог создания игры */}
        <Dialog open={showCreateGameDialog} onClose={() => setShowCreateGameDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Создать новую игру</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название игры"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Персонаж</InputLabel>
              <Select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                label="Персонаж"
              >
                {characters.map((character) => (
                  <MenuItem key={character.id} value={character.id}>
                    {character.name} ({character.characterClass})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Максимум игроков</InputLabel>
              <Select
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value as number)}
                label="Максимум игроков"
              >
                <MenuItem value={2}>2 игрока</MenuItem>
                <MenuItem value={3}>3 игрока</MenuItem>
                <MenuItem value={4}>4 игрока</MenuItem>
                <MenuItem value={5}>5 игроков</MenuItem>
                <MenuItem value={6}>6 игроков</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowCreateGameDialog(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleCreateGame} 
              variant="contained"
              disabled={isCreatingGame}
            >
              {isCreatingGame ? 'Создание...' : 'Создать'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Диалог присоединения к игре */}
        <Dialog open={showJoinGameDialog} onClose={() => setShowJoinGameDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Присоединиться к игре</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="ID игры"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              margin="normal"
              variant="outlined"
              disabled
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Персонаж</InputLabel>
              <Select
                value={joinCharacterId}
                onChange={(e) => setJoinCharacterId(e.target.value)}
                label="Персонаж"
              >
                {characters.map((character) => (
                  <MenuItem key={character.id} value={character.id}>
                    {character.name} ({character.characterClass})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowJoinGameDialog(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleJoinGame} 
              variant="contained"
              disabled={isJoiningGame}
            >
              {isJoiningGame ? 'Присоединение...' : 'Присоединиться'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default LobbyPage; 