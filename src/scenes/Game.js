import Phaser from 'phaser';
import Unicorn from '../entities/Unicorn';
import Bullets from '../entities/Bullets';
import Obstacle from '../entities/Obstacle';


// TODO: MenuScene => Pick your flying expertise, choose a Math level
// TODO: GameOver event => Back to MENU
// TODO: HeroDies event => 1 heart less in HUDScene


function getRandomMultipleWithNoise(base_number, max_multiple) {
  // TODO: move this function to a utils file?
  // TODO: add noise to not end up to far from a valid multiple for higher base_numbers
  return Phaser.Math.Between(base_number, base_number*max_multiple);
}

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {

    this.load.tilemapTiledJSON('level-1', 'assets/tilemaps/level-1.json');
    this.load.image('world-1-sheet', 'assets/tilesets/spritesheet_ground-32x32.png');
    this.load.image('fire-benthe-sheet', 'assets/tilesets/fire-benthe-32x32.png');

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

    // Audio
    this.load.setPath('assets');
    this.load.audio('fail', '8bit_status_45.mp3');
    this.load.audio('score', 'Retro_Game_Moon_Jump.mp3');
  }

  create(data) {
    // LEVEL VARIABLES TO BE ABSTRACTED
    this.base_number = 5;

    // Interactions
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Audio
    this.fail = this.sound.add('fail');
    this.score = this.sound.add('score');

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
    this.addHero(60, 20);

    this.hero.setAmmo(new Bullets(this));

    // Initiate some obstacles
    this.obstacles = this.add.group();

    var obstacle;
    const onObstacleCollect = (points) => {
      obstacle.off('collected', onObstacleCollect)
      this.events.emit('addScore', points)
      if (points > 0) {
        this.score.play();
      } else {
        this.fail.play();
      }
    }
    var obstacle_locations = [
      [9, 4],
      [13, 3], [17, 2], [21, 3],
      [11, 6], [11, 7], [11, 10],
      [16, 6], [16, 7], [16, 10]
    ]
    for (var i=0; i < obstacle_locations.length; i++) {
      console.log(obstacle_locations);
      var x = obstacle_locations[i][0]*32-16;
      var y = obstacle_locations[i][1]*32-16;
      console.log(x, y);
      obstacle = new Obstacle(
        this, x, y,
        this.base_number, getRandomMultipleWithNoise(this.base_number, 50));
      this.obstacles.add(obstacle);
      obstacle.on('collected', onObstacleCollect);
    }
    var obstacle_locations = [
      [1, 6], [2, 6], [3, 6],
      [10, 12], [10, 13],
    ]
    for (var i=0; i < obstacle_locations.length; i++) {
      console.log(obstacle_locations);
      var x = obstacle_locations[i][0]*32-16;
      var y = obstacle_locations[i][1]*32-16;
      console.log(x, y);
      obstacle = new Obstacle(
        this, x, y,
        this.base_number, getRandomMultipleWithNoise(this.base_number, 11));
      this.obstacles.add(obstacle);
      obstacle.on('collected', onObstacleCollect);
    }
    for (var i=0; i < 5; i++) {
      obstacle = new Obstacle(
        this, 32*(30+i*2)-16, 32-16,
        this.base_number, getRandomMultipleWithNoise(this.base_number, 7));
      this.obstacles.add(obstacle);
      obstacle.on('collected', onObstacleCollect);
      obstacle.body.setVelocityY(Phaser.Math.Between(5, 10));
    }
    for (var i=0; i < 5; i++) {
      obstacle = new Obstacle(
        this, 32*(30+i*2)-16, 32-16,
        this.base_number, getRandomMultipleWithNoise(this.base_number, 11));
      this.obstacles.add(obstacle);
      obstacle.on('collected', onObstacleCollect);
      obstacle.body.setVelocityY(Phaser.Math.Between(1, 5));
    }

    this.physics.add.overlap(
      this.hero.ammo, this.obstacles,
      (x, y) => {this.bulletHitsObstacleCallback(x, y)}
    );
    this.physics.add.collider(
      this.hero, this.obstacles, Obstacle.playerHitsObstacleCallback);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);
  }

  bulletHitsObstacleCallback(objectHit, bulletHit) {
    // Remove bullet from game
    if (bulletHit.active && objectHit.active) {
      console.log('bullet hits obstacle');
      this.hero.ammo.killBullet(bulletHit);
      // Process hit: countdown
      objectHit.processHit();
    }
  }

  addMap() {
    this.map = this.make.tilemap({key: 'level-1'});

    const groundTiles = this.map.addTilesetImage('world-1', 'world-1-sheet');
    const groundLayer = this.map.createStaticLayer('Ground', groundTiles);
    groundLayer.setCollision([1, 9, 89, 44, 13, 21, 60, 94], true);

    const fireTiles = this.map.addTilesetImage('fire-benthe', 'fire-benthe-sheet');
    const fireLayer = this.map.createStaticLayer('Fire', fireTiles);
    fireLayer.setCollision([0, 1, 2, 3, 4, 5, 6], true);

    // XXX: DEBUGGING
    const debugGraphic = this.add.graphics();
    // groundLayer.renderDebug(debugGraphic);
    fireLayer.renderDebug(debugGraphic);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, true);
    console.log('Map added');
  }

  addHero(x, y) {
    this.hero = new Unicorn(this, x, y);
   this.physics.add.collider(
      this.hero, this.map.getLayer('Ground').tilemapLayer);
    this.physics.add.collider(
      this.hero, this.map.getLayer('Fire').tilemapLayer);
  }

  update(time, delta) {}
}

export default Game;
