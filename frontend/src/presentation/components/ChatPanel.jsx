import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatPanel = ({ messages, onSendMessage, onRollDice }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      // Проверяем, является ли сообщение командой броска кубика
      if (message.startsWith('/roll')) {
        onRollDice(message);
      } else {
        onSendMessage(message);
      }
      setMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (msg) => {
    switch (msg.type) {
      case 'dice_roll':
        return (
          <Box>
            <Typography variant="body2" color="primary">
              {msg.playerName} бросает кубик:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
              {msg.message}
            </Typography>
          </Box>
        );
      case 'system':
        return (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {msg.message}
          </Typography>
        );
      default:
        return (
          <Box>
            <Typography variant="body2" color="primary" component="span">
              {msg.playerName}:
            </Typography>
            <Typography variant="body1" component="span" sx={{ ml: 1 }}>
              {msg.message}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper sx={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Чат</Typography>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        <List dense>
          {messages.map((msg, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText
                primary={formatMessage(msg)}
                secondary={new Date(msg.timestamp).toLocaleTimeString()}
              />
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Введите сообщение или /roll d20 для броска кубика..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={!message.trim()}
          endIcon={<SendIcon />}
        >
          Отправить
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatPanel; 