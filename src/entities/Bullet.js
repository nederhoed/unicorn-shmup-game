import Phaser from 'phaser';


class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'bullet-sheet', 0);
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(300);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.x > 500) {
        this.setActive(false);
        this.setVisible(false);
    }
  }
}

export default Bullet;
