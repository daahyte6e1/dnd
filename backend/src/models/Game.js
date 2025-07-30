const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Game = sequelize.define('Game', {
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

module.exports = Game; 