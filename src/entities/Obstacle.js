import Phaser from 'phaser';


class Obstacle extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, base_number, value) {
    super(scene, x, y, 'bullet-sheet', 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(22, 40);
    this.body.setOffset(25, 16);
    this.body.setAllowGravity(false);

    this.scene = scene;
    this.multipleOf = base_number;
    this.value = value;
    this.value_changed = true;

    this.setActive(true);
    this.setVisible(true);
    this.anims.play('bullet');
    this.scale = 0.5;

    // Show number
    this.text = scene.add.text(
      x-10, y-30, this.value, {fontFamily: '"Roboto Condensed"', fontSize: 22});
//    this.text = scene.add.dynamicBitmapText(x, y-20, 'desyrel', '99', 72);
  }

  isFriendly() {
    return this.value % this.multipleOf === 0;
  }
  getScore() {
    return parseInt(this.value / this.multipleOf);
  }

  kill() {
    this.text.setText('');
//    this.scene.obstacles.remove(this);
    super.destroy();
  }

  getValue() {
    return this.value;
  }

  setValue(v) {
    this.value = v;
    this.value_changed = true;
  }

  bulletHitCallback(objectHit, bulletHit) {
    // Remove bullet from game
    if (bulletHit.active && objectHit.active) {
      console.log('bullet hits obstacle');
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
    this.text.setPosition(this.body.x, this.body.y);
    if (this.value_changed) {
      // Update display
      this.text.setText(this.value);
      if (this.isFriendly()) {
        this.text.setColor('#ffffff');
        this.text.setBackgroundColor('#00ff00');
      } else {
        this.text.setColor('#00ffff');
        this.text.setBackgroundColor('#ff0000');
      }
      this.value_changed = false;
    }
  }
}

export default Obstacle;
