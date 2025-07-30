# Настройка DnD Backend с PostgreSQL

## Быстрый старт

### 1. Запуск PostgreSQL с Docker

```bash
# Запуск базы данных
docker-compose up -d

# Проверка статуса
docker-compose ps
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне backend директории:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dnd
DB_USER=postgres
DB_PASSWORD=tmp

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

### 3. Установка зависимостей

```bash
npm install
```

### 4. Сборка проекта

```bash
npm run build
```

### 5. Тестирование базы данных

```bash
npm run test-db
```

### 6. Запуск сервера

```bash
# Режим разработки
npm run dev

# Продакшн режим
npm start
```

## Структура базы данных

### Таблицы
- **users** - Пользователи системы
- **games** - Игры
- **players** - Игроки в играх (связующая таблица)
- **characters** - Персонажи игроков
- **worlds** - Миры игр
- **game_logs** - Логи игровых событий

### Автоматическая синхронизация
При запуске сервера база данных автоматически синхронизируется с моделями Sequelize.

## API Endpoints

### Создание игры
```bash
POST /api/games
Content-Type: application/json

{
  "name": "Моя игра",
  "playerName": "Игрок1",
  "dmId": "uuid-мастера-игры"
}
```

### Присоединение к игре
```bash
POST /api/games/Моя игра/join
Content-Type: application/json

{
  "playerName": "Игрок2"
}
```

### Получение списка игр
```bash
GET /api/games
```

### Получение состояния игры
```bash
GET /api/games/:gameId
```

## WebSocket Events

### Подключение к игре
```javascript
// Аутентификация
socket.emit('authenticate', { userId: 'user-id' });

// Присоединение к игре
socket.emit('join_game', { gameName: 'Моя игра' });
```

### Игровые действия
```javascript
// Движение персонажа
socket.emit('move_character', { 
  gameId: 'game-id', 
  position: { x: 10, y: 15 } 
});

// Бросок кубика
socket.emit('roll_dice', { 
  gameId: 'game-id', 
  command: '2d6+3' 
});

// Взаимодействие с тайлом
socket.emit('interact_tile', { 
  gameId: 'game-id', 
  x: 10, y: 15, 
  action: 'examine' 
});
```

## Устранение неполадок

### Ошибка подключения к базе данных
1. Проверьте, что PostgreSQL запущен: `docker-compose ps`
2. Проверьте настройки в `.env` файле
3. Попробуйте перезапустить контейнер: `docker-compose restart`

### Ошибка синхронизации моделей
1. Убедитесь, что база данных создана
2. Проверьте права доступа пользователя
3. Попробуйте удалить и пересоздать контейнер: `docker-compose down && docker-compose up -d`

### Ошибки в логах
Проверьте логи сервера для получения подробной информации об ошибках. 