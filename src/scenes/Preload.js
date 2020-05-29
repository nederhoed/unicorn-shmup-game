import Phaser from 'phaser';
import levels from '../data/levels';

class Preload extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  init(data) {}

  preload() {
    // Add splash image to the scene while content is preloading.
    this.add.image(320, 240, 'splash');
    
    // Preload all other required assets.
    this.load.setPath('assets');

    // Maps
    levels.forEach(level => this.load.tilemapTiledJSON(level.key, level.file));
    this.load.image('world-1-sheet', 'tilesets/spritesheet_ground-32x32.png');
    this.load.image('fire-benthe-sheet', 'tilesets/fire-benthe-32x32.png');

    // Sprites
    this.load.spritesheet('unicorn-idle-sheet', 'unicorn/idle.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
    this.load.spritesheet('unicorn-fly-sheet', 'unicorn/fly.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
    this.load.spritesheet('unicorn-shoot-sheet', 'unicorn/shoot.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
    this.load.spritesheet('bullet-sheet', 'bullets/star.png', {
      frameWidth: 75,
      frameHeight: 75,
    });

    // Audio
    this.load.audio('fail', '8bit_status_45.mp3');
    this.load.audio('score', 'Retro_Game_Moon_Jump.mp3');
  }

  create(data) {
    // Create global animations
    this.anims.create({
      key: 'unicorn-flying',
      frames: this.anims.generateFrameNumbers('unicorn-fly-sheet'),
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });

    this.anims.create({
      key: 'unicorn-idle',
      frames: this.anims.generateFrameNumbers('unicorn-idle-sheet'),
    });

    this.anims.create({
      key: 'unicorn-shooting',
      frames: this.anims.generateFrameNumbers('unicorn-shoot-sheet'),
      frameRate: 32 ,
      yoyo: true,
    });

    this.anims.create({
      key: 'bullet',
      frames: this.anims.generateFrameNumbers('bullet-sheet'),
      frameRate: 8,
      repeat: -1,
    });

    // All preloading and initialization is done. Add start button. (Could alternatively switch straight to menu).
    const startButton = this.add.text(320, 400, 'START', { font: '40px Arial', fill: '#000000' });
    startButton.setOriginFromFrame();
    this.input.on('pointerup', () => this.scene.start('MenuScene'));
  }

}

export default Preload;