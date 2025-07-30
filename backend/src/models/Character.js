const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Character = sequelize.define('Character', {
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

module.exports = Character; 