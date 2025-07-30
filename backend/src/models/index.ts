import { sequelize, testConnection } from '../config/database';
import User from './User';
import Game from './Game';
import Player from './Player';
import World from './World';
import Character from './Character';
import GameLog from './GameLog';

// Определяем связи между моделями
User.hasMany(Game, { as: 'createdGames', foreignKey: 'dmId' });
Game.belongsTo(User, { as: 'dm', foreignKey: 'dmId' });

User.belongsToMany(Game, { through: Player, as: 'games' });
Game.belongsToMany(User, { through: Player, as: 'players' });

// Связи для мира
Game.hasOne(World, { as: 'world', foreignKey: 'gameId' });
World.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });

// Связи для персонажей
Player.hasOne(Character, { as: 'character', foreignKey: 'playerId' });
Character.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });

// Связи для логов
Game.hasMany(GameLog, { as: 'logs', foreignKey: 'gameId' });
GameLog.belongsTo(Game, { as: 'game', foreignKey: 'gameId' });

Player.hasMany(GameLog, { as: 'logs', foreignKey: 'playerId' });
GameLog.belongsTo(Player, { as: 'player', foreignKey: 'playerId' });

// Синхронизация базы данных
const syncDatabase = async (): Promise<void> => {
  try {
    await sequelize.sync({ alter: true });
    console.log('База данных синхронизирована');
  } catch (error) {
    console.error('Ошибка синхронизации базы данных:', error);
  }
};

export {
  sequelize,
  User,
  Game,
  Player,
  World,
  Character,
  GameLog,
  syncDatabase,
  testConnection
}; 