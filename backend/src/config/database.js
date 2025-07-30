const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'dnd',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'tmp',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Отключаем логи SQL запросов в продакшене
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Тестирование подключения
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно установлено.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  }
};

module.exports = { sequelize, testConnection }; 