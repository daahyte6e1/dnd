import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface WorldAttributes {
  id: string;
  gameId: string;
  seed: string;
  width: number;
  height: number;
  tiles: any;
  worldData: any;
  generationRules: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorldCreationAttributes extends Optional<WorldAttributes, 'id' | 'width' | 'height' | 'worldData' | 'generationRules' | 'createdAt' | 'updatedAt'> {}

interface WorldInstance extends Model<WorldAttributes, WorldCreationAttributes>, WorldAttributes {}

const World = sequelize.define<WorldInstance>('World', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  seed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    validate: {
      min: 10,
      max: 100
    }
  },
  height: {
    type: DataTypes.INTEGER,
    defaultValue: 20,
    validate: {
      min: 10,
      max: 100
    }
  },
  tiles: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Массив тайлов мира [x][y] = {type, features, npcs}'
  },
  worldData: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Дополнительные данные мира (локации, события)'
  },
  generationRules: {
    type: DataTypes.JSON,
    defaultValue: {
      forest: 0.3,
      mountains: 0.2,
      villages: 0.1,
      dungeons: 0.05,
      plains: 0.35
    }
  }
}, {
  timestamps: true
});

export default World; 