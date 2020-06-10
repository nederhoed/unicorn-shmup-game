import Phaser, {Data, Scenes} from 'phaser';

class HUDScene extends Phaser.Scene {
  constructor() {
    super({key: 'HUDScene'});
  }

  preload() {}

  create(data) {
    const { game } = data;

    //  Add text objects to display the current score and lives.
    const scoreLabel = this.add.text(10, 10, '', { font: '48px Arial', fill: '#000000' });
    const livesLabel = this.add.text(630, 10, '', { font: '40px Arial', fill: '#000000' });
    livesLabel.setOrigin(1, 0);

    const updateLabels = () => {
      scoreLabel.setText(`Score: ${game.data.values.score}`);
      livesLabel.setText('❤️'.repeat(game.data.values.lives));
    }

    updateLabels();
    // Subscribe to data changes on the game scene.
    game.data.events.on(Data.Events.CHANGE_DATA, updateLabels);
    // Unsubscribe when this scene shuts down
    this.events.once(
      Scenes.Events.SHUTDOWN, 
      () => game.data.events.off(Data.Events.CHANGE_DATA, updateLabels)
    );
  }
}

export default HUDScene;
