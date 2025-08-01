import express from 'express';
import gameController from '../controllers/gameController';

const router = express.Router();

// Создание игры
router.post('/', gameController.createGame);

// Получение всех игр
router.get('/', gameController.getGames);

// Получение конкретной игры
router.get('/:gameId', gameController.getGame);

// Присоединение к игре по имени
router.post('/:gameName/join', gameController.joinGameByName);

// Создание персонажа
router.post('/:gameId/characters', gameController.createCharacter);

// Создание классического персонажа
router.post('/user/:userId/characters', gameController.createClassicCharacter);

// Создание персонажа по правилам D&D 5e
router.post('/user/:userId/dnd-character', gameController.createDnDCharacter);

// Получение данных для создания персонажа
router.get('/character-creation/data', gameController.getCharacterCreationData);

// Генерация случайных характеристик
router.post('/character-creation/roll-abilities', gameController.rollAbilityScores);

// Новые маршруты для работы с навыками
// Валидация выбора навыков
router.post('/character-creation/validate-skills', gameController.validateSkillChoices);

// Получение доступных навыков класса
router.get('/character-creation/available-skills', gameController.getAvailableClassSkills);

// Получение рекомендаций по навыкам
router.get('/character-creation/skill-recommendations', gameController.getSkillRecommendations);

// Получение персонажа по ID
router.get('/characters/:characterId', gameController.getCharacter);

// Обновление персонажа
router.put('/characters/:characterId', gameController.updateCharacter);

// Получение персонажей пользователя
router.get('/user/:userId/characters', gameController.getUserCharacters);

// Удаление персонажа
router.delete('/user/:userId/characters/:characterId', gameController.deleteCharacter);

// Движение персонажа
router.post('/:gameId/move', gameController.moveCharacter);

// Бросок костей
router.post('/:gameId/roll', gameController.rollDice);

// Взаимодействие с тайлом
router.post('/:gameId/interact', gameController.interactWithTile);

// Получение информации о тайле
router.get('/:gameId/tile/:x/:y', gameController.getTileInfo);

// Обновление состояния игры
router.put('/:gameId/state', gameController.updateGameState);

export default router; 