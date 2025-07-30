const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Player = sequelize.define('Player', {
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

module.exports = Player; 