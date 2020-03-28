import Phaser from 'phaser';
import Hero from '../entities/Hero';
import Unicorn from '../entities/Unicorn';


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {
//    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet('unicorn-fly-sheet', 'assets/unicorn/fly.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
  }

  create(data) {

    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: 'unicorn-flying',
      frames: this.anims.generateFrameNumbers('unicorn-fly-sheet'),
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });

    this.hero = new Hero(this, 250, 120);
    this.unicorn = new Unicorn(this, 160, 120);

  }

  update(time, delta) {}
}

export default Game;
