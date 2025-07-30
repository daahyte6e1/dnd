const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Получение списка игр (публичный доступ)
router.get('/', gameController.getGames);

// Получение информации об игре
router.get('/:gameId', gameController.getGame);

// Создание игры
router.post('/', gameController.createGame);

// Присоединение к игре по имени
router.post('/:gameName/join', gameController.joinGameByName);

// Создание персонажа
router.post('/:gameId/characters', gameController.createCharacter);

// Движение персонажа
router.post('/:gameId/move', gameController.moveCharacter);

// Бросок кубика
router.post('/:gameId/roll', gameController.rollDice);

// Взаимодействие с тайлом
router.post('/:gameId/interact', gameController.interactWithTile);

// Получение информации о тайле
router.get('/:gameId/tile/:x/:y', gameController.getTileInfo);

// Обновление состояния игры
router.put('/:gameId/state', gameController.updateGameState);

module.exports = router; 