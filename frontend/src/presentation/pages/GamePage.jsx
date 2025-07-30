import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Paper, Typography, Button, TextField, Alert } from '@mui/material';
import useGameStore from '../../infrastructure/store/gameStore';
import { useWebSocketStore } from '../../infrastructure/store/websocketStore';
import GameCanvas from '../components/GameCanvas';
import ChatPanel from '../components/ChatPanel';
import CharacterPanel from '../components/CharacterPanel';
import DicePanel from '../components/DicePanel';
import GameLog from '../components/GameLog';

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    gameState, 
    gameName,
    currentPlayer,
    players,
    worldData,
    gameLogs,
    chatMessages,
    lastDiceRoll,
    setGameState,
    setGameName,
    setCurrentPlayer,
    setPlayers,
    setWorldData,
    addGameLog,
    addChatMessage,
    setLastDiceRoll
  } = useGameStore();
  
  const { 
    socket, 
    connect, 
    disconnect, 
    isConnected, 
    joinGame, 
    sendMessage,
    rollDice,
    moveCharacter,
    interactWithTile
  } = useWebSocketStore();

  const gameCanvasRef = useRef(null);

  // Подключение к игре при загрузке страницы
  useEffect(() => {
    if (gameId && !isConnected) {
      handleJoinGame();
    }

    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [gameId]);

  // Обработка WebSocket событий
  useEffect(() => {
    if (!socket) return;

    // Обработка состояния игры
    socket.on('game_state', (data) => {
      setGameState('playing');
      setWorldData(data.world);
      setPlayers(data.players);
      setCurrentPlayer(data.currentPlayer);
    });

    // Обработка обновления состояния
    socket.on('game_state_updated', (data) => {
      setWorldData(data.world);
      setPlayers(data.players);
    });

    // Обработка чат сообщений
    socket.on('chat_message', (data) => {
      addChatMessage({
        type: 'chat',
        playerName: data.playerName,
        message: data.message
      });
    });

    // Обработка бросков кубиков
    socket.on('dice_rolled', (data) => {
      setLastDiceRoll(data.roll);
      addChatMessage({
        type: 'dice_roll',
        playerName: data.playerName,
        message: data.message
      });
    });

    // Обработка движения персонажа
    socket.on('character_moved', (data) => {
      addGameLog({
        type: 'character_moved',
        playerName: data.playerName,
        position: data.position
      });
    });

    // Обработка подключения игрока
    socket.on('player_joined', (data) => {
      addGameLog({
        type: 'player_joined',
        playerName: data.playerName
      });
    });

    // Обработка отключения игрока
    socket.on('player_disconnected', (data) => {
      addGameLog({
        type: 'player_disconnected',
        playerName: data.playerName
      });
    });

    // Обработка системных сообщений
    socket.on('system_message', (data) => {
      addGameLog({
        type: 'system',
        message: data.message
      });
    });

    // Обработка ошибок
    socket.on('error', (data) => {
      setError(data.message);
    });

    return () => {
      socket.off('game_state');
      socket.off('game_state_updated');
      socket.off('chat_message');
      socket.off('dice_rolled');
      socket.off('character_moved');
      socket.off('player_joined');
      socket.off('player_disconnected');
      socket.off('system_message');
      socket.off('error');
    };
  }, [socket]);

  const handleJoinGame = async () => {
    setIsConnecting(true);
    setError('');

    try {
      console.log('Попытка подключения к WebSocket...');
      await connect();
      
      // Получаем актуальное состояние socket после подключения
      const { socket: currentSocket } = useWebSocketStore.getState();
      console.log('WebSocket подключен, аутентифицируемся...', !!currentSocket);
      
      if (!currentSocket) {
        throw new Error('WebSocket не подключен после попытки подключения');
      }
      
      // Аутентифицируемся с временным userId
      const userId = `user-${Date.now()}`;
      currentSocket.emit('authenticate', { userId });
      
      // Ждем аутентификации
      await new Promise((resolve, reject) => {
        currentSocket.once('authenticated', resolve);
        currentSocket.once('error', reject);
        setTimeout(() => reject(new Error('Timeout аутентификации')), 5000);
      });
      
      console.log('Аутентификация успешна, присоединяемся к игре...');
      await joinGame(gameId);
      console.log('Успешно присоединились к игре');
      setGameName(gameId);
      setGameState('loading');
    } catch (err) {
      console.error('Ошибка подключения к игре:', err.message || err);
      setError('Ошибка подключения к игре: ' + (err.message || err));
      setGameState('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSendMessage = (message) => {
    if (socket && message.trim()) {
      sendMessage(message);
    }
  };

  const handleRollDice = (command) => {
    if (socket) {
      rollDice(command);
    }
  };

  const handleMoveCharacter = (position) => {
    if (socket && currentPlayer) {
      moveCharacter(position);
    }
  };

  const handleInteractWithTile = (x, y, action) => {
    if (socket) {
      interactWithTile(x, y, action);
    }
  };

  const handleTileClick = ({ x, y, tileData }) => {
    // Простое перемещение при клике на тайл
    if (currentPlayer && tileData.passable !== false) {
      handleMoveCharacter({ x, y });
    }
  };

  const handleLeaveGame = () => {
    if (socket) {
      disconnect();
    }
    navigate('/');
  };

  if (gameState === 'error') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Вернуться на главную
        </Button>
      </Box>
    );
  }

  if (gameState === 'loading' || isConnecting) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">
          {isConnecting ? 'Подключение к игре...' : 'Загрузка игры...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок игры */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Игра: {gameName}
        </Typography>
        <Button variant="outlined" onClick={handleLeaveGame}>
          Покинуть игру
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Основной контент игры */}
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Игровое поле */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ height: '100%', p: 1 }}>
            <GameCanvas
              worldData={worldData}
              players={players}
              currentPlayer={currentPlayer}
              onTileClick={handleTileClick}
            />
          </Paper>
        </Grid>

        {/* Боковая панель */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* Панель персонажа */}
            <Grid item xs={12}>
              <CharacterPanel
                character={currentPlayer}
                isCurrentPlayer={true}
              />
            </Grid>

            {/* Панель кубиков */}
            <Grid item xs={12}>
              <DicePanel
                onRollDice={handleRollDice}
                lastRoll={lastDiceRoll}
              />
            </Grid>

            {/* Чат */}
            <Grid item xs={12}>
              <ChatPanel
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onRollDice={handleRollDice}
              />
            </Grid>

            {/* Игровые события */}
            <Grid item xs={12}>
              <GameLog logs={gameLogs} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GamePage; 