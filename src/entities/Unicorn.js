import Phaser from 'phaser';

class Unicorn extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'unicorn-fly-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.anims.play('unicorn-flying');
    this.body.setCollideWorldBounds(true);
    this.scale = 0.25;
    this.body.setSize(120, 160);
    this.body.setOffset(60, 80);
  }
}

export default Unicorn;
