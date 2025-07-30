class WorldGenerator {
  constructor() {
    this.tileTypes = {
      FOREST: 'forest',
      MOUNTAINS: 'mountains',
      VILLAGE: 'village',
      DUNGEON: 'dungeon',
      PLAINS: 'plains',
      WATER: 'water'
    };
  }

  // Простая реализация Perlin noise
  noise(x, y, seed) {
    const n = x + y * 57 + seed * 131;
    return (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff;
  }

  // Нормализация значения noise
  normalizedNoise(x, y, seed) {
    return (this.noise(x, y, seed) % 1000) / 1000;
  }

  // Генерация мира по seed
  generateWorld(width, height, seed, rules = null) {
    const defaultRules = {
      forest: 0.3,
      mountains: 0.2,
      villages: 0.1,
      dungeons: 0.05,
      plains: 0.35
    };

    const generationRules = rules || defaultRules;
    const tiles = [];
    const worldData = {
      locations: [],
      npcs: [],
      events: []
    };

    // Генерируем базовую карту с Perlin noise
    for (let x = 0; x < width; x++) {
      tiles[x] = [];
      for (let y = 0; y < height; y++) {
        const noiseValue = this.normalizedNoise(x, y, seed);
        const tile = this.generateTile(x, y, noiseValue, generationRules, seed);
        tiles[x][y] = tile;

        // Добавляем специальные локации
        if (tile.type === this.tileTypes.VILLAGE) {
          worldData.locations.push({
            type: 'village',
            position: { x, y },
            name: `Деревня ${worldData.locations.length + 1}`,
            npcs: this.generateVillageNPCs(seed + x + y)
          });
        } else if (tile.type === this.tileTypes.DUNGEON) {
          worldData.locations.push({
            type: 'dungeon',
            position: { x, y },
            name: `Подземелье ${worldData.locations.length + 1}`,
            difficulty: Math.floor(Math.random() * 5) + 1
          });
        }
      }
    }

    return {
      tiles,
      worldData,
      width,
      height,
      seed
    };
  }

  // Генерация тайла на основе noise и правил
  generateTile(x, y, noiseValue, rules, seed) {
    const tile = {
      type: this.tileTypes.PLAINS,
      features: [],
      npcs: [],
      passable: true,
      visibility: 1
    };

    // Определяем тип тайла на основе noise и правил
    if (noiseValue < rules.forest) {
      tile.type = this.tileTypes.FOREST;
      tile.visibility = 0.7;
      tile.features = this.generateForestFeatures(seed + x + y);
    } else if (noiseValue < rules.forest + rules.mountains) {
      tile.type = this.tileTypes.MOUNTAINS;
      tile.passable = false;
      tile.visibility = 0.5;
    } else if (noiseValue < rules.forest + rules.mountains + rules.villages) {
      tile.type = this.tileTypes.VILLAGE;
      tile.features = this.generateVillageFeatures(seed + x + y);
    } else if (noiseValue < rules.forest + rules.mountains + rules.villages + rules.dungeons) {
      tile.type = this.tileTypes.DUNGEON;
      tile.features = this.generateDungeonFeatures(seed + x + y);
    }

    return tile;
  }

  // Генерация особенностей леса
  generateForestFeatures(seed) {
    const features = [];
    const random = this.normalizedNoise(seed, 0, 0);
    
    if (random < 0.3) features.push('trees');
    if (random < 0.1) features.push('mushrooms');
    if (random < 0.05) features.push('treasure');
    
    return features;
  }

  // Генерация особенностей деревни
  generateVillageFeatures(seed) {
    const features = [];
    const random = this.normalizedNoise(seed, 0, 0);
    
    features.push('houses');
    if (random < 0.7) features.push('inn');
    if (random < 0.5) features.push('shop');
    if (random < 0.3) features.push('temple');
    
    return features;
  }

  // Генерация особенностей подземелья
  generateDungeonFeatures(seed) {
    const features = [];
    const random = this.normalizedNoise(seed, 0, 0);
    
    features.push('entrance');
    if (random < 0.8) features.push('traps');
    if (random < 0.6) features.push('monsters');
    if (random < 0.4) features.push('treasure');
    
    return features;
  }

  // Генерация NPC для деревни
  generateVillageNPCs(seed) {
    const npcs = [];
    const npcCount = Math.floor(this.normalizedNoise(seed, 0, 0) * 5) + 2;
    
    const npcTypes = ['merchant', 'innkeeper', 'guard', 'farmer', 'blacksmith'];
    
    for (let i = 0; i < npcCount; i++) {
      npcs.push({
        id: `npc_${seed}_${i}`,
        type: npcTypes[Math.floor(this.normalizedNoise(seed + i, 0, 0) * npcTypes.length)],
        name: `NPC ${i + 1}`,
        friendly: true
      });
    }
    
    return npcs;
  }

  // Получение информации о тайле
  getTileInfo(x, y, tiles) {
    if (x < 0 || y < 0 || x >= tiles.length || y >= tiles[0].length) {
      return null;
    }
    return tiles[x][y];
  }

  // Проверка проходимости
  isPassable(x, y, tiles) {
    const tile = this.getTileInfo(x, y, tiles);
    return tile && tile.passable;
  }

  // Поиск пути (простая реализация)
  findPath(startX, startY, endX, endY, tiles) {
    // Простая реализация - можно улучшить алгоритмом A*
    const path = [];
    let currentX = startX;
    let currentY = startY;
    
    while (currentX !== endX || currentY !== endY) {
      if (currentX < endX && this.isPassable(currentX + 1, currentY, tiles)) {
        currentX++;
      } else if (currentX > endX && this.isPassable(currentX - 1, currentY, tiles)) {
        currentX--;
      } else if (currentY < endY && this.isPassable(currentX, currentY + 1, tiles)) {
        currentY++;
      } else if (currentY > endY && this.isPassable(currentX, currentY - 1, tiles)) {
        currentY--;
      } else {
        break; // Путь не найден
      }
      path.push({ x: currentX, y: currentY });
    }
    
    return path;
  }
}

module.exports = WorldGenerator; 