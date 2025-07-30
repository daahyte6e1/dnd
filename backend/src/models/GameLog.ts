import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

type LogType = 'chat' | 'action' | 'combat' | 'system' | 'dice_roll';

interface GameLogAttributes {
  id: string;
  gameId: string;
  playerId?: string;
  type: LogType;
  message: string;
  data: any;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GameLogCreationAttributes extends Optional<GameLogAttributes, 'id' | 'playerId' | 'data' | 'timestamp' | 'createdAt' | 'updatedAt'> {}

interface GameLogInstance extends Model<GameLogAttributes, GameLogCreationAttributes>, GameLogAttributes {}

const GameLog = sequelize.define<GameLogInstance>('GameLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  playerId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'null для системных сообщений'
  },
  type: {
    type: DataTypes.ENUM('chat', 'action', 'combat', 'system', 'dice_roll'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  data: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Дополнительные данные события (координаты, урон, результаты бросков)'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['gameId', 'timestamp']
    }
  ]
});

export default GameLog; 