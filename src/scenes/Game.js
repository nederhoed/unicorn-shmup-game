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

  preload() {}

  create(data) {
    // Display the HUD
    this.scene.run('HUDScene');

    // LEVEL VARIABLES TO BE ABSTRACTED
    this.base_number = 5;

    // Interactions
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Audio
    this.fail = this.sound.add('fail');
    this.score = this.sound.add('score');

    this.addMap();
    this.addHero(this.spawnPos.x, this.spawnPos.y);

    this.hero.setAmmo(new Bullets(this));

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

    // Initiate obstacles
    this.obstacles = this.add.group();

    const onObstacleCollect = (object, points) => {
      object.off('collected', onObstacleCollect)
      this.events.emit('addScore', points)
      if (points > 0) {
        this.score.play();
      } else {
        this.fail.play();
      }
    }

    const objectLayer = this.map.getObjectLayer('Objects')
    if (objectLayer) {
      objectLayer.objects.forEach(object => {
        // Get custom object properties
        const props = (object.properties || []).reduce((p, prop) => {
          p[prop.name] = prop.value;
          return p;
        }, {})

        // Set spawn location for hero
        if (object.name === 'Start') {
          this.spawnPos = { x: object.x, y: object.y };
        }

        // Add obstacles
        if (object.type === 'Obstacle') {
          const obstacle = new Obstacle(this, 
            object.x + 16, object.y + 16, 
            this.base_number, getRandomMultipleWithNoise(this.base_number, props.maxMultiple)
          );
          this.obstacles.add(obstacle)
          if (props.minVelY !== undefined && props.maxVelY !== undefined) {
            obstacle.body.setVelocityY(Phaser.Math.Between(props.minVelY, props.maxVelY));
          }
          obstacle.on('collected', onObstacleCollect);
        }
      });
    }

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
