import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

type CharacterClass = 'fighter' | 'wizard' | 'rogue' | 'cleric' | 'ranger' | 'barbarian' | 'bard' | 'druid' | 'monk' | 'paladin' | 'sorcerer' | 'warlock' | 'artificer';
type CharacterRace = 'human' | 'elf' | 'dwarf' | 'halfling' | 'dragonborn' | 'gnome' | 'half-elf' | 'half-orc' | 'tiefling' | 'aarakocra' | 'genasi' | 'goliath' | 'aasimar' | 'firbolg' | 'kenku' | 'lizardfolk' | 'tabaxi' | 'triton' | 'bugbear' | 'goblin' | 'hobgoblin' | 'kobold' | 'orc' | 'yuan-ti';
type Background = 'acolyte' | 'criminal' | 'folk-hero' | 'noble' | 'sage' | 'soldier' | 'urchin' | 'artisan' | 'entertainer' | 'guild-artisan' | 'hermit' | 'outlander' | 'pirate' | 'sailor';

interface CharacterAttributes {
  id: string;
  playerId: string;
  name: string;
  characterClass: CharacterClass;
  level: number;
  race: CharacterRace;
  background: Background;
  alignment: string;
  experience: number;
  
  // Характеристики
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  
  // Модификаторы характеристик
  statModifiers: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  
  // Броски спасения
  savingThrows: {
    strength: boolean;
    dexterity: boolean;
    constitution: boolean;
    intelligence: boolean;
    wisdom: boolean;
    charisma: boolean;
  };
  
  // Навыки
  skills: {
    acrobatics: boolean;
    animalHandling: boolean;
    arcana: boolean;
    athletics: boolean;
    deception: boolean;
    history: boolean;
    insight: boolean;
    intimidation: boolean;
    investigation: boolean;
    medicine: boolean;
    nature: boolean;
    perception: boolean;
    performance: boolean;
    persuasion: boolean;
    religion: boolean;
    sleightOfHand: boolean;
    stealth: boolean;
    survival: boolean;
  };
  
  // Детальная информация о навыках
  skillsInfo: {
    [key: string]: {
      name: string;
      ability: string;
      source: string;
    };
  };
  
  // HP и AC
  hp: number;
  maxHp: number;
  tempHp: number;
  armorClass: number;
  
  // Инициатива и скорость
  initiative: number;
  speed: number;
  
  // Инвентарь и снаряжение
  inventory: any[];
  equipment: any[];
  weapons: any[];
  armor: any[];
  
  // Снаряжение
  startingEquipment: any[];
  
  // Особенности расы и класса
  racialTraits: any[];
  classFeatures: any[];
  
  // Заклинания (для магических классов)
  spells: {
    cantrips: any[];
    level1: any[];
    level2: any[];
    level3: any[];
    level4: any[];
    level5: any[];
    level6: any[];
    level7: any[];
    level8: any[];
    level9: any[];
  };
  
  // Языки
  languages: string[];
  
  // Инструменты и владения
  toolProficiencies: string[];
  weaponProficiencies: string[];
  armorProficiencies: string[];
  
  // Внешность
  appearance: {
    age: number;
    height: string;
    weight: string;
    eyes: string;
    skin: string;
    hair: string;
  };
  
  // Личность
  personality: {
    traits: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  
  // История
  backstory: string;
  
  // Позиция в игре
  position: { x: number; y: number };
  isAlive: boolean;
  
  // Валюты
  money: {
    copper: number;
    silver: number;
    electrum: number;
    gold: number;
    platinum: number;
  };
  
  createdAt?: Date;
  updatedAt?: Date;
}

interface CharacterCreationAttributes extends Optional<CharacterAttributes, 'id' | 'level' | 'stats' | 'statModifiers' | 'savingThrows' | 'skills' | 'skillsInfo' | 'hp' | 'maxHp' | 'tempHp' | 'armorClass' | 'initiative' | 'speed' | 'inventory' | 'equipment' | 'weapons' | 'armor' | 'startingEquipment' | 'racialTraits' | 'classFeatures' | 'spells' | 'languages' | 'toolProficiencies' | 'weaponProficiencies' | 'armorProficiencies' | 'appearance' | 'personality' | 'backstory' | 'position' | 'isAlive' | 'money' | 'createdAt' | 'updatedAt'> {}

interface CharacterInstance extends Model<CharacterAttributes, CharacterCreationAttributes>, CharacterAttributes {}

const Character = sequelize.define<CharacterInstance>('Character', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  playerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  characterClass: {
    type: DataTypes.ENUM('fighter', 'wizard', 'rogue', 'cleric', 'ranger', 'barbarian', 'bard', 'druid', 'monk', 'paladin', 'sorcerer', 'warlock', 'artificer'),
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 20
    }
  },
  race: {
    type: DataTypes.ENUM('human', 'elf', 'dwarf', 'halfling', 'dragonborn', 'gnome', 'half-elf', 'half-orc', 'tiefling', 'aarakocra', 'genasi', 'goliath', 'aasimar', 'firbolg', 'kenku', 'lizardfolk', 'tabaxi', 'triton', 'bugbear', 'goblin', 'hobgoblin', 'kobold', 'orc', 'yuan-ti'),
    allowNull: true
  },
  background: {
    type: DataTypes.ENUM('acolyte', 'criminal', 'folk-hero', 'noble', 'sage', 'soldier', 'urchin', 'artisan', 'entertainer', 'guild-artisan', 'hermit', 'outlander', 'pirate', 'sailor'),
    allowNull: true
  },
  alignment: {
    type: DataTypes.STRING,
    defaultValue: 'Neutral'
  },
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }
  },
  statModifiers: {
    type: DataTypes.JSON,
    defaultValue: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    }
  },
  savingThrows: {
    type: DataTypes.JSON,
    defaultValue: {
      strength: false,
      dexterity: false,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false
    }
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: {
      acrobatics: false,
      animalHandling: false,
      arcana: false,
      athletics: false,
      deception: false,
      history: false,
      insight: false,
      intimidation: false,
      investigation: false,
      medicine: false,
      nature: false,
      perception: false,
      performance: false,
      persuasion: false,
      religion: false,
      sleightOfHand: false,
      stealth: false,
      survival: false
    }
  },
  skillsInfo: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  hp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  maxHp: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  tempHp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  armorClass: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  initiative: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  speed: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  inventory: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  equipment: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  weapons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  armor: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  startingEquipment: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  racialTraits: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  classFeatures: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  spells: {
    type: DataTypes.JSON,
    defaultValue: {
      cantrips: [],
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      level6: [],
      level7: [],
      level8: [],
      level9: []
    }
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: ['Common']
  },
  toolProficiencies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  weaponProficiencies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  armorProficiencies: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  appearance: {
    type: DataTypes.JSON,
    defaultValue: {
      age: 20,
      height: '',
      weight: '',
      eyes: '',
      skin: '',
      hair: ''
    }
  },
  personality: {
    type: DataTypes.JSON,
    defaultValue: {
      traits: [],
      ideals: [],
      bonds: [],
      flaws: []
    }
  },
  backstory: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  position: {
    type: DataTypes.JSON,
    defaultValue: { x: 0, y: 0 }
  },
  isAlive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  money: {
    type: DataTypes.JSON,
    defaultValue: {
      copper: 0,
      silver: 0,
      electrum: 0,
      gold: 0,
      platinum: 0
    }
  }
}, {
  timestamps: true
});

export default Character; 