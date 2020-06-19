import Phaser from 'phaser'

// To avoid weird bugs, update this if the format of the data being saved changes.
const SaveName = 'save-data-2';

export const Dificulty = {
  Junior: 0,
  Advanced: 1
}

const Defaults = {
  dificulty: Dificulty.Junior,
}

class GameState extends Phaser.Events.EventEmitter {
  
  constructor () {
    super()
    this._data = {
      dificulty: Defaults.dificulty,
      highScores: [[], []],
      bestTimes: [[], []],
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
    return this._data.highScores[this._data.dificulty].length;
  }

  getDificulty() {
    return this._data.dificulty;
  }

  setDificulty(value) {
    for (const key in Dificulty) {
      if (Dificulty[key] === value) {
        this._data.dificulty = value;
        this.save();
        return;
      }
    }
  }

  getHighScore(levelIndex) {
    return this._data.highScores[this._data.dificulty][levelIndex];
  }

  getBestTime(levelIndex) {
    return this._data.bestTimes[this._data.dificulty][levelIndex];
  }

  submitScore(levelIndex, score, time) {
    const currentHighScore = this.getHighScore(levelIndex) || Number.MIN_SAFE_INTEGER;
    this._data.highScores[this._data.dificulty][levelIndex] = Math.max(score, currentHighScore);

    const currentBestTime = this.getBestTime(levelIndex) || Number.MAX_SAFE_INTEGER;
    this._data.bestTimes[this._data.dificulty][levelIndex] = Math.min(time, currentBestTime);

    this.save();
  }

}

const gameState = new GameState();

export default gameState;