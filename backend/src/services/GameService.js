const WorldGenerator = require('./WorldGenerator');
const DiceService = require('./DiceService');

class GameService {
  constructor() {
    this.worldGenerator = new WorldGenerator();
    this.diceService = new DiceService();
    this.activeGames = new Map(); // Кэш активных игр в памяти
    this.externalGames = null; // Внешнее хранилище игр
    this.externalPlayers = null; // Внешнее хранилище игроков
  }

  // Установка внешнего хранилища игр
  setGamesStorage(gamesStorage) {
    this.externalGames = gamesStorage;
  }

  // Установка внешнего хранилища игроков
  setPlayersStorage(playersStorage) {
    this.externalPlayers = playersStorage;
  }

  // Генерация мира
  generateWorld(width, height, seed) {
    return this.worldGenerator.generateWorld(width, height, seed);
  }

  // Создание новой игры
  createGame(gameData) {
    try {
      const { name, description, maxPlayers, isPrivate } = gameData;
      
      // Проверяем уникальность имени игры
      if (this.externalGames && this.externalGames.has(name)) {
        throw new Error('Игра с таким именем уже существует');
      }

      // Создаем игру
      const game = {
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
      }

      // Также добавляем в активные игры для совместимости
      this.activeGames.set(game.id, {
        game,
        world: this.worldGenerator.generateWorld(20, 20, Date.now()),
        players: new Map(),
        logs: []
      });

      return game;
    } catch (error) {
      throw new Error(`Ошибка создания игры: ${error.message}`);
    }
  }

  // Подключение к игре
  joinGame(gameName, playerData) {
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
          const game = {
            game: externalGame,
            world: this.worldGenerator.generateWorld(20, 20, Date.now()),
            players: new Map(),
            logs: []
          };
          // Добавляем в активные игры
          this.activeGames.set(externalGame.id, game);
          
          // Создаем игрока
          const player = {
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
    } catch (error) {
      throw new Error(`Ошибка подключения к игре: ${error.message}`);
    }
  }

  // Получение состояния игры
  getGameState(gameId) {
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
  createCharacter(gameId, characterData) {
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
  moveCharacter(gameId, position) {
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
  rollDice(command) {
    return this.diceService.parseDiceCommand(command) || this.diceService.rollDice(1, 20);
  }

  // Логирование действий
  logAction(gameId, playerId, type, message, data = {}) {
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
  getTileInfo(gameId, x, y) {
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
  interactWithTile(gameId, x, y, action) {
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
  disconnectPlayer(playerId) {
    for (const [gameId, gameData] of this.activeGames) {
      if (gameData.players.has(playerId)) {
        const player = gameData.players.get(playerId);
        player.isOnline = false;
        return player;
      }
    }
    return null;
  }

  // Обновление состояния игры
  updateGameState(gameId, gameState) {
    const gameData = this.activeGames.get(gameId);
    if (!gameData) {
      throw new Error('Игра не найдена');
    }

    gameData.game.gameState = { ...gameData.game.gameState, ...gameState };
    return gameData.game.gameState;
  }
}

module.exports = GameService; 