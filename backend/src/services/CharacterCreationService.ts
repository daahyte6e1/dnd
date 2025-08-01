import Character from '../models/Character';
import Player from '../models/Player';

// Константы для создания персонажа согласно D&D 5e Basic Rules
export const RACES = {
  human: {
    name: 'Человек',
    abilityScoreIncrease: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
    speed: 30,
    languages: ['Общий'],
    traits: ['Универсальность'],
    age: { maturity: 18, max: 80 },
    size: 'Средний',
    description: 'Люди - самая многочисленная раса в мире. Они известны своей адаптивностью и амбициями.'
  },
  elf: {
    name: 'Эльф',
    abilityScoreIncrease: { dexterity: 2 },
    speed: 30,
    languages: ['Общий', 'Эльфийский'],
    traits: ['Темное зрение', 'Острые чувства', 'Фейское происхождение', 'Транс'],
    age: { maturity: 100, max: 750 },
    size: 'Средний',
    description: 'Эльфы - бессмертные существа, связанные с природой и магией.'
  },
  dwarf: {
    name: 'Дварф',
    abilityScoreIncrease: { constitution: 2 },
    speed: 25,
    languages: ['Общий', 'Дварфийский'],
    traits: ['Темное зрение', 'Дварфийская стойкость', 'Дварфийская боевая подготовка', 'Каменное чутье'],
    age: { maturity: 50, max: 350 },
    size: 'Средний',
    description: 'Дварфы - крепкие и выносливые существа, известные своим мастерством в ремеслах.'
  },
  halfling: {
    name: 'Полурослик',
    abilityScoreIncrease: { dexterity: 2 },
    speed: 25,
    languages: ['Общий', 'Полуросличий'],
    traits: ['Удачливый', 'Храбрый', 'Полуросличья ловкость'],
    age: { maturity: 20, max: 150 },
    size: 'Маленький',
    description: 'Полурослики - маленькие, но храбрые существа, известные своей удачей.'
  },
  dragonborn: {
    name: 'Драконорожденный',
    abilityScoreIncrease: { strength: 2, charisma: 1 },
    speed: 30,
    languages: ['Общий', 'Драконий'],
    traits: ['Драконье происхождение', 'Дыхательное оружие', 'Сопротивление урону'],
    age: { maturity: 15, max: 80 },
    size: 'Средний',
    description: 'Драконорожденные - потомки драконов, обладающие их силой и харизмой.'
  },
  gnome: {
    name: 'Гном',
    abilityScoreIncrease: { intelligence: 2 },
    speed: 25,
    languages: ['Общий', 'Гномий'],
    traits: ['Темное зрение', 'Гномья хитрость'],
    age: { maturity: 40, max: 500 },
    size: 'Маленький',
    description: 'Гномы - маленькие, но умные существа, известные своей изобретательностью.'
  },
  'half-elf': {
    name: 'Полуэльф',
    abilityScoreIncrease: { charisma: 2, strength: 1, dexterity: 1 },
    speed: 30,
    languages: ['Общий', 'Эльфийский'],
    traits: ['Темное зрение', 'Фейское происхождение', 'Универсальность навыков'],
    age: { maturity: 20, max: 180 },
    size: 'Средний',
    description: 'Полуэльфы сочетают в себе лучшие качества людей и эльфов.'
  },
  'half-orc': {
    name: 'Полуорк',
    abilityScoreIncrease: { strength: 2, constitution: 1 },
    speed: 30,
    languages: ['Общий', 'Орчий'],
    traits: ['Темное зрение', 'Угрожающий', 'Неутомимая выносливость', 'Дикие атаки'],
    age: { maturity: 14, max: 75 },
    size: 'Средний',
    description: 'Полуорки - сильные и выносливые существа, известные своей яростью в бою.'
  },
  tiefling: {
    name: 'Тифлинг',
    abilityScoreIncrease: { intelligence: 1, charisma: 2 },
    speed: 30,
    languages: ['Общий', 'Адский'],
    traits: ['Темное зрение', 'Адское сопротивление', 'Адское наследие'],
    age: { maturity: 18, max: 100 },
    size: 'Средний',
    description: 'Тифлинги - потомки демонов, обладающие темной магией и харизмой.'
  }
};

