import WorldGenerator from './WorldGenerator';
import DiceService from './DiceService';
import { Game, Player, Character, World, GameLog, User } from '../models';
import { sequelize } from '../config/database';

interface GameData {
  id: string;
  name: string;
  description: string;
  maxPlayers: number;
  isPrivate: boolean;
  isActive: boolean;
  createdAt: Date;
  gameState: {
    status: string;
    currentTurn: string | null;
    turnOrder: string[];
    round: number;
  };
}

interface PlayerData {
  id: string;
  name: string;
  isHost: boolean;
  gameId: string;
  isReady: boolean;
  isOnline: boolean;
  character: {
    id: string;
    name: string;
    class: string;
    level: number;
    health: number;
    maxHealth: number;
    position: { x: number; y: number };
    initiative: number;
    abilities: {
      str: number;
      dex: number;
      con: number;
      int: number;
      wis: number;
      cha: number;
    };
    inventory: any[];
  };
}

interface GameSession {
  game: GameData;
  world: any;
  players: Map<string, PlayerData>;
  logs: any[];
}

interface JoinGameData {
  name: string;
  isHost?: boolean;
}

// Тип для логов
type LogType = 'action' | 'combat' | 'system' | 'chat';

class GameService {
  private worldGenerator: WorldGenerator;
  private diceService: DiceService;

  constructor() {
    this.worldGenerator = new WorldGenerator();
    this.diceService = new DiceService();
  }

  // Генерация мира
  generateWorld(width: number, height: number, seed: number): any {
    return this.worldGenerator.generateWorld(width, height, seed);
  }

  // Создание новой игры
  async createGame(gameData: { name: string; description: string; maxPlayers?: number; isPrivate?: boolean; dmId: string }): Promise<GameData> {
    try {
      const { name, description, maxPlayers, isPrivate, dmId } = gameData;
      
      console.log('🎮 Создание игры в GameService:', { name, description, maxPlayers, isPrivate, dmId });
      
      // Проверяем уникальность имени игры
      const existingGame = await Game.findOne({ where: { name } });
      if (existingGame) {
        throw new Error('Игра с таким именем уже существует');
      }

      // Создаем игру в базе данных
      const game = await Game.create({
        name,
        description,
        maxPlayers: maxPlayers || 6,
        isPrivate: isPrivate || false,
        isActive: true,
        dmId,
        gameState: {
          status: 'waiting',
          currentTurn: null,
          turnOrder: [],
          round: 0
        }
      });

      // Создаем мир для игры
      const worldData = this.worldGenerator.generateWorld(20, 20, Date.now());
      await World.create({
        gameId: game.id,
        data: worldData
      });

      console.log('✅ Игра создана в базе данных:', game.id);

      return {
        id: game.id,
        name: game.name,
        description: game.description || '',
        maxPlayers: game.maxPlayers,
        isPrivate: game.isPrivate,
        isActive: game.isActive,
        createdAt: game.createdAt || new Date(),
        gameState: game.gameState
      };
    } catch (error: any) {
      throw new Error(`Ошибка создания игры: ${error.message}`);
    }
  }

  // Подключение к игре
  async joinGame(gameName: string, playerData: JoinGameData): Promise<{ game: GameData; player: PlayerData; isNewPlayer: boolean }> {
    try {
      console.log(`🔍 Поиск игры: ${gameName}`);
      
      // Ищем игру в базе данных
      const game = await Game.findOne({ 
        where: { name: gameName, isActive: true },
        include: [
          { model: World, as: 'world' }
        ]
      });

      if (!game) {
        throw new Error('Игра не найдена');
      }

      console.log(`✅ Найдена игра: ${game.name}`);

      // Проверяем количество игроков
      const playerCount = await Player.count({ where: { gameId: game.id } });
      if (playerCount >= game.maxPlayers) {
        throw new Error('Игра заполнена');
      }

      // Создаем временного пользователя для игрока
      const tempUser = await User.create({
        username: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: `temp_player_${Date.now()}@temp.com`,
        password: 'temp_password_123',
        isActive: true
      });

      // Создаем игрока
      const player = await Player.create({
        userId: tempUser.id, // Используем ID созданного пользователя
        gameId: game.id,
        isReady: true,
        isOnline: true,
        lastSeen: new Date()
      });

      // Создаем персонажа для игрока
      const character = await Character.create({
        playerId: player.id,
        name: playerData.name,
        characterClass: 'fighter',
        level: 1,
        stats: {
          strength: 15,
          dexterity: 12,
          constitution: 14,
          intelligence: 10,
          wisdom: 8,
          charisma: 13
        },
        hp: 100,
        maxHp: 100,
        position: { x: 10, y: 10 },
        initiative: 0,
        inventory: []
      });

      const playerDataResult: PlayerData = {
        id: player.id,
        name: playerData.name,
        isHost: playerData.isHost || false,
        gameId: game.id,
        isReady: player.isReady,
        isOnline: player.isOnline,
        character: {
          id: character.id,
          name: character.name,
          class: character.characterClass,
          level: character.level,
          health: character.hp,
          maxHealth: character.maxHp,
          position: character.position,
          initiative: character.initiative,
          abilities: {
            str: character.stats.strength,
            dex: character.stats.dexterity,
            con: character.stats.constitution,
            int: character.stats.intelligence,
            wis: character.stats.wisdom,
            cha: character.stats.charisma
          },
          inventory: character.inventory
        }
      };

      return {
        game: {
          id: game.id,
          name: game.name,
          description: game.description || '',
          maxPlayers: game.maxPlayers,
          isPrivate: game.isPrivate,
          isActive: game.isActive,
          createdAt: game.createdAt || new Date(),
          gameState: game.gameState
        },
        player: playerDataResult,
        isNewPlayer: true
      };
    } catch (error: any) {
      throw new Error(`Ошибка подключения к игре: ${error.message}`);
    }
  }

