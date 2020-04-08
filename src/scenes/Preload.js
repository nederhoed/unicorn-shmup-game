import Phaser from 'phaser';


class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {

    this.load.image('splash', 'assets/unicorn/idle.png');

    // Audio
    this.load.setPath('assets');
    this.load.audio('score', 'Retro_Game_Moon_Jump.mp3');
  }

  create(data) {
    // Audio
    this.score = this.sound.add('score');

    // Visualizations
    this.add.image(320, 240, 'splash');
    this.input.on('pointerdown', () => this.scene.start('GameScene'));
  }
}

export default PreloadScene;