export const CLASSES = {
  fighter: {
    name: 'Воин',
    hitDie: 10,
    primaryAbility: 'strength',
    savingThrowProficiencies: ['strength', 'constitution'],
    startingEquipment: ['кольчужная броня', 'воинское оружие', 'щит', 'арбалет', 'набор путешественника'],
    classFeatures: ['Боевой стиль', 'Второе дыхание'],
    skillChoices: 2,
    skills: ['акробатика', 'атлетика', 'история', 'проницательность', 'запугивание', 'восприятие', 'выживание'],
    description: 'Мастер военного дела, непревзойденный в использовании оружия и доспехов.',
    spellcasting: false,
    armorProficiencies: ['легкая', 'средняя', 'тяжелая', 'щиты'],
    weaponProficiencies: ['простое', 'воинское']
  },
  wizard: {
    name: 'Волшебник',
    hitDie: 6,
    primaryAbility: 'intelligence',
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    startingEquipment: ['боевой посох', 'компонентная сумка', 'набор ученого', 'книга заклинаний'],
    classFeatures: ['Заклинательство', 'Восстановление магии'],
    skillChoices: 2,
    skills: ['магия', 'история', 'проницательность', 'анализ', 'медицина', 'религия'],
    description: 'Ученый магического искусства, способный изменять структуру реальности.',
    spellcasting: true,
    armorProficiencies: [],
    weaponProficiencies: ['кинжалы', 'боевые посохи', 'дротики', 'пращи', 'легкие арбалеты']
  },
  rogue: {
    name: 'Разбойник',
    hitDie: 8,
    primaryAbility: 'dexterity',
    savingThrowProficiencies: ['dexterity', 'intelligence'],
    startingEquipment: ['рапира', 'короткий лук', 'набор взломщика', 'кожаная броня'],
    classFeatures: ['Скрытая атака', 'Воровской жаргон', 'Хитрое действие'],
    skillChoices: 4,
    skills: ['акробатика', 'атлетика', 'обман', 'проницательность', 'запугивание', 'анализ', 'восприятие', 'выступление', 'убеждение', 'ловкость рук', 'скрытность'],
    description: 'Ловкий и скрытный, специалист по скрытности и точным ударам.',
    spellcasting: false,
    armorProficiencies: ['легкая'],
    weaponProficiencies: ['простое', 'ручные арбалеты', 'длинные мечи', 'рапиры', 'короткие мечи']
  },
  cleric: {
    name: 'Жрец',
    hitDie: 8,
    primaryAbility: 'wisdom',
    savingThrowProficiencies: ['wisdom', 'charisma'],
    startingEquipment: ['булава', 'чешуйчатая броня', 'легкий арбалет', 'набор жреца'],
    classFeatures: ['Заклинательство', 'Божественная область'],
    skillChoices: 2,
    skills: ['история', 'проницательность', 'медицина', 'убеждение', 'религия'],
    description: 'Посредник между смертным миром и божественными силами.',
    spellcasting: true,
    armorProficiencies: ['легкая', 'средняя', 'щиты'],
    weaponProficiencies: ['простое']
  },
  ranger: {
    name: 'Следопыт',
    hitDie: 10,
    primaryAbility: 'dexterity',
    savingThrowProficiencies: ['strength', 'dexterity'],
    startingEquipment: ['чешуйчатая броня', 'воинское оружие', 'длинный лук', 'набор путешественника'],
    classFeatures: ['Избранный враг', 'Природный следопыт'],
    skillChoices: 3,
    skills: ['уход за животными', 'атлетика', 'проницательность', 'анализ', 'природа', 'восприятие', 'скрытность', 'выживание'],
    description: 'Охотник и следопыт, специалист по выживанию в дикой природе.',
    spellcasting: true,
    armorProficiencies: ['легкая', 'средняя', 'щиты'],
    weaponProficiencies: ['простое', 'воинское']
  },
  barbarian: {
    name: 'Варвар',
    hitDie: 12,
    primaryAbility: 'strength',
    savingThrowProficiencies: ['strength', 'constitution'],
    startingEquipment: ['великий топор', 'воинское оружие', 'набор путешественника', 'дротики'],
    classFeatures: ['Ярость', 'Защита без брони'],
    skillChoices: 2,
    skills: ['уход за животными', 'атлетика', 'запугивание', 'природа', 'восприятие', 'выживание'],
    description: 'Дикий воин первобытных земель, способный впадать в боевую ярость.',
    spellcasting: false,
    armorProficiencies: ['легкая', 'средняя', 'щиты'],
    weaponProficiencies: ['простое', 'воинское']
  },
  bard: {
    name: 'Бард',
    hitDie: 8,
    primaryAbility: 'charisma',
    savingThrowProficiencies: ['dexterity', 'charisma'],
    startingEquipment: ['рапира', 'набор дипломата', 'лютня'],
    classFeatures: ['Заклинательство', 'Вдохновение барда'],
    skillChoices: 3,
    skills: ['акробатика', 'уход за животными', 'магия', 'атлетика', 'обман', 'история', 'проницательность', 'запугивание', 'анализ', 'медицина', 'природа', 'восприятие', 'выступление', 'убеждение', 'религия', 'ловкость рук', 'скрытность', 'выживание'],
    description: 'Вдохновляющий музыкант, чья магия пробуждает чудеса из звуков.',
    spellcasting: true,
    armorProficiencies: ['легкая'],
    weaponProficiencies: ['простое', 'ручные арбалеты', 'длинные мечи', 'рапиры', 'короткие мечи']
  },
  druid: {
    name: 'Друид',
    hitDie: 8,
    primaryAbility: 'wisdom',
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    startingEquipment: ['деревянный щит', 'кривой меч', 'набор путешественника'],
    classFeatures: ['Заклинательство', 'Друидский язык', 'Дикий облик'],
    skillChoices: 2,
    skills: ['магия', 'уход за животными', 'проницательность', 'медицина', 'природа', 'восприятие', 'религия', 'выживание'],
    description: 'Хранитель природы, способный принимать облик животных.',
    spellcasting: true,
    armorProficiencies: ['легкая', 'средняя', 'щиты'],
    weaponProficiencies: ['дубины', 'кинжалы', 'дротики', 'дротики', 'булавы', 'боевые посохи', 'кривые мечи', 'серпы', 'пращи', 'копья']
  },
  monk: {
    name: 'Монах',
    hitDie: 8,
    primaryAbility: 'dexterity',
    savingThrowProficiencies: ['strength', 'dexterity'],
    startingEquipment: ['короткий меч', 'набор подземельщика'],
    classFeatures: ['Защита без брони', 'Боевые искусства'],
    skillChoices: 2,
    skills: ['акробатика', 'атлетика', 'история', 'проницательность', 'религия', 'скрытность'],
    description: 'Мастер боевых искусств, использующий внутреннюю энергию.',
    spellcasting: false,
    armorProficiencies: [],
    weaponProficiencies: ['простое', 'короткие мечи']
  },
  paladin: {
    name: 'Паладин',
    hitDie: 10,
    primaryAbility: 'strength',
    savingThrowProficiencies: ['wisdom', 'charisma'],
    startingEquipment: ['воинское оружие', 'щит', 'дротики', 'набор жреца'],
    classFeatures: ['Божественное чувство', 'Возложение рук'],
    skillChoices: 2,
    skills: ['атлетика', 'проницательность', 'запугивание', 'медицина', 'убеждение', 'религия'],
    description: 'Святой воин, связанный клятвой защищать справедливость и добро.',
    spellcasting: true,
    armorProficiencies: ['легкая', 'средняя', 'тяжелая', 'щиты'],
    weaponProficiencies: ['простое', 'воинское']
  },
  sorcerer: {
    name: 'Чародей',
    hitDie: 6,
    primaryAbility: 'charisma',
    savingThrowProficiencies: ['constitution', 'charisma'],
    startingEquipment: ['легкий арбалет', 'компонентная сумка', 'набор подземельщика'],
    classFeatures: ['Заклинательство', 'Чародейское происхождение'],
    skillChoices: 2,
    skills: ['магия', 'обман', 'проницательность', 'запугивание', 'убеждение', 'религия'],
    description: 'Обладатель врожденной магической силы, полученной от драконьей крови или других источников.',
    spellcasting: true,
    armorProficiencies: [],
    weaponProficiencies: ['кинжалы', 'боевые посохи', 'дротики', 'пращи', 'легкие арбалеты']
  },
  warlock: {
    name: 'Колдун',
    hitDie: 8,
    primaryAbility: 'charisma',
    savingThrowProficiencies: ['wisdom', 'charisma'],
    startingEquipment: ['легкий арбалет', 'компонентная сумка', 'набор ученого'],
    classFeatures: ['Заклинательство', 'Пактовая магия'],
    skillChoices: 2,
    skills: ['магия', 'обман', 'история', 'запугивание', 'анализ', 'природа', 'религия'],
    description: 'Заклинатель, заключивший пакт с потусторонним существом.',
    spellcasting: true,
    armorProficiencies: ['легкая'],
    weaponProficiencies: ['простое']
  }
};

