import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Создаем общее хранилище игр
const games = new Map();
const players = new Map();

// Создаем GameService с общим хранилищем
import GameService from './services/GameService';
const gameService = new GameService();
gameService.setGamesStorage(games);
gameService.setPlayersStorage(players);

// Инициализация WebSocket сервиса
import WebSocketService from './services/WebSocketService';
const webSocketService = new WebSocketService(server);
webSocketService.setGameService(gameService);

// Экспортируем для доступа из других модулей
declare global {
  var webSocketService: WebSocketService;
  var gameService: GameService;
  var games: Map<string, any>;
  var players: Map<string, any>;
}

global.webSocketService = webSocketService;
global.gameService = gameService;
global.games = games;
global.players = players;

console.log('🚀 Инициализация сервисов завершена');
console.log('📋 Размер внешнего хранилища игр:', games.size);
console.log('🔍 Внешнее хранилище игр доступно:', !!games);

// Подключаем маршруты
import authRoutes from './routes/auth';
import gameRoutes from './routes/games';

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Базовый route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'DnD Backend API работает!' });
});

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    // Запускаем сервер
    server.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`WebSocket сервер готов к подключениям`);
      console.log(`API доступен по адресу: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

startServer(); 