export interface CharacterCreationStepProps {
  characterData: any;
  setCharacterData: (data: any) => void;
  creationData: any;
  validationErrors: { [key: string]: string };
  availableSkills: string[];
  setAvailableSkills: (skills: string[]) => void;
  requiredSkillChoices: number;
  setRequiredSkillChoices: (choices: number) => void;
}

export interface CharacterCreationData {
  races: { [key: string]: any };
  classes: { [key: string]: any };
  backgrounds: { [key: string]: any };
  skills: { [key: string]: any };
}

export interface CharacterData {
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

// Константы для валидации
export const ABILITY_NAMES = ['Сила', 'Ловкость', 'Телосложение', 'Интеллект', 'Мудрость', 'Харизма'];
export const ABILITY_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']; 