export const BACKGROUNDS = {
  acolyte: {
    name: 'Послушник',
    skillProficiencies: ['проницательность', 'религия'],
    languages: 2,
    equipment: ['святой символ', 'молитвенная книга', 'ладан', 'облачения', 'обычная одежда', '15 золотых'],
    description: 'Вы провели свою жизнь в служении храму определенного бога или пантеона богов.',
    personalityTraits: [
      'Я использую жаргон и архаичные выражения.',
      'Я много и часто говорю.',
      'Я был тихим ребенком, который редко говорил.',
      'Я слышу голоса, которые никто другой не слышит.',
      'Я не могу лгать.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.'
    ],
    ideals: [
      'Традиция. Древние традиции поклонения и жертвоприношений должны быть сохранены и соблюдены.',
      'Добро. Я стремлюсь помочь нуждающимся.',
      'Изменение. Мы должны помочь принести изменения, которые боги постоянно творят в мире.',
      'Власть. Я надеюсь однажды подняться до высших позиций в иерархии моего храма.'
    ],
    bonds: [
      'Я хотел бы однажды вернуться в храм моего детства и служить там.',
      'Я работаю, чтобы сохранить священный текст, который мои враги считают еретическим и стремятся уничтожить.',
      'Я обязан своей жизнью священнику, который взял меня, когда мои родители умерли.',
      'Ничто не может поколебать мою веру в моего бога.'
    ],
    flaws: [
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я слишком доверяю тем, кто носит религиозные символы.',
      'Моя набожность иногда заставляет меня слепо доверять тем, кто претендует на религиозный авторитет.',
      'Я невероятно наивен в отношении политики.'
    ]
  },
  criminal: {
    name: 'Преступник',
    skillProficiencies: ['обман', 'скрытность'],
    languages: 0,
    equipment: ['лом', 'темная одежда', '15 золотых'],
    description: 'Вы - опытный преступник с историей нарушения закона.',
    personalityTraits: [
      'Я всегда имею план на случай, если что-то пойдет не так.',
      'Я всегда планирую все до мельчайших деталей.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.'
    ],
    ideals: [
      'Честь. Я не краду у тех, кто не может себе это позволить.',
      'Свобода. Цепи должны быть разорваны, тираны свергнуты.',
      'Сочувствие. Я никогда не оставлю друга в беде.',
      'Стремление. Я собираюсь доказать, что я достоин лучшей жизни.'
    ],
    bonds: [
      'Я пытаюсь стать достойным памяти моего брата или сестры.',
      'Я ответственен за падение товарища, и я стремлюсь искупить эту вину.',
      'Мое ограбление или преступление пошло не так, и теперь я должен исправить ситуацию.',
      'Я буду свободен от долга, который я должен могущественному человеку.'
    ],
    flaws: [
      'Когда я вижу что-то ценное, я не могу удержаться от кражи.',
      'Когда я вижу что-то ценное, я не могу удержаться от кражи.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.'
    ]
  },
  'folk-hero': {
    name: 'Народный герой',
    skillProficiencies: ['уход за животными', 'выживание'],
    languages: 0,
    equipment: ['инструменты ремесленника', 'лопата', 'железный котел', 'обычная одежда', '10 золотых'],
    description: 'Вы пришли из скромного социального положения, но вы сумели сделать что-то необычное.',
    personalityTraits: [
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.'
    ],
    ideals: [
      'Уважение. Люди заслуживают уважения независимо от их происхождения.',
      'Справедливость. Никто не должен избежать наказания за свои преступления.',
      'Изменение. Жизнь подобна временам года, и перемены должны прийти.',
      'Самопожертвование. Я должен помочь тем, кто не может помочь себе.'
    ],
    bonds: [
      'У меня есть семья, но я не знаю, где они. Однажды я надеюсь увидеть их снова.',
      'Я работаю над проектом, который займет поколения, чтобы завершить.',
      'Я плачу свои долги тем, кто помог мне в трудные времена.',
      'Мое оружие напоминает мне о моей родине, и я скучаю по дому.'
    ],
    flaws: [
      'Типичный народный герой, который все еще видит себя простым человеком.',
      'Типичный народный герой, который все еще видит себя простым человеком.',
      'Типичный народный герой, который все еще видит себя простым человеком.',
      'Типичный народный герой, который все еще видит себя простым человеком.'
    ]
  },
  noble: {
    name: 'Благородный',
    skillProficiencies: ['история', 'убеждение'],
    languages: 1,
    equipment: ['дорогая одежда', 'печатное кольцо', 'свиток родословной', '25 золотых'],
    description: 'Вы понимаете власть, влияние и социальные обязательства, которые приходят с благородным титулом.',
    personalityTraits: [
      'Мои манеры утонченны и вежливы.',
      'Я использую жаргон и архаичные выражения.',
      'Я много и часто говорю.',
      'Я был тихим ребенком, который редко говорил.',
      'Я слышу голоса, которые никто другой не слышит.',
      'Я не могу лгать.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.'
    ],
    ideals: [
      'Уважение. Уважение - это дорога к власти и влиянию.',
      'Ответственность. Я должен доказать, что достоин своего наследства.',
      'Независимость. Я должен доказать, что могу справиться сам.',
      'Власть. Если я не могу быть королем, я не буду ничем.'
    ],
    bonds: [
      'Я буду восстановить честь моей семьи.',
      'Я должен защитить народ, который зависит от меня.',
      'У меня есть секрет, который может разрушить мою семью.',
      'Я не буду позволить никому оскорбить мою семью.'
    ],
    flaws: [
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.'
    ]
  },
  sage: {
    name: 'Мудрец',
    skillProficiencies: ['магия', 'история'],
    languages: 2,
    equipment: ['бутылка черных чернил', 'перо', 'маленький нож', 'письмо от мертвого коллеги', 'обычная одежда', '10 золотых'],
    description: 'Вы провели годы, изучая древние рукописи и фолианты.',
    personalityTraits: [
      'Я использую жаргон и архаичные выражения.',
      'Я много и часто говорю.',
      'Я был тихим ребенком, который редко говорил.',
      'Я слышу голоса, которые никто другой не слышит.',
      'Я не могу лгать.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.',
      'Я не могу удержаться от исправления других, когда они ошибаются.'
    ],
    ideals: [
      'Знание. Путь к могуществу и самосовершенствованию лежит через знание.',
      'Красота. То, что красиво, должно быть защищено.',
      'Логика. Эмоции не должны преобладать над логическим мышлением.',
      'Нет предела тому, что можно узнать.'
    ],
    bonds: [
      'Я работаю над великим философским трудом.',
      'Я собираю древние рукописи и фолианты.',
      'Я был изгнан из моей академии за исследования, которые считались слишком радикальными.',
      'Моя жизнь посвящена поиску одного древнего текста.'
    ],
    flaws: [
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.'
    ]
  },
  soldier: {
    name: 'Солдат',
    skillProficiencies: ['атлетика', 'запугивание'],
    languages: 0,
    equipment: ['знаки отличия', 'трофей от павшего врага', 'набор костяных костей', 'обычная одежда', '10 золотых'],
    description: 'Вы были обучены в опасном ремесле войны.',
    personalityTraits: [
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.'
    ],
    ideals: [
      'Уважение. Уважение - это дорога к власти и влиянию.',
      'Ответственность. Я должен доказать, что достоин своего наследства.',
      'Независимость. Я должен доказать, что могу справиться сам.',
      'Власть. Если я не могу быть королем, я не буду ничем.'
    ],
    bonds: [
      'Я буду восстановить честь моей семьи.',
      'Я должен защитить народ, который зависит от меня.',
      'У меня есть секрет, который может разрушить мою семью.',
      'Я не буду позволить никому оскорбить мою семью.'
    ],
    flaws: [
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.'
    ]
  },
  urchin: {
    name: 'Бродяга',
    skillProficiencies: ['ловкость рук', 'скрытность'],
    languages: 0,
    equipment: ['маленький нож', 'карта родного города', 'домашняя мышь', 'сувенир от родителей', 'обычная одежда', '10 золотых'],
    description: 'Вы выросли на улицах, сами по себе, без родителей.',
    personalityTraits: [
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.',
      'Я сужу других слишком строго, и сам еще строже сужу себя.'
    ],
    ideals: [
      'Уважение. Уважение - это дорога к власти и влиянию.',
      'Ответственность. Я должен доказать, что достоин своего наследства.',
      'Независимость. Я должен доказать, что могу справиться сам.',
      'Власть. Если я не могу быть королем, я не буду ничем.'
    ],
    bonds: [
      'Я буду восстановить честь моей семьи.',
      'Я должен защитить народ, который зависит от меня.',
      'У меня есть секрет, который может разрушить мою семью.',
      'Я не буду позволить никому оскорбить мою семью.'
    ],
    flaws: [
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.',
      'Я слишком часто полагаюсь на других.'
    ]
  }
};

