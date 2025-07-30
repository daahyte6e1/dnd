# DnD Backend

Backend для DnD приложения с использованием Node.js, Express, Socket.io и PostgreSQL.

## Установка и запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка базы данных

#### Вариант 1: Использование Docker (рекомендуется)
```bash
# Запуск PostgreSQL в Docker
docker-compose up -d

# Проверка статуса
docker-compose ps
```

#### Вариант 2: Локальная установка PostgreSQL
Установите PostgreSQL локально и создайте базу данных `dnd_db`.

### 3. Настройка переменных окружения
Создайте файл `.env` в корне backend директории:
```env
# Сервер
PORT=3000
NODE_ENV=development

# База данных
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dnd_db
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Запуск сервера

#### Режим разработки
```bash
npm run dev
```

#### Продакшн режим
```bash
npm start
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход пользователя
- `GET /api/auth/profile` - Получение профиля (требует токен)

### Игры
- `GET /api/games` - Получение списка активных игр
- `GET /api/games/:gameId` - Получение информации об игре
- `POST /api/games` - Создание новой игры (требует токен)
- `POST /api/games/:gameId/join` - Присоединение к игре (требует токен)
- `PUT /api/games/:gameId/state` - Обновление состояния игры (требует токен)

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
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── gameController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Game.js
│   │   ├── Player.js
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── games.js
│   └── server.js
├── package.json
└── README.md
``` 