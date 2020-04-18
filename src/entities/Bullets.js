import Phaser from 'phaser';
import Bullet from './Bullet';


class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet
    });
  }

  killBullet(bullet) {
    console.log('bullet got killed');
    bullet.timer.remove();
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.body.reset(0, 0);
    bullet.removeAllListeners();
  }

  worldHitCallback(bulletHit, objectHit) {
    console.log('bullet hits map');
    this.killBullet(bulletHit);
  }

  fireBullet(player) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.body.reset(player.x, player.y+10);
      bullet.body.setAllowGravity(false);

      bullet.setFlipX(player.flipX);
      bullet.body.setVelocityX(
        (Math.abs(player.body.velocity.x) + bullet.speed) * (player.flipX ? -1 : 1)
      );

      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.anims.play('bullet');
      bullet.scale = 0.5;

      // Kill after X msec
      bullet.timer = bullet.scene.time.delayedCall(
        1199, () => {this.killBullet(bullet)});

      return true
    } else {
      return false;
    }
  }
}

export default Bullets;
