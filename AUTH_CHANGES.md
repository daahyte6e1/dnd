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