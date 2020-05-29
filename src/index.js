import Phaser from 'phaser';
import config from './config';
import BootScene from './scenes/Boot'
import PreloadScene from './scenes/Preload';
import MenuScene from './scenes/Menu';
import HUDScene from './scenes/HUD';
import GameScene from './scenes/Game';

new Phaser.Game(Object.assign(config, {
  scene: [BootScene, PreloadScene, MenuScene, GameScene, HUDScene],
}));
