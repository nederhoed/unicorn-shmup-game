import Phaser from 'phaser';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33C5A7',
  scale: {
    width: 640,
    height: 480,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  plugins: {
    scene: [
      {
        key: 'AnimatedTiles',
        plugin: AnimatedTiles,
        mapping: 'animatedTiles'
      }
    ]
  },
  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 100},
      debug: true,
      debugShowVelocity: true,
      debugShowBody: true,
      debugShowStaticBody: true,
    }
  }
};
