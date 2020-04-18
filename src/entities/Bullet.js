import Phaser from 'phaser';


class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'bullet-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(20, 20);
    this.body.setOffset(28, 28);

    this.speed = 200;

    this.timer = '';
  }
}

export default Bullet;
