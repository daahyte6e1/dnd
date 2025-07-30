import { create } from 'zustand';
import { io } from 'socket.io-client';

const useWebSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  // Подключение к WebSocket серверу
  connect: async () => {
    const { socket, isConnected } = get();
    
    if (socket && isConnected) {
      return;
    }

    set({ isConnecting: true, error: null });

    return new Promise((resolve, reject) => {
      try {
        const newSocket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000', {
          transports: ['websocket'],
          autoConnect: true
        });

        newSocket.on('connect', () => {
          set({ 
            socket: newSocket, 
            isConnected: true, 
            isConnecting: false,
            error: null 
          });
          console.log('WebSocket подключен к серверу');
          resolve();
        });

        newSocket.on('disconnect', () => {
          set({ 
            isConnected: false,
            error: 'Соединение потеряно'
          });
          console.log('WebSocket отключен');
        });

        newSocket.on('connect_error', (error) => {
          set({ 
            isConnected: false, 
            isConnecting: false,
            error: 'Ошибка подключения к серверу'
          });
          console.error('WebSocket ошибка подключения:', error);
          reject(new Error('Ошибка подключения к серверу'));
        });

        // Таймаут для предотвращения зависания
        setTimeout(() => {
          if (!get().isConnected) {
            reject(new Error('Timeout подключения к WebSocket'));
          }
        }, 10000);

      } catch (error) {
        set({ 
          isConnected: false, 
          isConnecting: false,
          error: error.message 
        });
        reject(error);
      }
    });
  },

  // Отключение от WebSocket
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null, 
        isConnected: false, 
        isConnecting: false 
      });
    }
  },

  // Присоединение к игре
  joinGame: async (gameName) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    return new Promise((resolve, reject) => {
      socket.emit('join_game', { gameName });
      
      socket.once('game_state', (data) => {
        resolve(data);
      });
      
      socket.once('error', (data) => {
        reject(new Error(data.message));
      });
      
      // Таймаут для предотвращения зависания
      setTimeout(() => {
        reject(new Error('Timeout присоединения к игре'));
      }, 10000);
    });
  },

  // Создание персонажа
  createCharacter: async (characterData) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    return new Promise((resolve, reject) => {
      socket.emit('create_character', { characterData });
      
      socket.once('character_created_success', (data) => {
        resolve(data.character);
      });
      
      socket.once('error', (data) => {
        reject(new Error(data.message));
      });
    });
  },

  // Движение персонажа
  moveCharacter: async (position) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    return new Promise((resolve, reject) => {
      socket.emit('move_character', { position });
      
      socket.once('move_success', (data) => {
        resolve(data.character);
      });
      
      socket.once('error', (data) => {
        reject(new Error(data.message));
      });
    });
  },

  // Бросок кубика
  rollDice: async (command) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    return new Promise((resolve, reject) => {
      socket.emit('roll_dice', { command });
      
      socket.once('roll_success', (data) => {
        resolve(data);
      });
      
      socket.once('error', (data) => {
        reject(new Error(data.message));
      });
    });
  },

  // Взаимодействие с тайлом
  interactWithTile: async (x, y, action) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    return new Promise((resolve, reject) => {
      socket.emit('interact_tile', { x, y, action });
      
      socket.once('interaction_success', (data) => {
        resolve(data);
      });
      
      socket.once('error', (data) => {
        reject(new Error(data.message));
      });
    });
  },

  // Отправка сообщения в чат
  sendMessage: async (message) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    socket.emit('chat_message', { message });
  },

  // Получение информации о тайле
  getTileInfo: async (x, y) => {
    const { socket } = get();
    if (!socket) {
      throw new Error('WebSocket не подключен');
    }

    return new Promise((resolve, reject) => {
      socket.emit('get_tile_info', { x, y });
      
      socket.once('tile_info', (data) => {
        resolve(data.tile);
      });
      
      socket.once('error', (data) => {
        reject(new Error(data.message));
      });
    });
  },

  // Очистка ошибки
  clearError: () => {
    set({ error: null });
  }
}));

export { useWebSocketStore }; 