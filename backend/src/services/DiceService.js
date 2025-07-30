class DiceService {
  constructor() {
    this.diceTypes = {
      d4: 4,
      d6: 6,
      d8: 8,
      d10: 10,
      d12: 12,
      d20: 20,
      d100: 100
    };
  }

  // Парсинг команды броска кубика
  parseDiceCommand(command) {
    const diceRegex = /^\/roll\s+(\d+)d(\d+)(\s*\+\s*(\d+))?$/i;
    const match = command.match(diceRegex);
    
    if (!match) {
      return null;
    }

    return {
      count: parseInt(match[1]),
      sides: parseInt(match[2]),
      modifier: match[4] ? parseInt(match[4]) : 0,
      command: command
    };
  }

  // Бросок одного кубика
  rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  // Бросок нескольких кубиков
  rollDice(count, sides, modifier = 0) {
    const rolls = [];
    let total = 0;

    for (let i = 0; i < count; i++) {
      const roll = this.rollDie(sides);
      rolls.push(roll);
      total += roll;
    }

    total += modifier;

    return {
      rolls,
      total,
      modifier,
      count,
      sides,
      command: `/roll ${count}d${sides}${modifier > 0 ? ` + ${modifier}` : ''}`
    };
  }

  // Бросок с преимуществом/недостатком (D&D 5e)
  rollWithAdvantage(sides, modifier = 0) {
    const roll1 = this.rollDie(sides);
    const roll2 = this.rollDie(sides);
    
    return {
      rolls: [roll1, roll2],
      total: Math.max(roll1, roll2) + modifier,
      modifier,
      sides,
      advantage: true,
      command: `/roll adv d${sides}${modifier > 0 ? ` + ${modifier}` : ''}`
    };
  }

  rollWithDisadvantage(sides, modifier = 0) {
    const roll1 = this.rollDie(sides);
    const roll2 = this.rollDie(sides);
    
    return {
      rolls: [roll1, roll2],
      total: Math.min(roll1, roll2) + modifier,
      modifier,
      sides,
      disadvantage: true,
      command: `/roll dis d${sides}${modifier > 0 ? ` + ${modifier}` : ''}`
    };
  }

  // Проверка способности (D&D 5e)
  abilityCheck(abilityScore, modifier = 0, advantage = false, disadvantage = false) {
    const sides = 20;
    let result;

    if (advantage && disadvantage) {
      // Если есть и преимущество и недостаток, они отменяют друг друга
      result = this.rollDie(sides);
    } else if (advantage) {
      result = this.rollWithAdvantage(sides);
    } else if (disadvantage) {
      result = this.rollWithDisadvantage(sides);
    } else {
      result = this.rollDie(sides);
    }

    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const total = result.total + abilityModifier + modifier;

    return {
      ...result,
      abilityScore,
      abilityModifier,
      total,
      success: result.total >= 20 ? 'critical_success' : 
               result.total == 1 ? 'critical_failure' : 
               total >= 10 ? 'success' : 'failure'
    };
  }

  // Атака (D&D 5e)
  attackRoll(attackBonus, targetAC, advantage = false, disadvantage = false) {
    const sides = 20;
    let result;

    if (advantage && disadvantage) {
      result = this.rollDie(sides);
    } else if (advantage) {
      result = this.rollWithAdvantage(sides);
    } else if (disadvantage) {
      result = this.rollWithDisadvantage(sides);
    } else {
      result = this.rollDie(sides);
    }

    const total = result.total + attackBonus;
    const hit = total >= targetAC;
    const critical = result.total === 20;
    const criticalMiss = result.total === 1;

    return {
      ...result,
      attackBonus,
      targetAC,
      total,
      hit,
      critical,
      criticalMiss,
      result: criticalMiss ? 'critical_miss' : 
              critical ? 'critical_hit' : 
              hit ? 'hit' : 'miss'
    };
  }

  // Урон
  damageRoll(damageDice, damageBonus = 0, critical = false) {
    const diceMatch = damageDice.match(/^(\d+)d(\d+)$/);
    if (!diceMatch) {
      throw new Error('Неверный формат урона');
    }

    const count = parseInt(diceMatch[1]);
    const sides = parseInt(diceMatch[2]);
    
    // При критическом ударе бросаем кубики дважды
    const actualCount = critical ? count * 2 : count;
    
    const result = this.rollDice(actualCount, sides, damageBonus);
    
    return {
      ...result,
      damageDice,
      critical,
      baseCount: count,
      actualCount
    };
  }

  // Спасбросок (D&D 5e)
  savingThrow(abilityScore, difficultyClass, modifier = 0, advantage = false, disadvantage = false) {
    const sides = 20;
    let result;

    if (advantage && disadvantage) {
      result = this.rollDie(sides);
    } else if (advantage) {
      result = this.rollWithAdvantage(sides);
    } else if (disadvantage) {
      result = this.rollWithDisadvantage(sides);
    } else {
      result = this.rollDie(sides);
    }

    const abilityModifier = Math.floor((abilityScore - 10) / 2);
    const total = result.total + abilityModifier + modifier;
    const success = total >= difficultyClass;

    return {
      ...result,
      abilityScore,
      abilityModifier,
      difficultyClass,
      total,
      success,
      result: success ? 'success' : 'failure'
    };
  }

  // Форматирование результата для отображения
  formatRollResult(result, playerName) {
    const rollText = result.rolls ? `[${result.rolls.join(', ')}]` : `[${result.total - result.modifier}]`;
    const modifierText = result.modifier > 0 ? ` + ${result.modifier}` : '';
    const totalText = result.total !== undefined ? ` = ${result.total}` : '';
    
    let message = `${playerName} бросает ${result.command}: ${rollText}${modifierText}${totalText}`;
    
    if (result.advantage) {
      message += ' (с преимуществом)';
    } else if (result.disadvantage) {
      message += ' (с недостатком)';
    }
    
    if (result.critical) {
      message += ' - КРИТИЧЕСКИЙ УДАР!';
    } else if (result.criticalMiss) {
      message += ' - КРИТИЧЕСКИЙ ПРОВАЛ!';
    }
    
    return message;
  }
}

module.exports = DiceService; 