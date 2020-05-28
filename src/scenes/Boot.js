import Phaser from 'phaser';

class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  init(data) {}

  preload() {
    // Preload splash image to be displayed in the preloader scene.
    this.load.image('splash', 'assets/unicorn/idle.png');
  }

  create(data) {
    // Start the preloader
    this.scene.start('PreloadScene');
  }

}

export default Boot;