export const SKILLS = {
  acrobatics: { name: 'Акробатика', ability: 'dexterity' },
  animalHandling: { name: 'Уход за животными', ability: 'wisdom' },
  arcana: { name: 'Магия', ability: 'intelligence' },
  athletics: { name: 'Атлетика', ability: 'strength' },
  deception: { name: 'Обман', ability: 'charisma' },
  history: { name: 'История', ability: 'intelligence' },
  insight: { name: 'Проницательность', ability: 'wisdom' },
  intimidation: { name: 'Запугивание', ability: 'charisma' },
  investigation: { name: 'Анализ', ability: 'intelligence' },
  medicine: { name: 'Медицина', ability: 'wisdom' },
  nature: { name: 'Природа', ability: 'intelligence' },
  perception: { name: 'Восприятие', ability: 'wisdom' },
  performance: { name: 'Выступление', ability: 'charisma' },
  persuasion: { name: 'Убеждение', ability: 'charisma' },
  religion: { name: 'Религия', ability: 'intelligence' },
  sleightOfHand: { name: 'Ловкость рук', ability: 'dexterity' },
  stealth: { name: 'Скрытность', ability: 'dexterity' },
  survival: { name: 'Выживание', ability: 'wisdom' }
};

// Новые константы для валидации навыков
export const SKILL_VALIDATION = {
  // Максимальное количество навыков, которые может иметь персонаж
  MAX_SKILLS: 18,
  // Минимальное количество навыков от класса
  MIN_CLASS_SKILLS: 2,
  // Максимальное количество навыков от класса
  MAX_CLASS_SKILLS: 4
};

