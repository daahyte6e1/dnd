import express from 'express';
import * as authController from '../controllers/authController';
import auth from '../middleware/auth';

const router = express.Router();

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Вход по username (без пароля)
router.post('/login-by-username', authController.loginByUsername);

// Получение профиля (требует аутентификации)
router.get('/profile', auth, authController.getProfile);

export default router; 