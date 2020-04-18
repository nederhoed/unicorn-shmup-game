import Phaser from 'phaser';


class Obstacle extends Phaser.GameObjects.Container {

  constructor(scene, x, y, base_number, value) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Obstacle appearance
    this.fontSize = 22;
    this.ColorFriendly = '#ffffff';
    this.backgroundColorFriendly = '#00ff00';
    this.ColorUnfriendly = '#00ffff';
    this.backgroundColorUnfriendly = '#ff0000';

    this.multipleOf = base_number;
    this.value = value;

    this.setActive(true);
    this.setVisible(true);
//    this.anims.play('bullet');
//    this.scale = 0.5;

    // Show number
    this.text = scene.add.text(
      0, 0, this.value, {fontFamily: '"Roboto Condensed"', fontSize: 22});
    // Keep in this container
    this.add([this.text])

    // TODO: Do we want to make it prettier with BitmapText?
//    this.text = scene.add.dynamicBitmapText(x, y-20, 'desyrel', '99', 72);

    // Enforce display colors
    this.setValue(value);
  }

  isFriendly() {
    return this.value % this.multipleOf === 0;
  }
  getScore() {
    return Math.floor(this.value / this.multipleOf);
  }

  kill() {
    // this.text.setText('');
//    this.scene.obstacles.remove(this);
    super.destroy();
  }

  processHit() {
    this.setValue(this.getValue()-1);
    if (this.getScore() === 0) {
      this.kill();
    }
  }

  static playerHitsObstacleCallback(playerHit, objectHit) {
    if (playerHit.active && objectHit.active) {
      console.log('player hits obstacle');
      const modifier = objectHit.isFriendly() ? 1 : -1;
      objectHit.emit('collected', objectHit.getScore() * modifier);
      // Remove obstacle from game
      objectHit.kill();
    }
  }

  getValue() {
    return this.value;
  }

  setValue(v) {
    this.value = v;
    // Update appearance
    this.text.setText(this.value);
    const friend = this.isFriendly();
    this.text.setColor(
      friend ? this.ColorFriendly : this.ColorUnfriendly
    );
    this.text.setBackgroundColor(
      friend ? this.backgroundColorFriendly : this.backgroundColorUnfriendly
    );
    // Center align to position
    const c = 1 + Math.floor(Math.log10(this.value));
    this.body.setSize(2+c*this.fontSize/2, 2+this.fontSize);
    this.body.setOffset(-c*this.fontSize/4, -1);
    this.body.setAllowGravity(false);

    this.text.setPosition(-c*this.fontSize/4, 0);
  }
}

export default Obstacle;
