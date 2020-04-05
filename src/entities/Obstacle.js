import Phaser from 'phaser';


class Obstacle extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, value) {
    super(scene, x, y, 'bullet-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(20, 20);
    this.body.setOffset(28, 28);
    this.body.setAllowGravity(false);

    this.scene = scene;
    this.value = value;
    this.multipleOf = 2;

    this.setActive(true);
    this.setVisible(true);
    this.anims.play('bullet');
    this.scale = 0.5;

    // Show number
    this.text = scene.add.text(
      x-10, y-30, this.value, {fontFamily: '"Roboto Condensed"', fontSize: 24});
//    this.text = scene.add.dynamicBitmapText(x, y-20, 'desyrel', '99', 72);
  }

  isFriendly() {
    return this.value % this.multipleOf === 0;
  }

  kill() {
    this.setActive(false);
    this.setVisible(false);
//    this.body.reset(0, 0);
    this.text.setText('');
  }

  getValue() {
    return this.value;
  }

  setValue(v) {
    this.value = v;
  }

  bulletHitCallback(objectHit, bulletHit) {
    // Remove bullet from game
    if (bulletHit.active && objectHit.active) {
      console.log('bullet hits obstacle');
      console.log(objectHit.getValue());
      bulletHit.kill();
      // Process hit: countdown
      var v = objectHit.getValue();
      if (v > 1) {
        objectHit.setValue(v-1);
      } else {
        objectHit.kill();
      }
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.text.setText(this.value);
    if (this.isFriendly()) {
      this.text.setColor('#ffffff');
      this.text.setBackgroundColor('#00ff00');
    } else {
      this.text.setColor('#00ffff');
      this.text.setBackgroundColor('#ff0000');
    }
  }
}

export default Obstacle;
