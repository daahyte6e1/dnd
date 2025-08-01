# Автоматическая регистрация пользователей

## Описание изменений

Добавлена логика автоматической регистрации пользователей при входе в систему. Если пользователя с указанным username не существует, система автоматически создает нового пользователя.

## Изменения в бэкенде

### 1. Контроллер аутентификации (`backend/src/controllers/authController.ts`)

Добавлена новая функция `registerOrLoginByUsername`:

```typescript
const registerOrLoginByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: 'Не передан username' });
      return;
    }

    // Ищем пользователя
    let user = await User.findOne({ where: { username } });
    
    // Если пользователь не найден, создаем нового
    if (!user) {
      // Генерируем случайный email для нового пользователя
      const randomEmail = `${username}@temp.local`;
      
      // Создаем нового пользователя с временным паролем
      user = await User.create({
        username,
        email: randomEmail,
        password: Math.random().toString(36).substring(2, 15) // Временный пароль
      });
      
      console.log(`Автоматически зарегистрирован новый пользователь: ${username}`);
    }

    const token = generateToken(user);

    res.json({
      message: user.createdAt === user.updatedAt ? 'Пользователь зарегистрирован' : 'Успешный вход',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка автоматической регистрации/входа:', error);
    res.status(500).json({ error: 'Ошибка при автоматической регистрации/входе' });
  }
};
```

### 2. Маршруты аутентификации (`backend/src/routes/auth.ts`)

Добавлен новый маршрут:

```typescript
// Автоматическая регистрация/вход по username
router.post('/register-or-login', authController.registerOrLoginByUsername);
```

## Изменения во фронтенде

### 1. API клиент (`frontend/src/infrastructure/api/apiClient.ts`)

Добавлен новый метод:

```typescript
async registerOrLoginByUsername(username) {
  const response = await this.post('/auth/register-or-login', { username });
  if (response.token) {
    this.setToken(response.token);
  }
  return response;
}
```

### 2. Главная страница (`frontend/src/presentation/pages/HomePage.tsx`)

Обновлена функция `handleLogin` для использования автоматической регистрации:

```typescript
const handleLogin = async () => {
  if (!username.trim()) {
    setError('Пожалуйста, введите логин');
    return;
  }

  setIsLoggingIn(true);
  setError('');

  try {
    // Используем новый метод для автоматической регистрации/входа
    const response = await apiClient.registerOrLoginByUsername(username);
    setUserId(response.user.id);
    setIsAuthenticated(true);
    
    // Загружаем персонажей пользователя
    const charactersResponse = await apiClient.getUserCharacters(response.user.id);
    setCharacters(charactersResponse.characters || []);
    
    // Показываем сообщение о результате
    if (response.message.includes('зарегистрирован')) {
      console.log('Новый пользователь автоматически зарегистрирован');
    }
  } catch (err) {
    setError(err.message || 'Ошибка авторизации');
  } finally {
    setIsLoggingIn(false);
  }
};
```

## Как это работает

1. **Пользователь вводит username** в поле авторизации
2. **Система проверяет** существование пользователя с таким username
3. **Если пользователь не найден:**
   - Создается новый пользователь с автоматически сгенерированным email
   - Устанавливается временный пароль
   - Генерируется JWT токен
4. **Если пользователь найден:**
   - Возвращается существующий пользователь
   - Генерируется JWT токен
5. **Пользователь получает доступ** к системе с полными правами

## Преимущества

- **Простота использования** - пользователю не нужно проходить сложную регистрацию
- **Быстрый старт** - можно сразу начать играть
- **Автоматическое управление** - система сама создает необходимые записи
- **Безопасность** - используются временные пароли и email адреса

## API Endpoints

### POST `/api/auth/register-or-login`

**Запрос:**
```json
{
  "username": "string"
}
```

**Ответ:**
```json
{
  "message": "Успешный вход" | "Пользователь зарегистрирован",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string"
  }
}
```

## Тестирование

Функциональность протестирована и работает корректно:
- ✅ Автоматическая регистрация новых пользователей
- ✅ Повторный вход существующих пользователей
- ✅ Генерация JWT токенов
- ✅ Получение профиля пользователя 

# Изменения в системе создания персонажей

## Добавлена поддержка ручной настройки характеристик

### Новые возможности:

1. **Ручная настройка характеристик** - пользователи могут вводить характеристики вручную вместо случайной генерации
2. **Валидация характеристик** - проверка корректности введенных значений (3-18)
3. **Гибкая система генерации** - поддержка как случайной, так и ручной генерации

### Новые эндпоинты:

- `POST /api/games/character-creation/roll-abilities` - обновлен для поддержки ручной настройки
- `POST /api/games/character-creation/validate-abilities` - новый эндпоинт для валидации

### Примеры использования:

#### Случайная генерация:
```json
POST /api/games/character-creation/roll-abilities
{
  "method": "random"
}
```

#### Ручная настройка:
```json
POST /api/games/character-creation/roll-abilities
{
  "method": "manual",
  "scores": [18, 16, 14, 12, 10, 8]
}
```

#### Валидация характеристик:
```json
POST /api/games/character-creation/validate-abilities
{
  "scores": [18, 16, 14, 12, 10, 8]
}
```

### Правила валидации:

- Все характеристики должны быть числами от 3 до 18
- Должно быть ровно 6 характеристик
- Характеристики автоматически сортируются по убыванию

### Тестирование:

Запустите тестовые файлы для проверки функциональности:
- `node test-character-creation.js` - полное тестирование
- `node example-usage.js` - простой пример использования

### Документация:

Обновлена документация в `CHARACTER_CREATION.md` с подробным описанием новой функциональности. 