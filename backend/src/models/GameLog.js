const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GameLog = sequelize.define('GameLog', {
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

module.exports = GameLog; 