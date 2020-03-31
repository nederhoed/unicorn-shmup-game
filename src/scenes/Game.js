import Phaser from 'phaser';
import Unicorn from '../entities/Unicorn';
import Bullet from '../entities/Bullet';
import Bullets from '../entities/Bullets';


class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.bullets;
  }

  init(data) {}

  preload() {
    this.load.spritesheet('unicorn-idle-sheet', 'assets/unicorn/idle.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
    this.load.spritesheet('unicorn-fly-sheet', 'assets/unicorn/fly.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
    this.load.spritesheet('unicorn-shoot-sheet', 'assets/unicorn/shoot.png', {
      frameWidth: 240,
      frameHeight: 240,
    });
    this.load.spritesheet('bullet-sheet', 'assets/bullets/star.png', {
      frameWidth: 75,
      frameHeight: 75,
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
    this.hero = new Unicorn(this, 0, 0);

    this.bullets = new Bullets(this);
    this.cursors = this.input.keyboard.createCursorKeys();

    // Scenery
    var platform = this.add.rectangle(30, 120, 60, 5, 0xffffff);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);

    platform = this.add.rectangle(430, 120, 60, 5, 0xffffff);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
    platform = this.add.rectangle(120, 60, 5, 120, 0xffffff);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
    platform = this.add.rectangle(400, 60, 5, 120, 0xffffff);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      console.log('FIRE!!');
      this.bullets.fireBullet(this.hero.x, this.hero.y);
    }

  }
}

export default Game;
