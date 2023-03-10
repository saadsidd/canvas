// @ts-ignore
import Stats from '../lib/stats.js';


// Add an FPS tracker to top right corner
export const createStats = () => {
  const stats = new Stats();
  stats.dom.style.right = '0px';
  stats.dom.style.left = '';
  stats.dom.style.top = '';
  document.body.appendChild(stats.dom);

  return stats;
}


// Get random number between two numbers (min and max inclusive)
export const getRandomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Returns function to draw small '+' in center of canvas
export const createCenterCrosshair = () => {
  const crosshair = new Image();
  crosshair.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFAAAA////pdmf3QAAAAJ0Uk5TAP9bkSK1AAAAE0lEQVR4nGNgbGDARP//gxA2KQAFtgsLandQLgAAAABJRU5ErkJggg==';

  return (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.drawImage(crosshair, (canvas.width / 2) - (crosshair.width / 2), (canvas.height / 2) - (crosshair.height / 2));
  }
}


let now = 0;
let then = 0;
let delta = 0;
export const getDelta = (): number => {
  now = performance.now();
  delta = (now - then) / 1000;
  then = now;

  if (delta > 0.1) return 0.01;  // Limit delta for when coming back to browser tab after a while

  return delta;
}

export const createFPSLimiter = (fps: number) => {
  let fpsInterval = 1000 / fps;
  let before = performance.now();
  let elapsed = 0;

  return (now: DOMHighResTimeStamp): boolean => {
    elapsed = now - before;
  
    if (elapsed > fpsInterval) {
      before = now - (elapsed % fpsInterval);
      return true;
    }
  
    return false;
  }
}