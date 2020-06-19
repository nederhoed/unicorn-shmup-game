import Phaser from 'phaser'

export const makeTimeElapsedString = (ms) => {
  const pad = Phaser.Utils.String.Pad;
  const s = Math.floor(ms / 1000);
  const mins = Math.floor(s / 60);
  const secs = s - mins * 60;
  return `${pad(`${mins}`, 2, '0', 1)}:${pad(`${secs}`, 2, '0', 1)}`;
}