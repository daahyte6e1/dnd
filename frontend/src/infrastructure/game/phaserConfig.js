import Phaser from 'phaser';

const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2c3e50',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: function() {
      // Load game assets
    },
    create: function() {
      // Create game objects
    },
    update: function() {
      // Game loop
    }
  }
};

export default phaserConfig; 