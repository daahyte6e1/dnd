import WorldGenerator from './WorldGenerator';
import DiceService from './DiceService';

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

class GameService {
  private worldGenerator: WorldGenerator;
  private diceService: DiceService;
  private activeGames: Map<string, GameSession>;
  private externalGames: Map<string, GameData> | null;
  private externalPlayers: Map<string, PlayerData> | null;

  constructor() {
    this.worldGenerator = new WorldGenerator();
    this.diceService = new DiceService();
    this.activeGames = new Map(); // Кэш активных игр в памяти
    this.externalGames = null; // Внешнее хранилище игр
    this.externalPlayers = null; // Внешнее хранилище игроков
  }

  // Установка внешнего хранилища игр
  setGamesStorage(gamesStorage: Map<string, GameData>): void {
    this.externalGames = gamesStorage;
  }

  // Установка внешнего хранилища игроков
  setPlayersStorage(playersStorage: Map<string, PlayerData>): void {
    this.externalPlayers = playersStorage;
  }

  // Генерация мира
  generateWorld(width: number, height: number, seed: number): any {
    return this.worldGenerator.generateWorld(width, height, seed);
  }

  // Создание новой игры
  createGame(gameData: { name: string; description: string; maxPlayers?: number; isPrivate?: boolean }): GameData {
    try {
      const { name, description, maxPlayers, isPrivate } = gameData;
      
      console.log('🎮 Создание игры в GameService:', { name, description, maxPlayers, isPrivate });
      console.log('🔍 Внешнее хранилище игр доступно:', !!this.externalGames);
      
      // Проверяем уникальность имени игры
      if (this.externalGames && this.externalGames.has(name)) {
        throw new Error('Игра с таким именем уже существует');
      }

      // Создаем игру
      const game: GameData = {
        id: Date.now().toString(),
        name,
        description,
        maxPlayers: maxPlayers || 6,
        isPrivate: isPrivate || false,
        isActive: true,
        createdAt: new Date(),
        gameState: {
          status: 'waiting',
          currentTurn: null,
          turnOrder: [],
          round: 0
        }
      };

      // Добавляем игру во внешнее хранилище
      if (this.externalGames) {
        this.externalGames.set(name, game);
        console.log('✅ Игра добавлена во внешнее хранилище:', name);
        console.log('📋 Размер внешнего хранилища после добавления:', this.externalGames.size);
      } else {
        console.log('⚠️ Внешнее хранилище недоступно, игра не сохранена');
      }

      // Также добавляем в активные игры для совместимости
      this.activeGames.set(game.id, {
        game,
        world: this.worldGenerator.generateWorld(20, 20, Date.now()),
        players: new Map(),
        logs: []
      });

      return game;
    } catch (error: any) {
      throw new Error(`Ошибка создания игры: ${error.message}`);
    }
  }

  // Подключение к игре
  joinGame(gameName: string, playerData: JoinGameData): { game: GameData; player: PlayerData; isNewPlayer: boolean } {
    try {
      console.log(`🔍 Поиск игры: ${gameName}`);
      console.log(`🔍 Внешнее хранилище игр доступно:`, !!this.externalGames);
      
      // Ищем во внешнем хранилище
      if (this.externalGames) {
        console.log(`🔍 Поиск во внешнем хранилище игр`);
        console.log(`📋 Доступные игры во внешнем хранилище:`, Array.from(this.externalGames.keys()));
        console.log(`🔍 Размер внешнего хранилища:`, this.externalGames.size);
        
        const externalGame = this.externalGames.get(gameName);
        console.log(`🔍 Результат поиска игры "${gameName}":`, !!externalGame);
        if (externalGame) {
          console.log(`✅ Найдена игра во внешнем хранилище: ${externalGame.name}`);
          // Создаем структуру для GameService
          const game: GameSession = {
            game: externalGame,
            world: this.worldGenerator.generateWorld(20, 20, Date.now()),
            players: new Map(),
            logs: []
          };
          // Добавляем в активные игры
          this.activeGames.set(externalGame.id, game);
          
          // Создаем игрока
          const player: PlayerData = {
            id: Date.now().toString(),
            name: playerData.name,
            isHost: playerData.isHost || false,
            gameId: externalGame.id,
            isReady: true,
            isOnline: true,
            character: {
              id: Date.now().toString(),
              name: playerData.name,
              class: 'Warrior',
              level: 1,
              health: 100,
              maxHealth: 100,
              position: { x: 10, y: 10 },
              initiative: 0,
              abilities: {
                str: 15,
                dex: 12,
                con: 14,
                int: 10,
                wis: 8,
                cha: 13
              },
              inventory: []
            }
          };

          // Добавляем игрока в игру
          game.players.set(player.id, player);

          return {
            game: externalGame,
            player,
            isNewPlayer: true
          };
        }
      }
      
      throw new Error('Игра не найдена');
    } catch (error: any) {
      throw new Error(`Ошибка подключения к игре: ${error.message}`);
    }
  }

  // Получение состояния игры
  getGameState(gameId: string): { game: GameData; world: any; players: PlayerData[]; logs: any[] } {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    return {
      game: gameData.game,
      world: gameData.world,
      players: Array.from(gameData.players.values()),
      logs: gameData.logs
    };
  }

  // Создание персонажа
  createCharacter(gameId: string, characterData: any): any {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    const character = {
      id: Date.now().toString(),
      ...characterData,
      createdAt: new Date()
    };

    return character;
  }

  // Движение персонажа
  moveCharacter(gameId: string, position: { x: number; y: number }): { character: { position: { x: number; y: number } }; newPosition: { x: number; y: number } } {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    // Простая валидация позиции
    if (position.x < 0 || position.x >= gameData.world.width || 
        position.y < 0 || position.y >= gameData.world.height) {
      throw new Error('Недопустимая позиция');
    }

    return {
      character: { position },
      newPosition: position
    };
  }

  // Бросок кубика
  rollDice(command: string): any {
    return this.diceService.parseDiceCommand(command) || this.diceService.rollDice(1, 20);
  }

  // Логирование действий
  logAction(gameId: string, playerId: string, type: string, message: string, data: any = {}): any {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    const log = {
      id: Date.now().toString(),
      gameId,
      playerId,
      type,
      message,
      data,
      timestamp: new Date()
    };

    gameData.logs.push(log);
    return log;
  }

  // Получение информации о тайле
  getTileInfo(gameId: string, x: number, y: number): any {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    if (x < 0 || x >= gameData.world.width || y < 0 || y >= gameData.world.height) {
      throw new Error('Координаты вне границ мира');
    }

    return gameData.world.tiles[x][y] || {
      type: 'plains',
      features: [],
      npcs: [],
      passable: true,
      visibility: 1
    };
  }

  // Взаимодействие с тайлом
  interactWithTile(gameId: string, x: number, y: number, action: string): any {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    const tile = this.getTileInfo(gameId, x, y);
    
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
  }

  // Отключение игрока
  disconnectPlayer(playerId: string): PlayerData | null {
    for (const [gameId, gameData] of this.activeGames) {
      if (gameData.players.has(playerId)) {
        const player = gameData.players.get(playerId)!;
        player.isOnline = false;
        return player;
      }
    }
    return null;
  }

  // Обновление состояния игры
  updateGameState(gameId: string, gameState: any): any {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    gameData.game.gameState = { ...gameData.game.gameState, ...gameState };
    return gameData.game.gameState;
  }
}

export default GameService; 