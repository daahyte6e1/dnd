import { Request, Response } from 'express';
import GameService from '../services/GameService';

// Используем глобальный GameService
declare global {
  var gameService: GameService;
  var games: Map<string, any>;
  var players: Map<string, any>;
}

const gameService = global.gameService;
const games = global.games;
const players = global.players;

console.log('🎮 Используем глобальный GameService');
console.log('📋 Размер внешнего хранилища игр:', games ? games.size : 0);
console.log('🔍 Внешнее хранилище игр доступно:', !!games);

interface CreateGameRequest {
  name: string;
  playerName: string;
  isHost?: boolean;
}

interface JoinGameRequest {
  playerName: string;
}

interface CharacterData {
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
}

interface MoveCharacterRequest {
  position: { x: number; y: number };
}

interface RollDiceRequest {
  command: string;
}

interface InteractWithTileRequest {
  x: number;
  y: number;
  action: string;
}

// Создание новой игры
const createGame = async (req: Request<{}, {}, CreateGameRequest>, res: Response): Promise<void> => {
  try {
    const { name, playerName, isHost } = req.body;

    if (!name || !playerName) {
      res.status(400).json({ error: 'Необходимо указать имя игры и имя игрока' });
      return;
    }

    // Проверяем, что глобальные объекты инициализированы
    if (!gameService || !games || !players) {
      console.error('❌ Глобальные объекты не инициализированы');
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    // Проверяем, существует ли уже игра с таким именем
    if (games.has(name)) {
      res.status(409).json({ error: 'Игра с таким именем уже существует' });
      return;
    }

    // Создаем игру через GameService
    const gameData = {
      name,
      description: `Игра ${name}`,
      maxPlayers: 6,
      isPrivate: false
    };

    console.log('🎮 Создание игры через GameService:', gameData);
    const game = gameService.createGame(gameData);
    console.log('✅ Игра создана в GameService:', game.id);

    // Создаем игрока
    const player = {
      id: Date.now().toString(),
      name: playerName,
      isHost: isHost || false,
      gameId: game.id,
      character: {
        id: Date.now().toString(),
        name: playerName,
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

    // Добавляем игрока в GameService
    gameService.joinGame(game.name, {
      name: playerName,
      isHost: isHost || false
    });

    games.set(name, game);
    players.set(player.id, player);

    res.status(201).json({
      message: 'Игра успешно создана',
      game: {
        id: game.id,
        name: game.name,
        player: player
      }
    });
  } catch (error: any) {
    console.error('Ошибка создания игры:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получение списка активных игр
const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const gamesList = Array.from(games.values()).filter((game: any) => game.isActive);
    
    res.json({ 
      games: gamesList.map((game: any) => ({
        id: game.id,
        name: game.name,
        description: game.description,
        maxPlayers: game.maxPlayers,
        playerCount: Array.from(players.values()).filter((p: any) => p.gameId === game.id).length
      }))
    });
  } catch (error) {
    console.error('Ошибка получения игр:', error);
    res.status(500).json({ error: 'Ошибка при получении игр' });
  }
};

// Получение информации об игре
const getGame = async (req: Request<{ gameId: string }>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;

    const game = games.get(gameId);
    if (!game) {
      res.status(404).json({ error: 'Игра не найдена' });
      return;
    }

    const gamePlayers = Array.from(players.values()).filter((p: any) => p.gameId === gameId);

    res.json({
      ...game,
      players: gamePlayers
    });
  } catch (error: any) {
    console.error('Ошибка получения игры:', error);
    res.status(500).json({ error: error.message });
  }
};

// Присоединение к игре по имени
const joinGameByName = async (req: Request<{ gameName: string }, {}, JoinGameRequest>, res: Response): Promise<void> => {
  try {
    const { gameName } = req.params;
    const { playerName } = req.body;

    if (!playerName) {
      res.status(400).json({ error: 'Необходимо указать имя игрока' });
      return;
    }

    const game = games.get(gameName);
    if (!game) {
      res.status(404).json({ error: 'Игра не найдена' });
      return;
    }

    // Проверяем, не превышено ли максимальное количество игроков
    const playerCount = Array.from(players.values()).filter((p: any) => p.gameId === game.id).length;
    if (playerCount >= game.maxPlayers) {
      res.status(409).json({ error: 'Игра заполнена' });
      return;
    }

    // Создаем игрока
    const player = {
      id: Date.now().toString(),
      name: playerName,
      isHost: false,
      gameId: game.id,
      character: {
        id: Date.now().toString(),
        name: playerName,
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

    players.set(player.id, player);

    res.json({
      message: 'Успешно присоединились к игре',
      game: {
        id: game.id,
        name: game.name,
        player: player
      }
    });
  } catch (error: any) {
    console.error('Ошибка присоединения к игре:', error);
    res.status(500).json({ error: error.message });
  }
};

// Создание персонажа
const createCharacter = async (req: Request<{ gameId: string }, {}, CharacterData>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const characterData = req.body;

    const character = {
      id: Date.now().toString(),
      ...characterData,
      createdAt: new Date()
    };

    res.json({
      message: 'Персонаж успешно создан',
      character
    });
  } catch (error: any) {
    console.error('Ошибка создания персонажа:', error);
    res.status(500).json({ error: error.message });
  }
};

// Движение персонажа
const moveCharacter = async (req: Request<{ gameId: string }, {}, MoveCharacterRequest>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { position } = req.body;

    // Простая валидация позиции
    if (position.x < 0 || position.x >= 20 || position.y < 0 || position.y >= 20) {
      res.status(400).json({ error: 'Недопустимая позиция' });
      return;
    }

    res.json({
      message: 'Персонаж успешно перемещен',
      character: { position },
      newPosition: position
    });
  } catch (error: any) {
    console.error('Ошибка движения персонажа:', error);
    res.status(500).json({ error: error.message });
  }
};

// Бросок кубика
const rollDice = async (req: Request<{ gameId: string }, {}, RollDiceRequest>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { command } = req.body;

    const result = gameService.rollDice(command);

    res.json({
      message: 'Кубик брошен',
      roll: result
    });
  } catch (error: any) {
    console.error('Ошибка броска кубика:', error);
    res.status(500).json({ error: error.message });
  }
};

// Взаимодействие с тайлом
const interactWithTile = async (req: Request<{ gameId: string }, {}, InteractWithTileRequest>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { x, y, action } = req.body;

    const result = gameService.interactWithTile(gameId, x, y, action);

    res.json({
      message: 'Взаимодействие выполнено',
      result
    });
  } catch (error: any) {
    console.error('Ошибка взаимодействия с тайлом:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получение информации о тайле
const getTileInfo = async (req: Request<{ gameId: string; x: string; y: string }>, res: Response): Promise<void> => {
  try {
    const { gameId, x, y } = req.params;

    const tileInfo = gameService.getTileInfo(gameId, parseInt(x), parseInt(y));

    res.json({
      tile: tileInfo
    });
  } catch (error: any) {
    console.error('Ошибка получения информации о тайле:', error);
    res.status(500).json({ error: error.message });
  }
};

// Обновление состояния игры
const updateGameState = async (req: Request<{ gameId: string }, {}, any>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const gameState = req.body;

    res.json({
      message: 'Состояние игры обновлено',
      gameState
    });
  } catch (error: any) {
    console.error('Ошибка обновления состояния игры:', error);
    res.status(500).json({ error: error.message });
  }
};

export {
  createGame,
  getGames,
  getGame,
  joinGameByName,
  createCharacter,
  moveCharacter,
  rollDice,
  interactWithTile,
  getTileInfo,
  updateGameState
}; 