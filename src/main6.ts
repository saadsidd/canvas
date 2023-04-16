// TBD - Matter.js?

import { createStats, createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;

const fpsIntervalElapsed = createFPSLimiter(60);
const stats = createStats();

let maxBounce = 10;

const mouse: Mouse = {
  x: 0,
  y: 0,
  clicked: false,
  update(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}

const origin: {
  posX: number;
  posY: number;
  radius: number;
  create(): void;
} = {
  posX: 100,
  posY: 100,
  radius: 25,
  create() {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

canvas.addEventListener('click', (event: MouseEvent): void => {
  mouse.update(event.offsetX, event.offsetY);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
});

ctx.fillStyle = '#ff0000';
ctx.beginPath();
ctx.arc(100, 100, 25, 0, Math.PI * 2);
ctx.fill();

const render = (now: DOMHighResTimeStamp) => {
  
  requestAnimationFrame(render);

  if (fpsIntervalElapsed(now)) {
    stats.begin();

    // Clear canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ctx.fillStyle = '#ff0000';
    // ctx.fillRect(50, 50, 50, 50);

    stats.end();
  }

}

render(0);