  // Получение состояния игры
  async getGameState(gameId: string): Promise<{ game: GameData; world: any; players: PlayerData[]; logs: any[] }> {
    try {
      const game = await Game.findByPk(gameId, {
        include: [
          { model: Player, as: 'players', include: [{ model: Character, as: 'character' }] },
          { model: World, as: 'world' },
          { model: GameLog, as: 'logs' }
        ]
      });

      if (!game) {
        throw new Error('Игра не найдена');
      }

      const playersData: PlayerData[] = (game as any).players?.map((player: any) => ({
        id: player.id,
        name: player.character?.name || 'Unknown',
        isHost: false, // Нужно добавить поле isHost в модель Player
        gameId: game.id,
        isReady: player.isReady,
        isOnline: player.isOnline,
        character: {
          id: player.character?.id || '',
          name: player.character?.name || '',
          class: player.character?.characterClass || 'fighter',
          level: player.character?.level || 1,
          health: player.character?.hp || 100,
          maxHealth: player.character?.maxHp || 100,
          position: player.character?.position || { x: 0, y: 0 },
          initiative: player.character?.initiative || 0,
          abilities: {
            str: player.character?.stats?.strength || 10,
            dex: player.character?.stats?.dexterity || 10,
            con: player.character?.stats?.constitution || 10,
            int: player.character?.stats?.intelligence || 10,
            wis: player.character?.stats?.wisdom || 10,
            cha: player.character?.stats?.charisma || 10
          },
          inventory: player.character?.inventory || []
        }
      })) || [];

      return {
        game: {
          id: game.id,
          name: game.name,
          description: game.description || '',
          maxPlayers: game.maxPlayers,
          isPrivate: game.isPrivate,
          isActive: game.isActive,
          createdAt: game.createdAt || new Date(),
          gameState: game.gameState
        },
        world: (game as any).world?.data || this.worldGenerator.generateWorld(20, 20, Date.now()),
        players: playersData,
        logs: (game as any).logs?.map((log: any) => ({
          id: log.id,
          gameId: log.gameId,
          playerId: log.playerId,
          type: log.type,
          message: log.message,
          data: log.data,
          timestamp: log.createdAt
        })) || []
      };
    } catch (error: any) {
      throw new Error(`Ошибка получения состояния игры: ${error.message}`);
    }
  }

  // Создание персонажа
  async createCharacter(gameId: string, characterData: any): Promise<any> {
    try {
      const character = await Character.create({
        ...characterData,
        createdAt: new Date()
      });

      return character;
    } catch (error: any) {
      throw new Error(`Ошибка создания персонажа: ${error.message}`);
    }
  }

  // Движение персонажа
  async moveCharacter(gameId: string, playerId: string, position: { x: number; y: number }): Promise<{ character: { position: { x: number; y: number } }; newPosition: { x: number; y: number } }> {
    try {
      // Получаем персонажа игрока
      const player = await Player.findOne({
        where: { id: playerId, gameId },
        include: [{ model: Character, as: 'character' }]
      });

      if (!player || !(player as any).character) {
        throw new Error('Персонаж не найден');
      }

      // Простая валидация позиции
      if (position.x < 0 || position.x >= 20 || position.y < 0 || position.y >= 20) {
        throw new Error('Недопустимая позиция');
      }

      // Обновляем позицию персонажа
      await (player as any).character.update({ position });

      return {
        character: { position },
        newPosition: position
      };
    } catch (error: any) {
      throw new Error(`Ошибка движения персонажа: ${error.message}`);
    }
  }

