import Phaser from 'phaser'

// To avoid weird bugs, update this if the format of the data being saved changes.
const SaveName = 'save-data-1';

class GameState extends Phaser.Events.EventEmitter {
  
  constructor () {
    super()
    this._data = {
      highScores: [],
      bestTimes: [],
    };
    this.load();
  }

  // Loads previously saved game state from local storage.
  load() {
    const saveData = JSON.parse(localStorage.getItem(SaveName));
    if (saveData) {
      this._data = saveData;
    }
  }

  // Saves current game state to local storage.
  save() {
    localStorage.setItem(SaveName, JSON.stringify(this._data));
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

  getBestTime(levelIndex) {
    return this._data.bestTimes[levelIndex];
  }

  submitScore(levelIndex, score, time) {
    const currentHighScore = this.getHighScore(levelIndex) || Number.MIN_SAFE_INTEGER;
    this._data.highScores[levelIndex] = Math.max(score, currentHighScore);

    const currentBestTime = this.getBestTime(levelIndex) || Number.MAX_SAFE_INTEGER;
    this._data.bestTimes[levelIndex] = Math.min(time, currentBestTime);

    this.save();
  }

}

const gameState = new GameState();

export default gameState;