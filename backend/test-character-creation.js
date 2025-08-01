const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testCharacterCreation() {
  try {
    console.log('🧪 Тестирование системы создания персонажа D&D 5e...\n');

    // 1. Получаем данные для создания персонажа
    console.log('1. Получение данных для создания персонажа...');
    const creationData = await axios.get(`${API_BASE}/games/character-creation/data`);
    console.log('✅ Данные получены:', Object.keys(creationData.data));
    console.log('   Расы:', Object.keys(creationData.data.races).length);
    console.log('   Классы:', Object.keys(creationData.data.classes).length);
    console.log('   Предыстории:', Object.keys(creationData.data.backgrounds).length);
    console.log('   Навыки:', Object.keys(creationData.data.skills).length);

    // 2. Генерируем случайные характеристики
    console.log('\n2. Генерация случайных характеристик...');
    const randomAbilityScores = await axios.post(`${API_BASE}/games/character-creation/roll-abilities`);
    console.log('✅ Случайные характеристики сгенерированы:', randomAbilityScores.data.scores);
    console.log('   Метод:', randomAbilityScores.data.method);

    // 3. Тестируем ручную настройку характеристик
    console.log('\n3. Тестирование ручной настройки характеристик...');
    const manualScores = [16, 14, 12, 10, 8, 6]; // Пример ручных характеристик
    const manualAbilityScores = await axios.post(`${API_BASE}/games/character-creation/roll-abilities`, {
      method: 'manual',
      scores: manualScores
    });
    console.log('✅ Ручные характеристики применены:', manualAbilityScores.data.scores);
    console.log('   Метод:', manualAbilityScores.data.method);

    // 4. Тестируем валидацию характеристик
    console.log('\n4. Тестирование валидации характеристик...');
    const validScores = [18, 16, 14, 12, 10, 8];
    const validationResult = await axios.post(`${API_BASE}/games/character-creation/validate-abilities`, {
      scores: validScores
    });
    console.log('✅ Валидация пройдена:', validationResult.data.valid);
    console.log('   Модификаторы:', validationResult.data.modifiers);
    console.log('   Общий модификатор:', validationResult.data.totalModifier);

    // 5. Тестируем неверные характеристики
    console.log('\n5. Тестирование неверных характеристик...');
    try {
      const invalidScores = [20, 16, 14, 12, 10, 8]; // 20 > 18
      await axios.post(`${API_BASE}/games/character-creation/validate-abilities`, {
        scores: invalidScores
      });
    } catch (error) {
      console.log('✅ Ошибка валидации поймана:', error.response.data.error);
    }

    // 6. Создаем тестового пользователя
    console.log('\n6. Создание тестового пользователя...');
    const userResponse = await axios.post(`${API_BASE}/auth/register-or-login`, {
      username: 'testuser_' + Date.now()
    });
    const userId = userResponse.data.user.id;
    console.log('✅ Пользователь создан:', userId);

    // 7. Создаем персонажа с ручными характеристиками
    console.log('\n7. Создание персонажа с ручными характеристиками...');
    const characterData = {
      name: 'Тестовый Герой (Ручные)',
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
      backstory: 'Тестовый персонаж с ручными характеристиками.'
    };

    const characterResponse = await axios.post(`${API_BASE}/games/user/${userId}/dnd-character`, characterData);
    console.log('✅ Персонаж с ручными характеристиками создан:', characterResponse.data.character.name);
    console.log('   Класс:', characterResponse.data.character.characterClass);
    console.log('   Раса:', characterResponse.data.character.race);
    console.log('   Уровень:', characterResponse.data.character.level);
    console.log('   HP:', characterResponse.data.character.hp);
    console.log('   Характеристики:', characterResponse.data.character.stats);

    // 8. Создаем персонажа со случайными характеристиками
    console.log('\n8. Создание персонажа со случайными характеристиками...');
    const randomCharacterData = {
      name: 'Тестовый Герой (Случайные)',
      race: 'elf',
      characterClass: 'wizard',
      background: 'sage',
      abilityScores: randomAbilityScores.data.scores,
      skillChoices: ['arcana', 'history'],
      alignment: 'Neutral Good',
      appearance: {
        age: 120,
        height: '170 см',
        weight: '60 кг',
        eyes: 'Зеленые',
        skin: 'Бледная',
        hair: 'Серебристые'
      },
      personality: {
        traits: ['Любознательный', 'Мудрый'],
        ideals: ['Знание'],
        bonds: ['Древние тексты'],
        flaws: ['Слишком теоретический']
      },
      backstory: 'Тестовый персонаж со случайными характеристиками.'
    };

    const randomCharacterResponse = await axios.post(`${API_BASE}/games/user/${userId}/dnd-character`, randomCharacterData);
    console.log('✅ Персонаж со случайными характеристиками создан:', randomCharacterResponse.data.character.name);
    console.log('   Класс:', randomCharacterResponse.data.character.characterClass);
    console.log('   Раса:', randomCharacterResponse.data.character.race);
    console.log('   Уровень:', randomCharacterResponse.data.character.level);
    console.log('   HP:', randomCharacterResponse.data.character.hp);
    console.log('   Характеристики:', randomCharacterResponse.data.character.stats);

    // 9. Получаем список персонажей пользователя
    console.log('\n9. Получение списка персонажей...');
    const charactersResponse = await axios.get(`${API_BASE}/games/user/${userId}/characters`);
    console.log('✅ Персонажей найдено:', charactersResponse.data.characters.length);

    console.log('\n🎉 Все тесты прошли успешно!');
    console.log('\n📊 Статистика созданных персонажей:');
    
    // Персонаж с ручными характеристиками
    console.log('\n👤 Персонаж с ручными характеристиками:');
    console.log('   Имя:', characterResponse.data.character.name);
    console.log('   Раса:', creationData.data.races[characterResponse.data.character.race].name);
    console.log('   Класс:', creationData.data.classes[characterResponse.data.character.characterClass].name);
    console.log('   Предыстория:', creationData.data.backgrounds[characterResponse.data.character.background].name);
    console.log('   Мировоззрение:', characterResponse.data.character.alignment);
    console.log('   HP:', characterResponse.data.character.hp);
    console.log('   Класс брони:', characterResponse.data.character.armorClass);
    console.log('   Скорость:', characterResponse.data.character.speed);
    console.log('   Характеристики:', characterResponse.data.character.stats);

    // Персонаж со случайными характеристиками
    console.log('\n🎲 Персонаж со случайными характеристиками:');
    console.log('   Имя:', randomCharacterResponse.data.character.name);
    console.log('   Раса:', creationData.data.races[randomCharacterResponse.data.character.race].name);
    console.log('   Класс:', creationData.data.classes[randomCharacterResponse.data.character.characterClass].name);
    console.log('   Предыстория:', creationData.data.backgrounds[randomCharacterResponse.data.character.background].name);
    console.log('   Мировоззрение:', randomCharacterResponse.data.character.alignment);
    console.log('   HP:', randomCharacterResponse.data.character.hp);
    console.log('   Класс брони:', randomCharacterResponse.data.character.armorClass);
    console.log('   Скорость:', randomCharacterResponse.data.character.speed);
    console.log('   Характеристики:', randomCharacterResponse.data.character.stats);

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.response?.data || error.message);
  }
}

testCharacterCreation(); 