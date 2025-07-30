import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

const GameLog = ({ logs }) => {
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const formatLog = (log) => {
    switch (log.type) {
      case 'player_joined':
        return (
          <Box>
            <Chip
              label="Присоединился"
              color="success"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              {log.playerName} присоединился к игре
            </Typography>
          </Box>
        );
      
      case 'player_disconnected':
        return (
          <Box>
            <Chip
              label="Покинул"
              color="error"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              {log.playerName} покинул игру
            </Typography>
          </Box>
        );
      
      case 'character_moved':
        return (
          <Box>
            <Chip
              label="Движение"
              color="info"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              {log.playerName} переместился в ({log.position.x}, {log.position.y})
            </Typography>
          </Box>
        );
      
      case 'combat_started':
        return (
          <Box>
            <Chip
              label="Бой"
              color="warning"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              Начался бой с {log.enemyName}
            </Typography>
          </Box>
        );
      
      case 'item_found':
        return (
          <Box>
            <Chip
              label="Находка"
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              {log.playerName} нашел {log.itemName}
            </Typography>
          </Box>
        );
      
      case 'trap_triggered':
        return (
          <Box>
            <Chip
              label="Ловушка"
              color="error"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              {log.playerName} активировал ловушку: {log.trapName}
            </Typography>
          </Box>
        );
      
      case 'quest_completed':
        return (
          <Box>
            <Chip
              label="Квест"
              color="success"
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" component="span">
              {log.playerName} завершил квест: {log.questName}
            </Typography>
          </Box>
        );
      
      default:
        return (
          <Typography variant="body2">
            {log.message}
          </Typography>
        );
    }
  };

  return (
    <Paper sx={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <EventIcon sx={{ mr: 1 }} />
        <Typography variant="h6">
          Игровые события
        </Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <List dense>
          {logs.map((log, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText
                primary={formatLog(log)}
                secondary={new Date(log.timestamp).toLocaleTimeString()}
              />
            </ListItem>
          ))}
        </List>
        <div ref={logsEndRef} />
      </Box>
    </Paper>
  );
};

export default GameLog; 