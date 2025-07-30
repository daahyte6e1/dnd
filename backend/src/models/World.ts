import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface WorldAttributes {
  id: string;
  gameId: string;
  data: any;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WorldCreationAttributes extends Optional<WorldAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

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
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Все данные мира (тайлы, размеры, правила генерации)'
  }
}, {
  timestamps: true
});

export default World; 