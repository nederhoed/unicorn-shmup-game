import Phaser from 'phaser';
import gameState, { Dificulty } from '../model/gameState';
import levels from '../data/levels';
import { makeTimeElapsedString } from '../utils/utils'

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {}

  preload() {}

  create(data) {
    this.levelMenuItems = [];

    this.add.text(10, 10, 'Menu', { font: '48px Arial', fill: '#000000' });
    const dBtn = this.dificultyButton = this.add.text(620, 15, 'Dificulty: Junior', { font: '20px Arial', fill: '#000000' });
    dBtn.setOrigin(1, 0);
    dBtn.setInteractive();
    dBtn.on('pointerup', () => {
      if (gameState.getDificulty() === Dificulty.Junior) {
        gameState.setDificulty(Dificulty.Advanced);
      } else {
        gameState.setDificulty(Dificulty.Junior);
      }
      this.updateLabels();
    });
    
    // Add level menu buttons.
    const itemsPerRow = 3;
    for (let i = 0; i < levels.length; i ++) {

      const x = 80 + (i % itemsPerRow) * 150;
      const y = 140 + Math.floor(i / itemsPerRow) * 90;

      const menuItem = {
        levelLabel: this.add.text(x, y, levels[i].name, { font: '30px Arial', fill: '#000000' }),
        scoreLabel: this.add.text(x, y + 35, '', { font: '12px Arial', fill: '#000000' }),
      };

      // When menu button is clicked, switch to game scene and pass along the level to load.
      menuItem.levelLabel.on('pointerup', () => this.scene.start('GameScene', { level: levels[i].key, levelIndex: i }));

      this.levelMenuItems.push(menuItem);
    }

    this.updateLabels();
  }

  updateLabels() {
    if (gameState.getDificulty() === Dificulty.Junior) {
      this.dificultyButton.text = 'Dificulty: Junior';
    } else {
      this.dificultyButton.text = 'Dificulty: Advanced';
    }

    this.levelMenuItems.forEach((item, i) => {
      const unlocked = i <= gameState.maxUnlockedLevel();
      item.levelLabel.alpha = unlocked ? 1 : 0.5;
      if (unlocked) {
        item.levelLabel.setInteractive();
      } else {
        item.levelLabel.removeInteractive();
      }

      const highScore = gameState.getHighScore(i);
      let scoreText = ''
      if (highScore !== undefined) {
        scoreText += `Top Score: ${highScore}`
      }
      const bestTime = gameState.getBestTime(i);
      if (bestTime !== undefined) {
        scoreText += `${scoreText ? '\n': ''}Best Time: ${makeTimeElapsedString(bestTime)}`
      }
      item.scoreLabel.text = scoreText;
    })
  }

  update(time, delta) {}
}

export default Menu;