class CharacterCreationService {
  // Фиксированные значения характеристик для распределения
  static readonly FIXED_ABILITY_SCORES = [15, 14, 13, 12, 10, 8];

  // Получение фиксированных значений характеристик
  static getFixedAbilityScores(): number[] {
    return [...this.FIXED_ABILITY_SCORES];
  }

  // Генерация случайных характеристик (4d6, отбросить минимальный) - оставляем для совместимости
  static rollAbilityScores(): number[] {
    const scores: number[] = [];
    for (let i = 0; i < 6; i++) {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      scores.push(rolls[0] + rolls[1] + rolls[2]);
    }
    return scores.sort((a, b) => b - a);
  }

  // Новый метод для получения фиксированных значений (основной метод)
  static getAbilityScores(): number[] {
    return this.getFixedAbilityScores();
  }

  // Вычисление модификатора характеристики
  static calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  // Применение бонусов расы к характеристикам
  static applyRacialBonuses(stats: any, race: string): any {
    const raceData = RACES[race as keyof typeof RACES];
    if (!raceData) return stats;

    const newStats = { ...stats };
    Object.entries(raceData.abilityScoreIncrease).forEach(([ability, bonus]) => {
      newStats[ability] += bonus;
    });

    return newStats;
  }

  // Вычисление модификаторов характеристик
  static calculateStatModifiers(stats: any): any {
    const modifiers: any = {};
    Object.entries(stats).forEach(([ability, score]) => {
      modifiers[ability] = this.calculateModifier(score as number);
    });
    return modifiers;
  }

