import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { Box } from '@mui/material';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.tiles = [];
    this.players = new Map();
    this.currentPlayer = null;
  }

  preload() {
    // Загружаем базовые спрайты
    this.load.image('grass', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('forest', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('mountain', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('village', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('dungeon', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    this.cameras.main.setBackgroundColor('#2c5530');
    
    // Создаем базовую сетку
    this.createGrid();
    
    // Настраиваем камеру
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(0, 0);
    
    // Добавляем обработчики событий
    this.input.on('pointerdown', this.onTileClick, this);
  }

  createGrid() {
    const tileSize = 32;
    const gridWidth = 20;
    const gridHeight = 20;
    
    for (let x = 0; x < gridWidth; x++) {
      this.tiles[x] = [];
      for (let y = 0; y < gridHeight; y++) {
        const tileX = x * tileSize;
        const tileY = y * tileSize;
        
        // Создаем базовый тайл
        const tile = this.add.rectangle(tileX, tileY, tileSize, tileSize, 0x4a7c59);
        tile.setStrokeStyle(1, 0x2c5530);
        tile.setInteractive();
        tile.tileData = { x, y, type: 'grass' };
        
        this.tiles[x][y] = tile;
      }
    }
  }

  updateWorld(worldData) {
    if (!worldData || !worldData.tiles) return;
    
    const tileSize = 32;
    
    for (let x = 0; x < worldData.tiles.length; x++) {
      for (let y = 0; y < worldData.tiles[x].length; y++) {
        const tileData = worldData.tiles[x][y];
        const tile = this.tiles[x][y];
        
        if (tile && tileData) {
          // Обновляем цвет тайла в зависимости от типа
          let color = 0x4a7c59; // grass
          
          switch (tileData.type) {
            case 'forest':
              color = 0x2d5016;
              break;
            case 'mountains':
              color = 0x6b6b6b;
              break;
            case 'village':
              color = 0x8b4513;
              break;
            case 'dungeon':
              color = 0x2f2f2f;
              break;
            case 'water':
              color = 0x4169e1;
              break;
          }
          
          tile.setFillStyle(color);
          tile.tileData = tileData;
        }
      }
    }
  }

  updatePlayers(players) {
    // Очищаем старых игроков
    this.players.forEach(player => player.destroy());
    this.players.clear();
    
    // Добавляем новых игроков
    players.forEach(player => {
      const tileSize = 32;
      const playerSprite = this.add.circle(
        player.position.x * tileSize + tileSize / 2,
        player.position.y * tileSize + tileSize / 2,
        8,
        player.id === this.currentPlayer?.id ? 0xff0000 : 0x00ff00
      );
      
      // Добавляем имя игрока
      const text = this.add.text(
        playerSprite.x,
        playerSprite.y - 20,
        player.name,
        { fontSize: '12px', color: '#ffffff' }
      );
      text.setOrigin(0.5);
      
      this.players.set(player.id, { sprite: playerSprite, text });
    });
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  onTileClick(pointer, gameObject) {
    if (gameObject.tileData) {
      const { x, y } = gameObject.tileData;
      
      // Эмитим событие клика по тайлу
      this.events.emit('tileClicked', { x, y, tileData: gameObject.tileData });
    }
  }
}

const GameCanvas = ({ worldData, players, currentPlayer, onTileClick }) => {
  const gameRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        scene: GameScene,
        backgroundColor: '#2c5530',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;
      
      // Ждем создания сцены
      game.events.once('ready', () => {
        sceneRef.current = game.scene.getScene('GameScene');
        
        // Настраиваем обработчики событий
        if (sceneRef.current) {
          sceneRef.current.events.on('tileClicked', onTileClick);
        }
      });
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateWorld(worldData);
    }
  }, [worldData]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updatePlayers(players);
    }
  }, [players]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setCurrentPlayer(currentPlayer);
    }
  }, [currentPlayer]);

  return (
    <Box sx={{ width: '100%', height: '600px', border: '1px solid #ccc' }}>
      <div ref={gameRef} />
    </Box>
  );
};

export default GameCanvas; 