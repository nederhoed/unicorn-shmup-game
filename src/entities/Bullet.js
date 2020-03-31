import Phaser from 'phaser';


class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'bullet-sheet', 0);
    this.scene = scene;
  }

  fire(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);
    this.anims.play('bullet');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y > this.scene.map.heightInPixels) {
        this.setActive(false);
        this.setVisible(false);
    }
  }
}

export default Bullet;
