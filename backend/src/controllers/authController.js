const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Регистрация пользователя
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email или username уже существует' });
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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
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

// Получение профиля пользователя
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
};

module.exports = {
  register,
  login,
  getProfile
}; 