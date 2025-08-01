import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Alert,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

import { 
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Star as StarIcon
} from '@mui/icons-material';
import useApiStore from '../../infrastructure/store/apiStore';
import CharacterCreationWizard from '../components/CharacterCreationWizard';
import CharacterList from '../components/CharacterList';

interface Character {
  id: string;
  name: string;
  characterClass: string;
  level: number;
  hp: number;
  maxHp: number;
  experience: number;
  createdAt: string;
}

interface GameHistory {
  id: string;
  gameName: string;
  characterName: string;
  status: string;
  playedAt: string;
  duration: number;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Состояние для редактирования профиля
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  
  // Получаем методы из API store
  const { getProfile, updateUser } = useApiStore();

  useEffect(() => {
    loadProfile();
  }, [getProfile]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);

      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/auth');
        return
      }
        // Проверяем валидность токена, получая профиль пользователя
      const profile = await getProfile();
      console.log(profile)

      setUser(profile.user);
      setEditUsername(profile.user.username);



      // Загружаем историю игр (заглушка)
      setGameHistory([
        {
          id: '1',
          gameName: 'Приключение в подземелье',
          characterName: 'Арагорн',
          status: 'completed',
          playedAt: '2024-01-15T10:30:00Z',
          duration: 120
        },
        {
          id: '2',
          gameName: 'Охота на дракона',
          characterName: 'Гэндальф',
          status: 'in_progress',
          playedAt: '2024-01-10T14:20:00Z',
          duration: 90
        }
      ]);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    if (!editUsername.trim()) {
      setError('Пожалуйста, введите имя пользователя');
      return;
    }

    setIsEditing(true);
    setError('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('ID пользователя не найден');
        return;
      }
      const response = await updateUser(userId, {
        username: editUsername
      });
      
      setUser(response.user);
      setShowEditDialog(false);
    } catch (err) {
      setError(err.message || 'Ошибка обновления профиля');
    } finally {
      setIsEditing(false);
    }
  };



  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    navigate('/auth');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="h5">Загрузка профиля...</Typography>
        </Box>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Профиль пользователя
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Информация о пользователе */}
          <Box sx={{ flex: { xs: '1', md: '0 0 33%' } }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                  <PersonIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5">{user?.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Пользователь с {new Date(user?.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Статистика
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Персонажей создано" 
                      secondary="Загружается..." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Игр сыграно" 
                      secondary={gameHistory.filter(g => g.status === 'completed').length} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Время в игре" 
                      secondary={`${gameHistory.reduce((sum, g) => sum + g.duration, 0)} мин`} 
                    />
                  </ListItem>
                </List>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setShowEditDialog(true)}
                  fullWidth
                >
                  Редактировать
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  fullWidth
                >
                  Выйти
                </Button>
              </Box>
            </Paper>
          </Box>
          
          {/* Персонажи */}
          <Box sx={{ flex: { xs: '1', md: '0 0 67%' } }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <CharacterList 
                userId={user.id}
                onCharacterSelect={(character) => {
                  // Обработка выбора персонажа
                  console.log('Выбран персонаж:', character);
                }}
              />
            </Paper>
          </Box>
        </Box>
        
        {/* История игр */}
        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            История игр
          </Typography>
          
          {gameHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                История игр пуста
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Начните играть, чтобы увидеть историю
              </Typography>
            </Box>
          ) : (
            <List>
              {gameHistory.map((game) => (
                <ListItem key={game.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: game.status === 'completed' ? 'success.main' : 'warning.main' }}>
                      <StarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={game.gameName}
                    secondary={`${game.characterName} • ${new Date(game.playedAt).toLocaleDateString()} • ${game.duration} мин`}
                  />
                  <Chip 
                    label={game.status === 'completed' ? 'Завершена' : 'В процессе'}
                    color={game.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
        
        {/* Диалог редактирования профиля */}
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Имя пользователя"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              margin="normal"
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowEditDialog(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleEditProfile} 
              variant="contained"
              disabled={isEditing}
            >
              {isEditing ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogActions>
        </Dialog>
        

      </Box>
    </Container>
  );
};

export default ProfilePage; 