  // Вычисление HP на основе класса и конституции
  static calculateHP(characterClass: string, constitutionModifier: number): number {
    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    if (!classData) return 10;

    const hitDie = classData.hitDie;
    const baseHP = hitDie + constitutionModifier;
    return Math.max(1, baseHP); // Минимум 1 HP
  }

  // Вычисление класса брони
  static calculateArmorClass(dexterityModifier: number, armor: string = 'none'): number {
    switch (armor) {
      case 'leather':
        return 11 + dexterityModifier;
      case 'studded leather':
        return 12 + dexterityModifier;
      case 'hide':
        return 12 + Math.min(dexterityModifier, 2);
      case 'chain shirt':
        return 13 + Math.min(dexterityModifier, 2);
      case 'scale mail':
        return 14 + Math.min(dexterityModifier, 2);
      case 'breastplate':
        return 14 + Math.min(dexterityModifier, 2);
      case 'half plate':
        return 15 + Math.min(dexterityModifier, 2);
      case 'ring mail':
        return 14;
      case 'chain mail':
        return 16;
      case 'splint':
        return 17;
      case 'plate':
        return 18;
      default:
        return 10 + dexterityModifier; // Без брони
    }
  }

  // Определение навыков класса
  static getClassSkills(characterClass: string): string[] {
    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    if (!classData) return [];

    return classData.skills || [];
  }

  // Новый метод для валидации выбора навыков
  static validateSkillChoices(
    characterClass: string, 
    background: string, 
    skillChoices: string[]
  ): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    const backgroundData = BACKGROUNDS[background as keyof typeof BACKGROUNDS];

    if (!classData) {
      errors.push('Неизвестный класс персонажа');
      return { isValid: false, errors, warnings };
    }

    if (!backgroundData) {
      errors.push('Неизвестная предыстория персонажа');
      return { isValid: false, errors, warnings };
    }

    // Проверяем количество выбранных навыков
    const requiredSkillChoices = classData.skillChoices || 2;
    if (skillChoices.length !== requiredSkillChoices) {
      errors.push(`Должно быть выбрано ровно ${requiredSkillChoices} навыка из класса`);
    }

    // Проверяем, что все выбранные навыки доступны для класса
    const availableClassSkills = classData.skills || [];
    const invalidSkills = skillChoices.filter(skill => !availableClassSkills.includes(skill));
    if (invalidSkills.length > 0) {
      errors.push(`Следующие навыки недоступны для класса ${classData.name}: ${invalidSkills.join(', ')}`);
    }

    // Проверяем дублирование с навыками предыстории
    const backgroundSkills = backgroundData.skillProficiencies || [];
    const duplicateSkills = skillChoices.filter(skill => backgroundSkills.includes(skill));
    if (duplicateSkills.length > 0) {
      warnings.push(`Следующие навыки уже получены от предыстории: ${duplicateSkills.join(', ')}. Вы можете выбрать другие навыки.`);
    }

