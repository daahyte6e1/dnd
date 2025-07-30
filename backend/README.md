# DnD Backend

Backend для DnD приложения с использованием Node.js, Express, Socket.io и PostgreSQL.

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных PostgreSQL

#### Вариант 1: Использование Docker (рекомендуется)
```bash
# Создайте docker-compose.yml файл
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: dnd
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: tmp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

# Запуск PostgreSQL в Docker
docker-compose up -d

# Проверка статуса
docker-compose ps
```

#### Вариант 2: Локальная установка PostgreSQL
1. Установите PostgreSQL локально
2. Создайте базу данных `dnd`:
```sql
CREATE DATABASE dnd;
```

### 3. Настройка переменных окружения
Создайте файл `.env` в корне backend директории на основе `env.example`:
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

### 4. Запуск сервера

#### Режим разработки
```bash
npm run dev
```

#### Продакшн режим
```bash
npm run build
npm start
```

## База данных

### Модели данных
- **User** - Пользователи системы
- **Game** - Игры
- **Player** - Игроки в играх
- **Character** - Персонажи игроков
- **World** - Миры игр
- **GameLog** - Логи игровых событий

### Автоматическая синхронизация
При запуске сервера база данных автоматически синхронизируется с моделями Sequelize.

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/profile` - Получение профиля (требует токен)

### Игры
- `GET /api/games` - Получение списка активных игр
- `GET /api/games/:gameId` - Получение информации об игре
- `POST /api/games` - Создание новой игры (требует dmId)
- `POST /api/games/:gameName/join` - Присоединение к игре по имени
- `PUT /api/games/:gameId/state` - Обновление состояния игры

### Персонажи
- `POST /api/games/:gameId/characters` - Создание персонажа
- `PUT /api/games/:gameId/characters/move` - Движение персонажа

### Игровые действия
- `POST /api/games/:gameId/dice` - Бросок кубика
- `GET /api/games/:gameId/tiles/:x/:y` - Информация о тайле
- `POST /api/games/:gameId/tiles/interact` - Взаимодействие с тайлом

## WebSocket Events

### Клиент → Сервер
- `join-game` - Присоединение к комнате игры
- `leave-game` - Покидание комнаты игры
- `game-update` - Обновление состояния игры

### Сервер → Клиент
- `player-joined` - Игрок присоединился к игре
- `player-left` - Игрок покинул игру
- `game-state-updated` - Состояние игры обновлено

## Структура проекта

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── gameController.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Game.ts
│   │   ├── Player.ts
│   │   ├── Character.ts
│   │   ├── World.ts
│   │   ├── GameLog.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── games.ts
│   ├── services/
│   │   ├── GameService.ts
│   │   ├── DiceService.ts
│   │   ├── WorldGenerator.ts
│   │   └── WebSocketService.ts
│   └── server.ts
├── package.json
├── env.example
└── README.md
```

## Миграция данных

Все данные теперь хранятся в PostgreSQL базе данных. При первом запуске сервера:

1. База данных автоматически синхронизируется с моделями
2. Создаются все необходимые таблицы
3. Устанавливаются связи между таблицами

## Логирование

Сервер автоматически логирует:
- Подключение к базе данных
- Синхронизацию моделей
- Создание игр и присоединение игроков
- Ошибки и исключения 