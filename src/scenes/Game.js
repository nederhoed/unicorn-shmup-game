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

    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');
    this.load.image('world-1-sheet', 'assets/tilesets/spritesheet_ground-32x32.png');

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

    this.addMap();
    this.addHero(120, 20);

    this.bullets = new Bullets(this);
    this.cursors = this.input.keyboard.createCursorKeys();

    // // Scenery
    // var platform = this.add.rectangle(30, 120, 60, 5, 0xffffff);
    // this.physics.add.existing(platform, true);
    // this.physics.add.collider(this.hero, platform);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);
  }

  addMap() {
    this.map = this.make.tilemap({key: 'level-1'});
    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision([9, 89, 44, 13, 21, 60], true);

    // XXX: DEBUGGING
    // const debugGraphic = this.add.graphics();
    // groundLayer.renderDebug(debugGraphic);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, true);
    console.log('Map added');
  }

  addHero(x, y) {
    this.hero = new Unicorn(this, x, y);
    this.physics.add.collider(
      this.hero, this.map.getLayer('Ground').tilemapLayer);
  }

  update(time, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      console.log('FIRE!!');
      console.log(this.hero.body.x);
      this.bullets.fireBullet(this.hero.x, this.hero.y);
    }

  }
}

export default Game;