    // Проверяем общее количество навыков
    const totalSkills = skillChoices.length + backgroundSkills.length;
    if (totalSkills > SKILL_VALIDATION.MAX_SKILLS) {
      warnings.push(`Общее количество навыков (${totalSkills}) превышает рекомендуемый максимум (${SKILL_VALIDATION.MAX_SKILLS})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Новый метод для получения доступных навыков класса
  static getAvailableClassSkills(characterClass: string, background: string): {
    availableSkills: string[];
    backgroundSkills: string[];
    requiredChoices: number;
    classSkills: string[];
  } {
    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    const backgroundData = BACKGROUNDS[background as keyof typeof BACKGROUNDS];

    if (!classData || !backgroundData) {
      return {
        availableSkills: [],
        backgroundSkills: [],
        requiredChoices: 0,
        classSkills: []
      };
    }

    const classSkills = classData.skills || [];
    const backgroundSkills = backgroundData.skillProficiencies || [];
    const requiredChoices = classData.skillChoices || 2;

    // Доступные навыки - это навыки класса, которые не получены от предыстории
    const availableSkills = classSkills.filter(skill => !backgroundSkills.includes(skill));

    return {
      availableSkills,
      backgroundSkills,
      requiredChoices,
      classSkills
    };
  }

  // Новый метод для получения полной информации о навыках персонажа
  static getCharacterSkillsInfo(
    characterClass: string, 
    background: string, 
    skillChoices: string[]
  ): {
    classSkills: string[];
    backgroundSkills: string[];
    chosenSkills: string[];
    totalSkills: string[];
    skillDetails: { [key: string]: { name: string; ability: string; source: string } };
  } {
    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    const backgroundData = BACKGROUNDS[background as keyof typeof BACKGROUNDS];

    if (!classData || !backgroundData) {
      return {
        classSkills: [],
        backgroundSkills: [],
        chosenSkills: [],
        totalSkills: [],
        skillDetails: {}
      };
    }

    const classSkills = classData.skills || [];
    const backgroundSkills = backgroundData.skillProficiencies || [];
    const chosenSkills = skillChoices;
    
    // Объединяем все навыки, убирая дубликаты
    const totalSkills = [...new Set([...backgroundSkills, ...chosenSkills])];

    // Создаем детальную информацию о каждом навыке
    const skillDetails: { [key: string]: { name: string; ability: string; source: string } } = {};
    
    totalSkills.forEach(skill => {
      const skillData = SKILLS[skill as keyof typeof SKILLS];
      if (skillData) {
        let source = '';
        if (backgroundSkills.includes(skill)) {
          source = 'Предыстория';
        } else if (chosenSkills.includes(skill)) {
          source = 'Класс';
        }
        
        skillDetails[skill] = {
          name: skillData.name,
          ability: skillData.ability,
          source
        };
      }
    });

    return {
      classSkills,
      backgroundSkills,
      chosenSkills,
      totalSkills,
      skillDetails
    };
  }

  // Улучшенный метод для определения навыков персонажа
  static determineCharacterSkills(
    characterClass: string,
    background: string,
    skillChoices: string[]
  ): { [key: string]: boolean } {
    const skills: { [key: string]: boolean } = {};
    
    // Инициализируем все навыки как false
    Object.keys(SKILLS).forEach(skill => {
      skills[skill] = false;
    });

    // Получаем навыки от предыстории
    const backgroundData = BACKGROUNDS[background as keyof typeof BACKGROUNDS];
    const backgroundSkills = backgroundData?.skillProficiencies || [];
    
    // Получаем выбранные навыки класса
    const chosenSkills = skillChoices || [];

    // Устанавливаем навыки как true
    [...backgroundSkills, ...chosenSkills].forEach(skill => {
      if (skills.hasOwnProperty(skill)) {
        skills[skill] = true;
      }
    });

    return skills;
  }

  // Создание персонажа по шагам
  static async createCharacterStepByStep(creationData: {
    playerId: string;
    name: string;
    race: string;
    characterClass: string;
    background: string;
    abilityScores: number[];
    skillChoices: string[];
    alignment: string;
    appearance: any;
    personality: any;
    backstory: string;
  }): Promise<any> {
    const { playerId, name, race, characterClass, background, abilityScores, skillChoices, alignment, appearance, personality, backstory } = creationData;

    // Валидация выбора навыков
    const skillValidation = this.validateSkillChoices(characterClass, background, skillChoices);
    if (!skillValidation.isValid) {
      throw new Error(`Ошибка валидации навыков: ${skillValidation.errors.join(', ')}`);
    }

    // Шаг 1: Определение характеристик (4d6, отбросить минимальный)
    let stats = {
      strength: abilityScores[0] || 10,
      dexterity: abilityScores[1] || 10,
      constitution: abilityScores[2] || 10,
      intelligence: abilityScores[3] || 10,
      wisdom: abilityScores[4] || 10,
      charisma: abilityScores[5] || 10
    };

    // Шаг 2: Применение бонусов расы
    stats = this.applyRacialBonuses(stats, race);

    // Шаг 3: Вычисление модификаторов характеристик
    const statModifiers = this.calculateStatModifiers(stats);

    // Шаг 4: Определение бросков спасения класса
    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    const backgroundData = BACKGROUNDS[background as keyof typeof BACKGROUNDS];
    const savingThrows = {
      strength: classData?.savingThrowProficiencies.includes('strength') || false,
      dexterity: classData?.savingThrowProficiencies.includes('dexterity') || false,
      constitution: classData?.savingThrowProficiencies.includes('constitution') || false,
      intelligence: classData?.savingThrowProficiencies.includes('intelligence') || false,
      wisdom: classData?.savingThrowProficiencies.includes('wisdom') || false,
      charisma: classData?.savingThrowProficiencies.includes('charisma') || false
    };

    // Шаг 5: Определение навыков (обновленная логика)
    const skills: any = this.determineCharacterSkills(characterClass, background, skillChoices);

    // Получаем детальную информацию о навыках
    const skillsInfoData = this.getCharacterSkillsInfo(characterClass, background, skillChoices);
    const skillsInfo = skillsInfoData.skillDetails;

    // Шаг 6: Вычисление HP (максимум кости хитов + модификатор конституции)
    const hp = this.calculateHP(characterClass, statModifiers.constitution);

    // Шаг 7: Определение снаряжения
    const startingEquipment = classData?.startingEquipment || [];
    
    // Добавляем снаряжение предыстории
    if (backgroundData?.equipment) {
      startingEquipment.push(...backgroundData.equipment);
    }

    // Шаг 8: Определение языков
    const raceData = RACES[race as keyof typeof RACES];
    const languages = ['Общий', ...(raceData?.languages || [])];
    if (backgroundData?.languages) {
      // Добавляем дополнительные языки от предыстории
      for (let i = 0; i < backgroundData.languages; i++) {
        languages.push('Дополнительный язык');
      }
    }

    // Шаг 9: Определение владений оружием и доспехами
    const weaponProficiencies = classData?.weaponProficiencies || [];
    const armorProficiencies = classData?.armorProficiencies || [];

    // Шаг 10: Определение заклинаний (для магических классов)
    const spells = {
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
    };

    // Добавляем начальные заклинания для магических классов
    if (classData?.spellcasting) {
      // Здесь можно добавить логику для начальных заклинаний
      // В зависимости от класса
    }

    // Шаг 11: Создание персонажа (обновленный)
    const character = await Character.create({
      playerId,
      name,
      characterClass: characterClass as any,
      level: 1,
      race: race as any,
      background: background as any,
      alignment,
      experience: 0,
      stats,
      statModifiers,
      savingThrows,
      skills,
      skillsInfo, // Добавляем детальную информацию о навыках
      hp,
      maxHp: hp,
      tempHp: 0,
      armorClass: this.calculateArmorClass(statModifiers.dexterity),
      initiative: statModifiers.dexterity,
      speed: raceData?.speed || 30,
      inventory: [],
      equipment: [],
      weapons: [],
      armor: [],
      startingEquipment,
      racialTraits: raceData?.traits || [],
      classFeatures: classData?.classFeatures || [],
      spells,
      languages,
      toolProficiencies: [],
      weaponProficiencies,
      armorProficiencies,
      appearance,
      personality,
      backstory,
      position: { x: 0, y: 0 },
      isAlive: true,
      money: {
        copper: 0,
        silver: 0,
        electrum: 0,
        gold: 0,
        platinum: 0
      }
    });

    return character;
  }

  // Получение данных для создания персонажа
  static getCreationData() {
    return {
      races: RACES,
      classes: CLASSES,
      backgrounds: BACKGROUNDS,
      skills: SKILLS
    };
  }

  // Новый метод для получения рекомендаций по навыкам
  static getSkillRecommendations(characterClass: string, background: string): {
    recommendedSkills: string[];
    reasoning: string[];
  } {
    const classData = CLASSES[characterClass as keyof typeof CLASSES];
    const backgroundData = BACKGROUNDS[background as keyof typeof BACKGROUNDS];

    if (!classData || !backgroundData) {
      return { recommendedSkills: [], reasoning: [] };
    }

    const recommendedSkills: string[] = [];
    const reasoning: string[] = [];

    // Рекомендации на основе класса
    switch (characterClass) {
      case 'fighter':
        recommendedSkills.push('athletics', 'intimidation');
        reasoning.push('Атлетика полезна для воина в бою и преодолении препятствий');
        reasoning.push('Запугивание помогает в социальных взаимодействиях');
        break;
      case 'wizard':
        recommendedSkills.push('arcana', 'investigation');
        reasoning.push('Магия необходима для изучения заклинаний');
        reasoning.push('Анализ помогает в исследовании и решении загадок');
        break;
      case 'rogue':
        recommendedSkills.push('stealth', 'sleightOfHand');
        reasoning.push('Скрытность - ключевой навык разбойника');
        reasoning.push('Ловкость рук полезна для воровства и ловкости');
        break;
      case 'cleric':
        recommendedSkills.push('insight', 'religion');
        reasoning.push('Проницательность помогает понимать мотивы других');
        reasoning.push('Религия связана с божественной магией');
        break;
      case 'ranger':
        recommendedSkills.push('survival', 'perception');
        reasoning.push('Выживание необходимо для жизни в дикой природе');
        reasoning.push('Восприятие помогает замечать опасности и следы');
        break;
      case 'barbarian':
        recommendedSkills.push('athletics', 'survival');
        reasoning.push('Атлетика полезна для варвара в бою');
        reasoning.push('Выживание помогает в дикой природе');
        break;
      case 'bard':
        recommendedSkills.push('performance', 'persuasion');
        reasoning.push('Выступление - ключевой навык барда');
        reasoning.push('Убеждение помогает в социальных взаимодействиях');
        break;
      case 'druid':
        recommendedSkills.push('nature', 'survival');
        reasoning.push('Природа связана с друидской магией');
        reasoning.push('Выживание помогает в дикой природе');
        break;
      case 'monk':
        recommendedSkills.push('acrobatics', 'stealth');
        reasoning.push('Акробатика полезна для монаха в бою');
        reasoning.push('Скрытность помогает в скрытном передвижении');
        break;
      case 'paladin':
        recommendedSkills.push('insight', 'religion');
        reasoning.push('Проницательность помогает паладину судить о людях');
        reasoning.push('Религия связана с божественной магией');
        break;
      case 'sorcerer':
        recommendedSkills.push('arcana', 'deception');
        reasoning.push('Магия связана с чародейской силой');
        reasoning.push('Обман помогает в социальных взаимодействиях');
        break;
      case 'warlock':
        recommendedSkills.push('arcana', 'deception');
        reasoning.push('Магия связана с пактовой магией');
        reasoning.push('Обман помогает в сделках с потусторонними существами');
        break;
    }

    // Исключаем навыки, которые уже получены от предыстории
    const backgroundSkills = backgroundData.skillProficiencies || [];
    const filteredRecommendations = recommendedSkills.filter(skill => !backgroundSkills.includes(skill));

    return {
      recommendedSkills: filteredRecommendations,
      reasoning
    };
  }
}

export default CharacterCreationService; 