import Phaser from 'phaser';
import gameState from '../model/gameState';
import levels from '../data/levels';
import { makeTimeElapsedString } from '../utils/utils'

class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  init(data) {}

  preload() {}

  create(data) {
    this.add.text(10, 10, 'Menu', { font: '48px Arial', fill: '#000000' });

    // Add level menu buttons.
    const itemsPerRow = 3;
    for (let i = 0; i < levels.length; i ++) {
      const unlocked = i <= gameState.maxUnlockedLevel();
      const x = 80 + (i % itemsPerRow) * 150;
      const y = 140 + Math.floor(i / itemsPerRow) * 90;
      const button = this.add.text(x, y, levels[i].name, { font: '30px Arial', fill: '#000000' });
      button.alpha = unlocked ? 1 : 0.5;

      const highScore = gameState.getHighScore(i);
      let text = ''
      if (highScore !== undefined) {
        text += `Top Score: ${highScore}`
      }
      const bestTime = gameState.getBestTime(i);
      if (bestTime !== undefined) {
        text += `${text ? '\n': ''}Best Time: ${makeTimeElapsedString(bestTime)}`
      }
      if (text) {
        this.add.text(x, y + 35, text, { font: '12px Arial', fill: '#000000' });
      }

      if (unlocked) {
        button.setInteractive();
        // When menu button is clicked, switch to game scene and pass along the level to load.
        button.on('pointerup', () => this.scene.start('GameScene', { level: levels[i].key, levelIndex: i }));
      }
    }

  }

  update(time, delta) {}
}

export default Menu;