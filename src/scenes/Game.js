import Phaser from 'phaser';
import Unicorn from '../entities/Unicorn';


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
    this.load.spritesheet('unicorn-fly-sheet', 'assets/unicorn/fly.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
  }

  create(data) {
    // Interactions
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Visualizations
    this.anims.create({
      key: 'unicorn-flying',
      frames: this.anims.generateFrameNumbers('unicorn-fly-sheet'),
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });

    this.hero = new Unicorn(this, 0, 0);

    // Scenery
    const platform = this.add.rectangle(0, 120, 100, 5, 0xffffff);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
  }

  update(time, delta) {}
}

export default Game;
