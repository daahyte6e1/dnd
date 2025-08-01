# Компоненты создания персонажа

Этот модуль содержит компоненты для пошагового создания персонажа D&D 5e.

## Структура

```
character-creation/
├── index.ts                    # Экспорт всех компонентов
├── types.ts                    # Общие типы и интерфейсы
├── RaceSelectionStep.tsx       # Выбор расы
├── ClassSelectionStep.tsx      # Выбор класса
├── AbilityScoresStep.tsx       # Распределение характеристик
├── BackgroundSelectionStep.tsx  # Выбор предыстории
├── SkillsSelectionStep.tsx      # Выбор навыков
├── EquipmentStep.tsx           # Просмотр снаряжения
├── PersonalityStep.tsx         # Личность и внешность
├── CharacterSummaryStep.tsx    # Итоговый просмотр
└── README.md                   # Документация
```

## Компоненты

### RaceSelectionStep
Компонент для выбора расы персонажа. Отображает:
- Список доступных рас
- Описание выбранной расы
- Бонусы к характеристикам
- Особенности расы

### ClassSelectionStep
Компонент для выбора класса персонажа. Отображает:
- Список доступных классов
- Описание выбранного класса
- Владения оружием и доспехами
- Особенности класса

### AbilityScoresStep
Компонент для распределения характеристик. Поддерживает:
- Фиксированное распределение (15, 14, 13, 12, 10, 8)
- Случайную генерацию (4d6)
- Валидацию распределения
- Советы по распределению

### BackgroundSelectionStep
Компонент для выбора предыстории. Отображает:
- Список доступных предысторий
- Навыки от предыстории
- Дополнительные языки

### SkillsSelectionStep
Компонент для выбора навыков. Включает:
- Динамическое обновление доступных навыков
- Рекомендации по навыкам
- Валидацию количества выбранных навыков
- Интеграцию с API для получения навыков

### EquipmentStep
Компонент для просмотра снаряжения. Показывает:
- Снаряжение от класса
- Снаряжение от предыстории
- Информацию о автоматическом добавлении

### PersonalityStep
Компонент для настройки личности. Включает:
- Ввод имени персонажа
- Выбор мировоззрения
- Настройку внешности (возраст, рост, вес, цвет глаз/кожи/волос)
- Поле для истории персонажа

### CharacterSummaryStep
Компонент для итогового просмотра. Отображает:
- Полную информацию о персонаже
- Характеристики с модификаторами
- Выбранные навыки
- Возможность проверки перед созданием

## Общие типы

### CharacterCreationStepProps
Интерфейс для всех компонентов шагов создания персонажа:
```typescript
interface CharacterCreationStepProps {
  characterData: any;
  setCharacterData: (data: any) => void;
  creationData: any;
  validationErrors: { [key: string]: string };
  availableSkills: string[];
  setAvailableSkills: (skills: string[]) => void;
  requiredSkillChoices: number;
  setRequiredSkillChoices: (choices: number) => void;
}
```

### CharacterData
Интерфейс для данных персонажа:
```typescript
interface CharacterData {
  name: string;
  race: string;
  characterClass: string;
  background: string;
  alignment: string;
  abilityScores: number[];
  skillChoices: string[];
  appearance: {
    age: number;
    height: string;
    weight: string;
    eyes: string;
    skin: string;
    hair: string;
  };
  personality: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  backstory: string;
  abilityMethod: 'fixed' | 'random';
}
```

## Использование

```typescript
import {
  RaceSelectionStep,
  ClassSelectionStep,
  AbilityScoresStep,
  // ... другие компоненты
} from './character-creation';

// Использование в компоненте
const MyComponent = () => {
  return (
    <RaceSelectionStep
      characterData={characterData}
      setCharacterData={setCharacterData}
      creationData={creationData}
      validationErrors={validationErrors}
      availableSkills={availableSkills}
      setAvailableSkills={setAvailableSkills}
      requiredSkillChoices={requiredSkillChoices}
      setRequiredSkillChoices={setRequiredSkillChoices}
    />
  );
};
```

## Особенности

1. **Модульность**: Каждый компонент отвечает за одну конкретную функцию
2. **Переиспользование**: Общий интерфейс позволяет легко переиспользовать компоненты
3. **Типизация**: Полная типизация TypeScript для безопасности
4. **Валидация**: Встроенная валидация на каждом шаге
5. **API интеграция**: Поддержка внешних API для получения данных
6. **UX**: Интуитивный интерфейс с подсказками и рекомендациями 