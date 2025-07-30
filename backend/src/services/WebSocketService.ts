import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import GameService from './GameService';
import { Player, User, Character } from '../models';

interface GameRoom {
  game: any;
  players: Map<string, PlayerInfo>;
}

interface PlayerInfo {
  socketId: string;
  player: any;
}

interface AuthenticateData {
  userId: string;
  token?: string;
}

interface JoinGameData {
  gameName: string;
}

interface CreateCharacterData {
  gameId: string;
  characterData: any;
}

interface MoveCharacterData {
  gameId: string;
  position: any;
}

interface RollDiceData {
  gameId: string;
  command: string;
}

interface InteractTileData {
  gameId: string;
  x: number;
  y: number;
  action: string;
}

interface ChatMessageData {
  gameId: string;
  message: string;
}

interface GetTileInfoData {
  gameId: string;
  x: number;
  y: number;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

class WebSocketService {
  private io: Server;
  private gameService: GameService;
  private gameRooms: Map<string, GameRoom>;
  private userSockets: Map<string, string>;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
        methods: ["GET", "POST"]
      }
    });
    
    this.gameService = new GameService();
    console.log('🔌 WebSocketService создан с новым GameService');
    this.gameRooms = new Map(); // Кэш комнат игр
    this.userSockets = new Map(); // Связь пользователей с сокетами
    
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`Пользователь подключился: ${socket.id}`);
      console.log(`Origin: ${socket.handshake.headers.origin}`);
      
      // Аутентификация пользователя
      socket.on('authenticate', async (data: AuthenticateData) => {
        await this.handleAuthentication(socket, data);
      });

      // Подключение к игре
      socket.on('join_game', async (data: JoinGameData) => {
        await this.handleJoinGame(socket, data);
      });

      // Создание персонажа
      socket.on('create_character', async (data: CreateCharacterData) => {
        await this.handleCreateCharacter(socket, data);
      });

      // Движение персонажа
      socket.on('move_character', async (data: MoveCharacterData) => {
        await this.handleMoveCharacter(socket, data);
      });

      // Бросок кубика
      socket.on('roll_dice', async (data: RollDiceData) => {
        await this.handleRollDice(socket, data);
      });

      // Взаимодействие с тайлом
      socket.on('interact_tile', async (data: InteractTileData) => {
        await this.handleInteractTile(socket, data);
      });

      // Чат сообщение
      socket.on('chat_message', async (data: ChatMessageData) => {
        await this.handleChatMessage(socket, data);
      });

      // Запрос информации о тайле
      socket.on('get_tile_info', async (data: GetTileInfoData) => {
        await this.handleGetTileInfo(socket, data);
      });

      // Отключение
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  // Обработка аутентификации
  private async handleAuthentication(socket: AuthenticatedSocket, data: AuthenticateData): Promise<void> {
    try {
      const { userId, token } = data;
      
      // В реальном приложении здесь должна быть проверка JWT токена
      // Для MVP используем упрощенную проверку
      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      // Сохраняем связь пользователя с сокетом
      this.userSockets.set(userId, socket.id);
      socket.userId = userId;
      
      socket.emit('authenticated', { userId });
      console.log(`Пользователь ${userId} аутентифицирован`);
    } catch (error) {
      socket.emit('error', { message: 'Ошибка аутентификации' });
    }
  }

  // Обработка подключения к игре
  private async handleJoinGame(socket: AuthenticatedSocket, data: JoinGameData): Promise<void> {
    try {
      const { gameName } = data;
      const userId = socket.userId;

      console.log(`🎮 Попытка присоединения к игре: ${gameName} пользователем: ${userId}`);

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      console.log(`🔍 Вызываем gameService.joinGame для игры: ${gameName}`);
      const result = await this.gameService.joinGame(gameName, { name: `User-${userId}`, isHost: false });
      console.log(`✅ Результат joinGame:`, result);
      
      // Подключаем сокет к комнате игры
      socket.join(result.game.id);
      
      // Сохраняем информацию о комнате
      if (!this.gameRooms.has(result.game.id)) {
        this.gameRooms.set(result.game.id, {
          game: result.game,
          players: new Map()
        });
      }
      
      const room = this.gameRooms.get(result.game.id);
      if (room) {
        room.players.set(userId, {
          socketId: socket.id,
          player: result.player
        });
      }

      // Уведомляем всех в комнате о новом игроке
      this.io.to(result.game.id).emit('player_joined', {
        player: result.player,
        isNewPlayer: result.isNewPlayer
      });

      // Отправляем текущее состояние игры новому игроку
      const gameState = await this.gameService.getGameState(result.game.id);
      socket.emit('game_state', gameState);

      console.log(`Игрок ${userId} присоединился к игре ${gameName}`);
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка создания персонажа
  private async handleCreateCharacter(socket: AuthenticatedSocket, data: CreateCharacterData): Promise<void> {
    try {
      const { gameId, characterData } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      const player = await Player.findOne({ where: { userId, gameId } });
      if (!player) {
        socket.emit('error', { message: 'Игрок не найден в игре' });
        return;
      }

      const character = await this.gameService.createCharacter(player.id, characterData);
      
      // Уведомляем всех в комнате о создании персонажа
      this.io.to(gameId).emit('character_created', {
        playerId: player.id,
        character
      });

      socket.emit('character_created_success', { character });
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка движения персонажа
  private async handleMoveCharacter(socket: AuthenticatedSocket, data: MoveCharacterData): Promise<void> {
    try {
      const { gameId, position } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      const player = await Player.findOne({ where: { userId, gameId } });
      if (!player) {
        socket.emit('error', { message: 'Игрок не найден в игре' });
        return;
      }

      const character = await this.gameService.moveCharacter(player.id, position);
      
      // Уведомляем всех в комнате о движении персонажа
      this.io.to(gameId).emit('character_moved', {
        playerId: player.id,
        character,
        position
      });

      socket.emit('move_success', { character });
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка броска кубика
  private async handleRollDice(socket: AuthenticatedSocket, data: RollDiceData): Promise<void> {
    try {
      const { gameId, command } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      const player = await Player.findOne({ where: { userId, gameId } });
      if (!player) {
        socket.emit('error', { message: 'Игрок не найден в игре' });
        return;
      }

      const result = await this.gameService.rollDice(command);
      
      // Уведомляем всех в комнате о броске кубика
      this.io.to(gameId).emit('dice_rolled', {
        playerId: player.id,
        result: result.result,
        message: result.message
      });

      socket.emit('roll_success', result);
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка взаимодействия с тайлом
  private async handleInteractTile(socket: AuthenticatedSocket, data: InteractTileData): Promise<void> {
    try {
      const { gameId, x, y, action } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      const player = await Player.findOne({ where: { userId, gameId } });
      if (!player) {
        socket.emit('error', { message: 'Игрок не найден в игре' });
        return;
      }

      const result = await this.gameService.interactWithTile(gameId, x, y, action);
      
      // Уведомляем всех в комнате о взаимодействии
      this.io.to(gameId).emit('tile_interaction', {
        playerId: player.id,
        x,
        y,
        action,
        result
      });

      socket.emit('interaction_success', result);
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка чат сообщения
  private async handleChatMessage(socket: AuthenticatedSocket, data: ChatMessageData): Promise<void> {
    try {
      const { gameId, message } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      const player = await Player.findOne({ 
        where: { userId, gameId }
      });
      
      if (!player) {
        socket.emit('error', { message: 'Игрок не найден в игре' });
        return;
      }

      // Логируем сообщение
      await this.gameService.logAction(gameId, player.id, 'chat', message);
      
      // Отправляем сообщение всем в комнате
      this.io.to(gameId).emit('chat_message', {
        playerId: player.id,
        playerName: `User-${userId}`, // Используем userId как имя игрока
        message,
        timestamp: new Date()
      });
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка запроса информации о тайле
  private async handleGetTileInfo(socket: AuthenticatedSocket, data: GetTileInfoData): Promise<void> {
    try {
      const { gameId, x, y } = data;
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Необходима аутентификация' });
        return;
      }

      const tileInfo = await this.gameService.getTileInfo(gameId, x, y);
      
      socket.emit('tile_info', {
        x,
        y,
        tile: tileInfo
      });
    } catch (error) {
      socket.emit('error', { message: error instanceof Error ? error.message : 'Неизвестная ошибка' });
    }
  }

  // Обработка отключения
  private handleDisconnect(socket: AuthenticatedSocket): void {
    const userId = socket.userId;
    
    if (userId) {
      // Удаляем связь пользователя с сокетом
      this.userSockets.delete(userId);
      
      // Находим игру пользователя
      for (const [gameId, room] of this.gameRooms) {
        if (room.players.has(userId)) {
          // Удаляем игрока из комнаты
          room.players.delete(userId);
          
          // Уведомляем остальных игроков
          this.io.to(gameId).emit('player_disconnected', { userId });
          
          // Отключаем игрока в базе данных
          this.gameService.disconnectPlayer(userId);
          
          console.log(`Игрок ${userId} отключился от игры ${gameId}`);
          break;
        }
      }
    }
    
    console.log(`Пользователь отключился: ${socket.id}`);
  }

  // Отправка системного сообщения в игру
  public sendSystemMessage(gameId: string, message: string, data: any = {}): void {
    this.io.to(gameId).emit('system_message', {
      message,
      data,
      timestamp: new Date()
    });
  }

  // Обновление состояния игры для всех игроков
  public async updateGameStateForAll(gameId: string): Promise<void> {
    try {
      const room = this.gameRooms.get(gameId);
      if (!room) return;

      for (const [userId, playerInfo] of room.players) {
        const gameState = await this.gameService.getGameState(gameId);
        const socket = this.io.sockets.sockets.get(playerInfo.socketId);
        if (socket) {
          socket.emit('game_state_updated', gameState);
        }
      }
    } catch (error) {
      console.error('Ошибка обновления состояния игры:', error);
    }
  }

  // Получение списка игроков в игре
  public getPlayersInGame(gameId: string): string[] {
    const room = this.gameRooms.get(gameId);
    return room ? Array.from(room.players.keys()) : [];
  }

  // Проверка, подключен ли игрок к игре
  public isPlayerInGame(gameId: string, userId: string): boolean {
    const room = this.gameRooms.get(gameId);
    return room ? room.players.has(userId) : false;
  }

  // Установка GameService
  public setGameService(gameService: GameService): void {
    this.gameService = gameService;
    console.log('🔌 GameService установлен в WebSocketService');
  }
}

export default WebSocketService; 