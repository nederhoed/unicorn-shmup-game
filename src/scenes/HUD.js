import Phaser from 'phaser';


class HUDScene extends Phaser.Scene {
  constructor() {
    super({key: 'HUDScene'});
  }

  preload() {}

  scoreHandler(value) {
    console.log('addScore');

    this.score += value;
    this.info.setText('Score: ' + this.score);
  }

  create(data) {
    // TODO: move score and lives to GameScene?
    this.lives = 3;
    this.score = 0;
    //  Our Text object to display the Score
    this.info = this.add.text(10, 10, 'Score: 0', { font: '48px Arial', fill: '#000000' });

    //  Listen for events from the Game Scene
    var ourGame = this.scene.get('GameScene');
    ourGame.events.on('addScore', (value) => {this.scoreHandler(value)}, this);
  }
}

export default HUDScene;
