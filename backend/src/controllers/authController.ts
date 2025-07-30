import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from '../models';

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Регистрация пользователя
const register = async (req: Request<{}, {}, RegisterRequest>, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Пользователь с таким email или username уже существует' });
      return;
    }

    // Создаем нового пользователя
    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
};

// Вход пользователя
const login = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      res.status(401).json({ error: 'Неверный email или пароль' });
      return;
    }

    // Проверяем пароль
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Неверный email или пароль' });
      return;
    }

    const token = generateToken(user);

    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
};

// Вход по username (без пароля)
const loginByUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username } = req.body;
    if (!username) {
      res.status(400).json({ error: 'Не передан username' });
      return;
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
      return;
    }
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Ошибка входа по username:', error);
    res.status(500).json({ error: 'Ошибка при входе по username' });
  }
};

// Получение профиля пользователя
const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Пользователь не авторизован' });
      return;
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
};

// Автоматическая регистрация пользователя по username (если не существует)
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

export {
  register,
  login,
  getProfile,
  loginByUsername,
  registerOrLoginByUsername
}; 