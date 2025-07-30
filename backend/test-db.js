require('ts-node/register');
const { testConnection } = require('./src/config/database');
const { syncDatabase } = require('./src/models');

async function testDatabase() {
  try {
    console.log('🔍 Тестирование подключения к базе данных...');
    await testConnection();
    
    console.log('🔄 Синхронизация базы данных...');
    await syncDatabase();
    
    console.log('✅ База данных готова к работе!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при работе с базой данных:', error);
    process.exit(1);
  }
}

testDatabase(); 