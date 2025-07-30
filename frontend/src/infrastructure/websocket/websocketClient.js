import { io } from 'socket.io-client';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.eventHandlers = new Map();
  }

  connect(url = import.meta.env.VITE_WS_URL || 'http://localhost:3000') {
    try {
      this.socket = io(url, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000
      });
      
      this.socket.on('connect', () => {
        console.log('Socket.io connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.io disconnected');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error);
      });

      // Обработка стандартных событий игры
      this.socket.on('player-joined', (data) => {
        this.triggerEvent('player-joined', data);
      });

      this.socket.on('player-left', (data) => {
        this.triggerEvent('player-left', data);
      });

      this.socket.on('game-state-updated', (data) => {
        this.triggerEvent('game-state-updated', data);
      });

    } catch (error) {
      console.error('Error creating Socket.io connection:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Присоединение к игре
  joinGame(gameId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-game', gameId);
    } else {
      console.warn('Socket.io is not connected');
    }
  }

  // Покидание игры
  leaveGame(gameId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-game', gameId);
    } else {
      console.warn('Socket.io is not connected');
    }
  }

  // Отправка обновления состояния игры
  updateGameState(gameId, gameState) {
    if (this.socket && this.isConnected) {
      this.socket.emit('game-update', { gameId, gameState });
    } else {
      console.warn('Socket.io is not connected');
    }
  }

  // Регистрация обработчиков событий
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  // Удаление обработчиков событий
  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Вызов обработчиков событий
  triggerEvent(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  handleMessage(data) {
    // Override this method in subclasses or provide a callback
    console.log('Received message:', data);
  }
}

export default WebSocketClient; 