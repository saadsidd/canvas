// @ts-ignore
import Stats from '../lib/stats.js';

export const stats = new Stats();
stats.dom.style.right = '0px';
stats.dom.style.left = '';
document.body.appendChild(stats.dom);

export const getRandom = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
}

let now = 0;
let then = 0;
let delta = 0;
export const getDelta = (): number => {
  now = performance.now();
  delta = (now - then) / 1000;
  then = now;

  // Limit delta for when coming back to browser tab after a while
  if (delta > 0.1) return 0.1;
  return delta;
}