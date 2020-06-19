import Phaser from 'phaser';
import Unicorn from '../entities/Unicorn';
import Bullets from '../entities/Bullets';
import Obstacle from '../entities/Obstacle';
import gameState from '../model/gameState';


// TODO: MenuScene => Pick your flying expertise, choose a Math level
// TODO: GameOver event => Back to MENU
// TODO: HeroDies event => 1 heart less in HUDScene

// Colliding tile indices for tilesets
const tilesetCollisions = {
  'world-1': [0, 8, 88, 43, 12, 20, 59, 93],
  'fire-benthe': [],
}

const tilesetDamagingTiles = {
  'fire-benthe': [0, 1, 2, 3, 4, 5, 6],
}

function getRandomMultipleWithNoise(base_number, max_multiple) {
  // TODO: move this function to a utils file?
  // TODO: add noise to not end up to far from a valid multiple for higher base_numbers
  return Phaser.Math.Between(base_number, base_number*max_multiple);
}

const mapProperties = (properties) => (properties || []).reduce((p, prop) => {
  p[prop.name] = prop.value;
  return p;
}, {})

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {}

  preload() {}

  create(data) {
    // Set data properties on the scene.
    this.data.set('score', 0);
    this.data.set('lives', 3);
    this.data.set('time', 0);
    this.data.set('levelIndex', data.levelIndex);

    // Display the HUD
    this.scene.run('HUDScene', { game: this });

    // Interactions
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Audio
    this.fail = this.sound.add('fail');
    this.score = this.sound.add('score');

    this.addMap(data.level);
    this.addHero(this.spawnPos.x, this.spawnPos.y);
    this.addColliders();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.hero);
  }

  addColliders() {
    // Setup collisions between the hero and the tile layers.
    this.map.layers.forEach(layerData => {
      const { collideWithHero } = mapProperties(layerData.properties);
      if (collideWithHero) {
        this.physics.add.collider(this.hero, layerData.tilemapLayer);
      }
    })

    this.physics.add.overlap(this.hero.ammo, this.obstacles, this.bulletHitsObstacleCallback, null, this);
    this.physics.add.overlap(this.hero, this.obstacles, Obstacle.playerHitsObstacleCallback);
    this.physics.add.overlap(this.hero, this.zones, Game.handleZoneCollision, null, this);
  }

  static handleZoneCollision(hero, zone) {
    gameState.submitScore(this.data.get('levelIndex'), this.data.get('score'), this.data.get('time'));
    this.returnToMenu();
  }

  returnToMenu() {
    this.scene.stop('HUDScene');
    this.scene.start('MenuScene');
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

  hitDamagingTile(hero, tile) {
    if (hero.damage()) {
      this.loseLife()
    }
  }

  loseLife() {
    this.data.values.lives -=1;
    if (this.data.values.lives <= 0) {
      this.returnToMenu();
    }
  }

  addMap(key) {
    this.map = this.make.tilemap({key: key});

    // Extract map level properties
    const levelProps = mapProperties(this.map.properties);

    // Add tileset images
    this.map.tilesets.forEach(tileset => this.map.addTilesetImage(tileset.name, `${tileset.name}-sheet`));

    // Configure tile layers
    this.map.layers.forEach(layerData => {
      const { tilesetKey } = mapProperties(layerData.properties);
      if (tilesetKey) {
        const layer = this.map.createDynamicLayer(layerData.name, this.map.getTileset(tilesetKey))
        if (tilesetCollisions[tilesetKey]) {
          const ids = tilesetCollisions[tilesetKey].map(id => id + this.map.getTileset(tilesetKey).firstgid)
          layer.setCollision(ids, true);
        }
        if (tilesetDamagingTiles[tilesetKey]) {
          const ids = tilesetDamagingTiles[tilesetKey].map(id => id + this.map.getTileset(tilesetKey).firstgid)
          tilesetDamagingTiles[tilesetKey].forEach(id => {
            layer.setTileIndexCallback(ids, this.hitDamagingTile, this);
          })
        }
      }
    })

    // XXX: DEBUGGING
    const debugGraphic = this.add.graphics();
    // this.map.getLayer('Ground').tilemapLayer.renderDebug(debugGraphic);
    // this.map.getLayer('Fire').tilemapLayer.renderDebug(debugGraphic);

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, true);

    // Initiate obstacles
    this.obstacles = this.add.group();
    this.zones = this.add.group();

    const onObstacleCollect = (object, points) => {
      object.off('collected', onObstacleCollect)
      this.data.values.score += points;
      if (points > 0) {
        this.score.play();
      } else {
        this.fail.play();
        this.loseLife()
      }
    }

    this.map.objects.forEach(objectLayer => {
      objectLayer.objects.forEach(object => {
        // Get custom object properties
        const props = mapProperties(object.properties)

        // Set spawn location for hero
        if (object.name === 'Start') {
          this.spawnPos = { x: object.x, y: object.y };
        }

        // Add obstacles
        if (object.type === 'Obstacle') {
          const obstacle = new Obstacle(this, 
            object.x + 16, object.y + 16, 
            levelProps.baseNumber, getRandomMultipleWithNoise(levelProps.baseNumber, props.maxMultiple)
          );
          this.obstacles.add(obstacle)
          if (props.minVelY !== undefined && props.maxVelY !== undefined) {
            obstacle.body.setVelocityY(Phaser.Math.Between(props.minVelY, props.maxVelY));
          }
          obstacle.on('collected', onObstacleCollect);
        }

        // Add zones
        if (object.type === 'Zone') {
          const zone = this.physics.add.staticSprite(object.x, object.y, null);
          zone.setOrigin(0, 0);
          zone.body.setSize(object.width, object.height);
          zone.body.setOffset(zone.width / 2, zone.height / 2);
          zone.alpha = 0;
          this.zones.add(zone);
        }
      });
    });

    this.sys.animatedTiles.init(this.map);

    console.log('Map added');
  }

  addHero(x, y) {
    this.hero = new Unicorn(this, x, y);
    this.hero.setAmmo(new Bullets(this));
  }

  update(time, delta) {
    this.data.values.time += delta;
  }
}

export default Game;
