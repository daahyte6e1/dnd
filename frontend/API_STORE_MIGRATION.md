# Миграция на Zustand API Store

## Обзор изменений

Старый `apiClient` был заменен на новый Zustand-based API store (`useApiStore`), который предоставляет более современный и реактивный подход к управлению API запросами.

## Основные преимущества

1. **Централизованное управление состоянием** - все API запросы и их состояние управляются через Zustand
2. **Автоматическое управление токенами** - токены сохраняются и очищаются автоматически
3. **Встроенная обработка ошибок** - ошибки API автоматически сохраняются в состоянии
4. **Индикаторы загрузки** - состояние загрузки доступно глобально
5. **Типизация TypeScript** - полная типизация всех методов и состояний

## Структура API Store

### Состояние
- `baseURL` - базовый URL для API
- `token` - текущий токен аутентификации
- `isLoading` - состояние загрузки
- `error` - текущая ошибка API

### Основные методы

#### Аутентификация
- `register(userData)` - регистрация пользователя
- `login(credentials)` - вход с логином/паролем
- `loginByUsername(username)` - вход по имени пользователя
- `registerOrLoginByUsername(username)` - регистрация или вход по имени
- `getProfile()` - получение профиля пользователя
- `logout()` - выход из системы

#### Пользователи
- `getUser(userId)` - получение пользователя по ID
- `updateUser(userId, userData)` - обновление пользователя

#### Персонажи
- `getUserCharacters(userId)` - получение персонажей пользователя
- `createClassicCharacter(userId, characterData)` - создание классического персонажа
- `createDnDCharacter(userId, characterData)` - создание D&D персонажа
- `getCharacter(characterId)` - получение персонажа по ID
- `updateCharacter(characterId, characterData)` - обновление персонажа
- `deleteCharacter(userId, characterId)` - удаление персонажа
- `getCharacterCreationData()` - данные для создания персонажа
- `rollAbilityScores(data)` - генерация характеристик

#### Игры
- `getGames()` - получение списка игр
- `getGame(gameId)` - получение игры по ID
- `createGame(gameData)` - создание игры
- `joinGame(gameName, playerData)` - присоединение к игре
- `updateGameState(gameId, gameState)` - обновление состояния игры

## Использование

### Базовое использование
```typescript
import { useApiStore } from '../infrastructure/store';

const MyComponent = () => {
  const { getProfile, isLoading, error } = useApiStore();
  
  const loadProfile = async () => {
    try {
      const profile = await getProfile();
      console.log(profile);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  
  return (
    <div>
      {isLoading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error}</div>}
      <button onClick={loadProfile}>Загрузить профиль</button>
    </div>
  );
};
```

### Доступ к состоянию
```typescript
const { isLoading, error, token } = useApiStore();
```

### Управление токенами
```typescript
const { setToken, clearToken } = useApiStore();

// Установка токена
setToken('your-jwt-token');

// Очистка токена
clearToken();
```

## Миграция с старого apiClient

### Было:
```typescript
import apiClient from '../infrastructure/api/apiClient';

const response = await apiClient.getProfile();
```

### Стало:
```typescript
import { useApiStore } from '../infrastructure/store';

const { getProfile } = useApiStore();
const response = await getProfile();
```

## Обновленные файлы

1. `frontend/src/infrastructure/store/apiStore.ts` - новый API store
2. `frontend/src/infrastructure/store/authStore.tsx` - обновлен для использования API store
3. `frontend/src/presentation/pages/ProfilePage.tsx` - обновлен
4. `frontend/src/presentation/pages/LobbyPage.tsx` - обновлен
5. `frontend/src/presentation/components/CharacterList.tsx` - обновлен
6. `frontend/src/presentation/components/CharacterCreationWizard.tsx` - обновлен
7. `frontend/src/infrastructure/store/index.ts` - экспорты всех сторов

## Удаленные файлы

- `frontend/src/infrastructure/api/apiClient.ts` - заменен на API store

## Совместимость

Все существующие API методы сохранены с теми же сигнатурами, поэтому миграция должна быть прозрачной для остального кода. 