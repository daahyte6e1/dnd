import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface GameAttributes {
  id: string;
  name: string;
  description?: string;
  gameState: any;
  maxPlayers: number;
  isActive: boolean;
  isPrivate: boolean;
  password?: string;
  dmId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GameCreationAttributes extends Optional<GameAttributes, 'id' | 'description' | 'gameState' | 'maxPlayers' | 'isActive' | 'isPrivate' | 'password' | 'createdAt' | 'updatedAt'> {}

interface GameInstance extends Model<GameAttributes, GameCreationAttributes>, GameAttributes {}

const Game = sequelize.define<GameInstance>('Game', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gameState: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  maxPlayers: {
    type: DataTypes.INTEGER,
    defaultValue: 6,
    validate: {
      min: 1,
      max: 10
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dmId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Game; 