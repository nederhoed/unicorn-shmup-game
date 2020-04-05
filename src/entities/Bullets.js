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

  fireBullet(player) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      return bullet.fire(player);
    } else {
      return false;
    }
  }
}

export default Bullets;
