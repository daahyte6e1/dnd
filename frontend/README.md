# DND Frontend

Фронтенд приложение для проекта DND с архитектурой DDD (Domain-Driven Design).

## Архитектура

### Структура папок (DDD):

```
src/
├── domain/           # Доменная логика
│   ├── entities/     # Бизнес-сущности
│   ├── repositories/ # Интерфейсы репозиториев
│   └── services/     # Доменные сервисы
├── application/      # Слой приложения
│   ├── use-cases/    # Сценарии использования
│   └── services/     # Сервисы приложения
├── infrastructure/   # Инфраструктурный слой
│   ├── api/          # API клиенты
│   ├── websocket/    # WebSocket клиент
│   ├── store/        # Zustand store
│   └── game/         # Phaser конфигурация
└── presentation/     # Слой представления
    ├── components/   # React компоненты
    ├── pages/        # Страницы
    └── hooks/        # React хуки
```

## Технологии

- **React + Vite** - Основной фреймворк
- **Zustand** - Управление состоянием
- **MUI** - UI компоненты
- **Phaser** - Игровой движок
- **WebSocket** - Реальное время

## Установка и запуск

```bash
npm install
npm run dev
```

## Основные компоненты

- `HomePage` - Главная страница с текстом "Проект DND начало"
- `useGameStore` - Zustand store для управления игровым состоянием
- `WebSocketClient` - Клиент для WebSocket соединений
- `phaserConfig` - Конфигурация Phaser игрового движка
