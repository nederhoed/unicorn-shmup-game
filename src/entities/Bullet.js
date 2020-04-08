import Phaser from 'phaser';


class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'bullet-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(20, 20);
    this.body.setOffset(28, 28);

    this.scene = scene;
    this.speed = 0.1;
    this._current_speed = 0;

    this.timer = '';
  }

  kill() {
    console.log('bullet got killed');
    this.timer.remove();
    this.setActive(false);
    this.setVisible(false);
    this.body.reset(0, 0);
    this.removeAllListeners();
  }

  worldHitCallback(bulletHit, objectHit) {
    console.log('bullet hits map');
    bulletHit.kill();
  }

  fire(player) {
    this.body.reset(player.x, player.y+10);
    this.body.setAllowGravity(false);

    console.log(player.body.velocity.x);
    if (player.flipX) {
      this.setFlipX(true);
      this._current_speed = -1 * this.speed + player.body.velocity.x/3000;
    } else {
      this.setFlipX(false);
      this._current_speed = this.speed + player.body.velocity.x/3000;
    }

    this.setActive(true);
    this.setVisible(true);
    this.anims.play('bullet');
    this.scale = 0.5;

    // Kill after X msec
    this.timer = this.scene.time.delayedCall(1199, () => {this.kill()});
    // this.scene.time.addEvent(,
    // });

    // this.scene.physics.add.collider(
    //   this,
    //   this.scene.map.getLayer('Ground').tilemapLayer,
    //   this.worldHitCallback
    // );

    // true if the bullet was fired succesfully
    return true;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.x += this._current_speed * delta;
  }
}

export default Bullet;
