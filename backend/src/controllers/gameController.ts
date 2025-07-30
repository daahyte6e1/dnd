import { Request, Response } from 'express';
import GameService from '../services/GameService';
import User from '../models/User'; // Added import for User model

// Используем глобальный GameService
declare global {
  var gameService: GameService;
}

const gameService = global.gameService;

console.log('🎮 Используем глобальный GameService');

interface CreateGameRequest {
  name: string;
  playerName: string;
  isHost?: boolean;
  dmId: string;
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
  playerId: string;
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
    const { name, playerName, isHost, dmId } = req.body;

    if (!name || !playerName) {
      res.status(400).json({ error: 'Необходимо указать имя игры и имя игрока' });
      return;
    }

    // Проверяем, что глобальный объект инициализирован
    if (!gameService) {
      console.error('❌ GameService не инициализирован');
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    let finalDmId = dmId;
    
    // Если dmId не передан или не существует, создаем временного пользователя
    if (!dmId) {
      const tempUser = await User.create({
        username: `dm_${Date.now()}`,
        email: `temp_${Date.now()}@temp.com`,
        password: 'temp_password_123',
        isActive: true
      });
      finalDmId = tempUser.id;
      console.log('✅ Создан временный пользователь для DM:', finalDmId);
    } else {
      // Проверяем, существует ли пользователь с таким dmId
      const existingUser = await User.findByPk(dmId);
      if (!existingUser) {
        res.status(400).json({ error: 'Пользователь с указанным dmId не найден' });
        return;
      }
    }

    // Создаем игру через GameService
    const gameData = {
      name,
      description: `Игра ${name}`,
      maxPlayers: 6,
      isPrivate: false,
      dmId: finalDmId
    };

    console.log('🎮 Создание игры через GameService:', gameData);
    const game = await gameService.createGame(gameData);
    console.log('✅ Игра создана в GameService:', game.id);

    // Создаем игрока
    const player = await gameService.joinGame(name, {
      name: playerName,
      isHost: isHost || false
    });

    res.status(201).json({
      message: 'Игра успешно создана',
      game: {
        id: game.id,
        name: game.name,
        player: player.player
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
    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const games = await gameService.getActiveGames();
    
    res.json({ 
      games: games.map(game => ({
        id: game.id,
        name: game.name,
        description: game.description,
        maxPlayers: game.maxPlayers,
        isPrivate: game.isPrivate,
        isActive: game.isActive
      }))
    });
  } catch (error: any) {
    console.error('Ошибка получения игр:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получение информации об игре
const getGame = async (req: Request<{ gameId: string }>, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const gameState = await gameService.getGameState(gameId);

    res.json(gameState);
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

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const result = await gameService.joinGame(gameName, {
      name: playerName,
      isHost: false
    });

    res.json({
      message: 'Успешно присоединились к игре',
      game: {
        id: result.game.id,
        name: result.game.name,
        player: result.player
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

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const character = await gameService.createCharacter(gameId, characterData);

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
    const { position, playerId } = req.body;

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const result = await gameService.moveCharacter(gameId, playerId, position);

    res.json({
      message: 'Персонаж успешно перемещен',
      character: result.character,
      newPosition: result.newPosition
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

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

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

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const result = await gameService.interactWithTile(gameId, x, y, action);

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

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const tileInfo = await gameService.getTileInfo(gameId, parseInt(x), parseInt(y));

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

    if (!gameService) {
      res.status(500).json({ error: 'Сервис не инициализирован' });
      return;
    }

    const result = await gameService.updateGameState(gameId, gameState);

    res.json({
      message: 'Состояние игры обновлено',
      gameState: result
    });
  } catch (error: any) {
    console.error('Ошибка обновления состояния игры:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получение всех персонажей пользователя
const getUserCharacters = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Не передан userId' });
      return;
    }
    const players = await global.gameService.models.Player.findAll({ where: { userId } });
    const playerIds = players.map((p: any) => p.id);
    const characters = await global.gameService.models.Character.findAll({ where: { playerId: playerIds } });
    res.json({ characters });
  } catch (error) {
    console.error('Ошибка получения персонажей пользователя:', error);
    res.status(500).json({ error: 'Ошибка при получении персонажей пользователя' });
  }
};

// Создание классического персонажа для пользователя
const createClassicCharacter = async (req: Request<{ userId: string }>, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { name, characterClass } = req.body;
    if (!userId || !name || !characterClass) {
      res.status(400).json({ error: 'Не переданы userId, name или characterClass' });
      return;
    }
    // Находим Player для пользователя (или создаём, если нужно)
    let player = await global.gameService.models.Player.findOne({ where: { userId } });
    if (!player) {
      player = await global.gameService.models.Player.create({ userId, gameId: null, isReady: false, isOnline: false, lastSeen: new Date() });
    }
    // Дефолтные характеристики DnD
    const defaultStats = {
      strength: 15,
      dexterity: 14,
      constitution: 13,
      intelligence: 12,
      wisdom: 10,
      charisma: 8
    };
    const character = await global.gameService.models.Character.create({
      playerId: player.id,
      name,
      characterClass,
      level: 1,
      stats: defaultStats,
      hp: 12,
      maxHp: 12,
      position: { x: 0, y: 0 },
      inventory: [],
      experience: 0,
      initiative: 0,
      isAlive: true
    });
    res.status(201).json({ character });
  } catch (error) {
    console.error('Ошибка создания классического персонажа:', error);
    res.status(500).json({ error: 'Ошибка при создании персонажа' });
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
  updateGameState,
  getUserCharacters,
  createClassicCharacter
}; 