  // Бросок кубика
  rollDice(command: string): any {
    return this.diceService.parseDiceCommand(command) || this.diceService.rollDice(1, 20);
  }

  // Логирование действий
  async logAction(gameId: string, playerId: string, type: LogType, message: string, data: any = {}): Promise<any> {
    try {
      const log = await GameLog.create({
        gameId,
        playerId,
        type,
        message,
        data
      });

      return {
        id: log.id,
        gameId: log.gameId,
        playerId: log.playerId,
        type: log.type,
        message: log.message,
        data: log.data,
        timestamp: log.createdAt
      };
    } catch (error: any) {
      throw new Error(`Ошибка логирования: ${error.message}`);
    }
  }

  // Получение информации о тайле
  async getTileInfo(gameId: string, x: number, y: number): Promise<any> {
    try {
      const world = await World.findOne({ where: { gameId } });
      
      if (!world) {
        throw new Error('Мир игры не найден');
      }

      const worldData = world.data;
      
      if (x < 0 || x >= worldData.width || y < 0 || y >= worldData.height) {
        throw new Error('Координаты вне границ мира');
      }

      return worldData.tiles[x][y] || {
        type: 'plains',
        features: [],
        npcs: [],
        passable: true,
        visibility: 1
      };
    } catch (error: any) {
      throw new Error(`Ошибка получения информации о тайле: ${error.message}`);
    }
  }

  // Взаимодействие с тайлом
  async interactWithTile(gameId: string, x: number, y: number, action: string): Promise<any> {
    try {
      const tile = await this.getTileInfo(gameId, x, y);
      
      // Простая логика взаимодействия
      let result = {
        success: true,
        message: `Взаимодействие с ${tile.type}`,
        tile: tile,
        action: action
      };

      switch (action) {
        case 'examine':
          result.message = `Осматриваете ${tile.type}`;
          break;
        case 'search':
          result.message = `Ищете в ${tile.type}`;
          break;
        case 'interact':
          result.message = `Взаимодействуете с ${tile.type}`;
          break;
        default:
          result.message = `Неизвестное действие: ${action}`;
      }

      return result;
    } catch (error: any) {
      throw new Error(`Ошибка взаимодействия с тайлом: ${error.message}`);
    }
  }

  // Отключение игрока
  async disconnectPlayer(playerId: string): Promise<PlayerData | null> {
    try {
      const player = await Player.findByPk(playerId, {
        include: [{ model: Character, as: 'character' }]
      });

      if (!player) {
        return null;
      }

      await player.update({ 
        isOnline: false,
        lastSeen: new Date()
      });

      return {
        id: player.id,
        name: (player as any).character?.name || 'Unknown',
        isHost: false,
        gameId: player.gameId,
        isReady: player.isReady,
        isOnline: false,
        character: {
          id: (player as any).character?.id || '',
          name: (player as any).character?.name || '',
          class: (player as any).character?.characterClass || 'fighter',
          level: (player as any).character?.level || 1,
          health: (player as any).character?.hp || 100,
          maxHealth: (player as any).character?.maxHp || 100,
          position: (player as any).character?.position || { x: 0, y: 0 },
          initiative: (player as any).character?.initiative || 0,
          abilities: {
            str: (player as any).character?.stats?.strength || 10,
            dex: (player as any).character?.stats?.dexterity || 10,
            con: (player as any).character?.stats?.constitution || 10,
            int: (player as any).character?.stats?.intelligence || 10,
            wis: (player as any).character?.stats?.wisdom || 10,
            cha: (player as any).character?.stats?.charisma || 10
          },
          inventory: (player as any).character?.inventory || []
        }
      };
    } catch (error: any) {
      console.error('Ошибка отключения игрока:', error);
      return null;
    }
  }

  // Обновление состояния игры
  async updateGameState(gameId: string, gameState: any): Promise<any> {
    try {
      const game = await Game.findByPk(gameId);
      
      if (!game) {
        throw new Error('Игра не найдена');
      }

      await game.update({ 
        gameState: { ...game.gameState, ...gameState }
      });

      return game.gameState;
    } catch (error: any) {
      throw new Error(`Ошибка обновления состояния игры: ${error.message}`);
    }
  }

  // Получение списка активных игр
  async getActiveGames(): Promise<GameData[]> {
    try {
      const games = await Game.findAll({
        where: { isActive: true }
      });

      return games.map(game => ({
        id: game.id,
        name: game.name,
        description: game.description || '',
        maxPlayers: game.maxPlayers,
        isPrivate: game.isPrivate,
        isActive: game.isActive,
        createdAt: game.createdAt || new Date(),
        gameState: game.gameState
      }));
    } catch (error: any) {
      throw new Error(`Ошибка получения списка игр: ${error.message}`);
    }
  }
}

export default GameService; 