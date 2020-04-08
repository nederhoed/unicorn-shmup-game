import Phaser from 'phaser';
import config from './config';
import PreloadScene from './scenes/Preload';
import HUDScene from './scenes/HUD';
import GameScene from './scenes/Game';

new Phaser.Game(Object.assign(config, {
  scene: [PreloadScene, GameScene, HUDScene],
}));
