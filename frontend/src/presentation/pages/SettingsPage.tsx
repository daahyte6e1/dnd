import React, { useState, useEffect } from 'react';
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
  Alert,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
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
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  VolumeUp as VolumeIcon,
  Brightness4 as DarkModeIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    volume: 70,
    darkMode: false,
    language: 'ru',
    autoSave: true,
    showTutorial: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Состояние для диалогов
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Здесь можно добавить API вызов для сохранения настроек
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API вызова
      
      setSuccess('Настройки успешно сохранены');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Ошибка сохранения настроек');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: true,
      sound: true,
      volume: 70,
      darkMode: false,
      language: 'ru',
      autoSave: true,
      showTutorial: false
    };
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    setShowResetDialog(false);
    setSuccess('Настройки сброшены к значениям по умолчанию');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Здесь можно добавить API вызов для удаления аккаунта
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API вызова
      
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('appSettings');
      
      navigate('/auth');
    } catch (err) {
      setError('Ошибка удаления аккаунта');
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const settingsSections = [
    {
      title: 'Уведомления',
      icon: <NotificationsIcon />,
      settings: [
        {
          key: 'notifications',
          label: 'Включить уведомления',
          type: 'switch',
          value: settings.notifications
        },
        {
          key: 'sound',
          label: 'Звуковые уведомления',
          type: 'switch',
          value: settings.sound
        }
      ]
    },
    {
      title: 'Аудио',
      icon: <VolumeIcon />,
      settings: [
        {
          key: 'volume',
          label: 'Громкость',
          type: 'slider',
          value: settings.volume,
          min: 0,
          max: 100
        }
      ]
    },
    {
      title: 'Внешний вид',
      icon: <DarkModeIcon />,
      settings: [
        {
          key: 'darkMode',
          label: 'Темная тема',
          type: 'switch',
          value: settings.darkMode
        }
      ]
    },
    {
      title: 'Язык',
      icon: <LanguageIcon />,
      settings: [
        {
          key: 'language',
          label: 'Язык интерфейса',
          type: 'select',
          value: settings.language,
          options: [
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' }
          ]
        }
      ]
    },
    {
      title: 'Безопасность',
      icon: <SecurityIcon />,
      settings: [
        {
          key: 'autoSave',
          label: 'Автосохранение',
          type: 'switch',
          value: settings.autoSave
        },
        {
          key: 'showTutorial',
          label: 'Показывать подсказки',
          type: 'switch',
          value: settings.showTutorial
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Настройки
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          {settingsSections.map((section, sectionIndex) => (
            <Grid item xs={12} md={6} key={sectionIndex}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  {section.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {section.title}
                  </Typography>
                </Box>
                
                <List>
                  {section.settings.map((setting, settingIndex) => (
                    <ListItem key={settingIndex} divider>
                      <ListItemText
                        primary={setting.label}
                        secondary={setting.type === 'slider' ? `${setting.value}%` : undefined}
                      />
                      <ListItemSecondaryAction>
                        {setting.type === 'switch' && (
                          <Switch
                            checked={setting.value}
                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                          />
                        )}
                        {setting.type === 'slider' && (
                          <Slider
                            value={setting.value}
                            onChange={(e, value) => handleSettingChange(setting.key, value)}
                            min={setting.min}
                            max={setting.max}
                            sx={{ width: 100 }}
                          />
                        )}
                        {setting.type === 'select' && (
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={setting.value}
                              onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                              displayEmpty
                            >
                              {setting.options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить настройки'}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => setShowResetDialog(true)}
          >
            Сбросить настройки
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Удалить аккаунт
          </Button>
        </Box>
        
        {/* Диалог сброса настроек */}
        <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
          <DialogTitle>Сбросить настройки</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowResetDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleResetSettings} color="warning">
              Сбросить
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Диалог удаления аккаунта */}
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Удалить аккаунт</DialogTitle>
          <DialogContent>
            <Typography color="error" sx={{ mb: 2 }}>
              Внимание! Это действие нельзя отменить.
            </Typography>
            <Typography>
              Все ваши данные, включая персонажей и историю игр, будут безвозвратно удалены.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)}>
              Отмена
            </Button>
            <Button 
              onClick={handleDeleteAccount} 
              color="error"
              disabled={isLoading}
            >
              {isLoading ? 'Удаление...' : 'Удалить аккаунт'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default SettingsPage; 