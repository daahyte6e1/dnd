import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PlayerAttributes {
  id: string;
  userId: string;
  gameId: string;
  characterData: any;
  isReady: boolean;
  isOnline: boolean;
  lastSeen: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id' | 'characterData' | 'isReady' | 'isOnline' | 'lastSeen' | 'createdAt' | 'updatedAt'> {}

interface PlayerInstance extends Model<PlayerAttributes, PlayerCreationAttributes>, PlayerAttributes {}

const Player = sequelize.define<PlayerInstance>('Player', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  gameId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  characterData: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  isReady: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastSeen: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

export default Player; 