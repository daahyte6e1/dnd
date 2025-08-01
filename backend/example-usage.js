const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function exampleUsage() {
  console.log('📚 Пример использования системы ручной настройки характеристик\n');

  try {
    // 1. Случайная генерация характеристик
    console.log('🎲 1. Случайная генерация характеристик:');
    const randomResponse = await axios.post(`${API_BASE}/games/character-creation/roll-abilities`);
    console.log('   Результат:', randomResponse.data.scores);
    console.log('   Метод:', randomResponse.data.method);
    console.log();

    // 2. Ручная настройка характеристик
    console.log('✏️  2. Ручная настройка характеристик:');
    const manualScores = [18, 16, 14, 12, 10, 8];
    const manualResponse = await axios.post(`${API_BASE}/games/character-creation/roll-abilities`, {
      method: 'manual',
      scores: manualScores
    });
    console.log('   Введенные характеристики:', manualScores);
    console.log('   Результат:', manualResponse.data.scores);
    console.log('   Метод:', manualResponse.data.method);
    console.log();

    // 3. Валидация характеристик
    console.log('✅ 3. Валидация характеристик:');
    const validationResponse = await axios.post(`${API_BASE}/games/character-creation/validate-abilities`, {
      scores: manualScores
    });
    console.log('   Характеристики:', validationResponse.data.scores);
    console.log('   Модификаторы:', validationResponse.data.modifiers);
    console.log('   Общий модификатор:', validationResponse.data.totalModifier);
    console.log('   Валидны:', validationResponse.data.valid);
    console.log();

    // 4. Тест с неверными характеристиками
    console.log('❌ 4. Тест с неверными характеристиками:');
    try {
      const invalidScores = [20, 16, 14, 12, 10, 8]; // 20 > 18
      await axios.post(`${API_BASE}/games/character-creation/validate-abilities`, {
        scores: invalidScores
      });
    } catch (error) {
      console.log('   Ошибка:', error.response.data.error);
      console.log('   Детали:', error.response.data.invalidScores);
    }
    console.log();

    // 5. Создание пользователя и персонажа
    console.log('👤 5. Создание персонажа с ручными характеристиками:');
    
    // Создаем пользователя
    const userResponse = await axios.post(`${API_BASE}/auth/register-or-login`, {
      username: 'example_user_' + Date.now()
    });
    const userId = userResponse.data.user.id;
    console.log('   Пользователь создан:', userId);

    // Создаем персонажа
    const characterData = {
      name: 'Пример Персонажа',
      race: 'human',
      characterClass: 'fighter',
      background: 'soldier',
      abilityScores: manualScores,
      skillChoices: ['athletics', 'intimidation'],
      alignment: 'Lawful Good',
      appearance: {
        age: 25,
        height: '180 см',
        weight: '80 кг',
        eyes: 'Карие',
        skin: 'Светлая',
        hair: 'Темно-русые'
      },
      personality: {
        traits: ['Храбрый', 'Честный'],
        ideals: ['Защита слабых'],
        bonds: ['Верность команде'],
        flaws: ['Слишком доверчивый']
      },
      backstory: 'Пример персонажа с ручными характеристиками.'
    };

    const characterResponse = await axios.post(`${API_BASE}/games/user/${userId}/dnd-character`, characterData);
    console.log('   Персонаж создан:', characterResponse.data.character.name);
    console.log('   Класс:', characterResponse.data.character.characterClass);
    console.log('   Раса:', characterResponse.data.character.race);
    console.log('   HP:', characterResponse.data.character.hp);
    console.log('   Характеристики:', characterResponse.data.character.stats);

    console.log('\n🎉 Пример использования завершен успешно!');

  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

exampleUsage(); 