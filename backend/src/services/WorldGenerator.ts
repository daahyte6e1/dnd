interface TileType {
  FOREST: string;
  MOUNTAINS: string;
  VILLAGE: string;
  DUNGEON: string;
  PLAINS: string;
  WATER: string;
}

interface Tile {
  type: string;
  features: string[];
  npcs: any[];
  passable: boolean;
  visibility: number;
}

interface GenerationRules {
  forest: number;
  mountains: number;
  villages: number;
  dungeons: number;
  plains: number;
}

interface Location {
  type: string;
  position: { x: number; y: number };
  name: string;
  npcs?: any[];
  difficulty?: number;
}

interface WorldData {
  locations: Location[];
  npcs: any[];
  events: any[];
}

interface WorldResult {
  tiles: Tile[][];
  worldData: WorldData;
  width: number;
  height: number;
  seed: number;
}

interface NPC {
  id: string;
  type: string;
  name: string;
  friendly: boolean;
}

class WorldGenerator {
  private tileTypes: TileType;

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
  private noise(x: number, y: number, seed: number): number {
    const n = x + y * 57 + seed * 131;
    return (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff;
  }

  // Нормализация значения noise
  private normalizedNoise(x: number, y: number, seed: number): number {
    return (this.noise(x, y, seed) % 1000) / 1000;
  }

  // Генерация мира по seed
  generateWorld(width: number, height: number, seed: number, rules: GenerationRules | null = null): WorldResult {
    const defaultRules: GenerationRules = {
      forest: 0.3,
      mountains: 0.2,
      villages: 0.1,
      dungeons: 0.05,
      plains: 0.35
    };

    const generationRules = rules || defaultRules;
    const tiles: Tile[][] = [];
    const worldData: WorldData = {
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
  private generateTile(x: number, y: number, noiseValue: number, rules: GenerationRules, seed: number): Tile {
    const tile: Tile = {
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
  private generateForestFeatures(seed: number): string[] {
    const features: string[] = [];
    const random = this.normalizedNoise(seed, 0, 0);
    
    if (random < 0.3) features.push('trees');
    if (random < 0.1) features.push('mushrooms');
    if (random < 0.05) features.push('treasure');
    
    return features;
  }

  // Генерация особенностей деревни
  private generateVillageFeatures(seed: number): string[] {
    const features: string[] = [];
    const random = this.normalizedNoise(seed, 0, 0);
    
    features.push('houses');
    if (random < 0.7) features.push('inn');
    if (random < 0.5) features.push('shop');
    if (random < 0.3) features.push('temple');
    
    return features;
  }

  // Генерация особенностей подземелья
  private generateDungeonFeatures(seed: number): string[] {
    const features: string[] = [];
    const random = this.normalizedNoise(seed, 0, 0);
    
    features.push('entrance');
    if (random < 0.8) features.push('traps');
    if (random < 0.6) features.push('monsters');
    if (random < 0.4) features.push('treasure');
    
    return features;
  }

  // Генерация NPC для деревни
  private generateVillageNPCs(seed: number): NPC[] {
    const npcs: NPC[] = [];
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
  getTileInfo(x: number, y: number, tiles: Tile[][]): Tile | null {
    if (x < 0 || y < 0 || x >= tiles.length || y >= tiles[0].length) {
      return null;
    }
    return tiles[x][y];
  }

  // Проверка проходимости
  isPassable(x: number, y: number, tiles: Tile[][]): boolean {
    const tile = this.getTileInfo(x, y, tiles);
    return tile ? tile.passable : false;
  }

  // Поиск пути (простая реализация)
  findPath(startX: number, startY: number, endX: number, endY: number, tiles: Tile[][]): { x: number; y: number }[] {
    // Простая реализация - можно улучшить алгоритмом A*
    const path: { x: number; y: number }[] = [];
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

export default WorldGenerator; 