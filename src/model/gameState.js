import Phaser from 'phaser'


class GameState extends Phaser.Events.EventEmitter {
  
  constructor () {
    super()
    this._data = {
      highScores: [],
    };
    this.load();
  }

  // Loads previously saved game state from local storage.
  load() {
    const saveData = JSON.parse(localStorage.getItem('save-data'));
    if (saveData) {
      this._data = saveData;
    }
  }

  // Saves current game state to local storage.
  save() {
    localStorage.setItem('save-data', JSON.stringify(this._data));
  }

  // Clears previously saved game state from local storage
  clearSavedData() {
    localStorage.clear();
  }

  maxUnlockedLevel() {
    return this._data.highScores.length;
  }

  getHighScore(levelIndex) {
    return this._data.highScores[levelIndex];
  }

  submitScore(levelIndex, score) {
    const currentMax = this.getHighScore(levelIndex) || 0;
    this._data.highScores[levelIndex] = Math.max(score, currentMax);
    this.save();
  }

}

const gameState = new GameState();

export default gameState;