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
  origin: ["http://localhost:5174", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Инициализация базы данных
import { sequelize, testConnection } from './config/database';
import { syncDatabase } from './models';

// Создаем GameService
import GameService from './services/GameService';
const gameService = new GameService();

// Инициализация WebSocket сервиса
import WebSocketService from './services/WebSocketService';
const webSocketService = new WebSocketService(server);
webSocketService.setGameService(gameService);

// Экспортируем для доступа из других модулей
declare global {
  var webSocketService: WebSocketService;
  var gameService: GameService;
}

global.webSocketService = webSocketService;
global.gameService = gameService;

console.log('🚀 Инициализация сервисов завершена');

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
    // Тестируем подключение к базе данных
    await testConnection();
    
    // Синхронизируем базу данных
    await syncDatabase();
    
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