import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

type CharacterClass = 'fighter' | 'wizard' | 'rogue' | 'cleric' | 'ranger' | 'barbarian';

interface CharacterAttributes {
  id: string;
  playerId: string;
  name: string;
  characterClass: CharacterClass;
  level: number;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  hp: number;
  maxHp: number;
  position: { x: number; y: number };
  inventory: any[];
  experience: number;
  initiative: number;
  isAlive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CharacterCreationAttributes extends Optional<CharacterAttributes, 'id' | 'level' | 'stats' | 'hp' | 'maxHp' | 'position' | 'inventory' | 'experience' | 'initiative' | 'isAlive' | 'createdAt' | 'updatedAt'> {}

interface CharacterInstance extends Model<CharacterAttributes, CharacterCreationAttributes>, CharacterAttributes {}

const Character = sequelize.define<CharacterInstance>('Character', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  playerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  characterClass: {
    type: DataTypes.ENUM('fighter', 'wizard', 'rogue', 'cleric', 'ranger', 'barbarian'),
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 20
    }
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }
  },
  hp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  maxHp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  position: {
    type: DataTypes.JSON,
    defaultValue: { x: 0, y: 0 }
  },
  inventory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  initiative: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAlive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export default Character; 