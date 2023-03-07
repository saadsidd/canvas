// Spinning Particles Around Center Project

import { createCenterCrosshair, createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";

const trailsCheckbox = document.getElementById('trails-checkbox') as HTMLInputElement;
const clearButton = document.getElementById('clear-button') as HTMLButtonElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
const particlesArray: Particle[] = [];
const fpsIntervalElapsed = createFPSLimiter(60);
const drawCenterCrosshair = createCenterCrosshair();

let showTrails = false;

const mouse: Mouse = {
  x: 0,
  y: 0,
  clicked: false,
  update(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}

trailsCheckbox.addEventListener('change', function(): void { showTrails = this.checked });
clearButton.addEventListener('click', function(): void { particlesArray.length = 0 });

window.addEventListener('resize', (): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesArray.length = 0;
});
canvas.addEventListener('mousedown', (): void => { mouse.clicked = true });
canvas.addEventListener('mouseup', (): void =>  { mouse.clicked = false });
canvas.addEventListener('mouseleave', (): void => { mouse.clicked = false });

canvas.addEventListener('mousemove', (event: MouseEvent): void => {
  mouse.update(event.offsetX, event.offsetY);
  if (mouse.clicked && particlesArray.length < 1000) {
    particlesArray.push(new Particle());
  }
});

canvas.addEventListener('click', (event: MouseEvent): void => {
  if (particlesArray.length < 1000) {
    mouse.update(event.offsetX, event.offsetY);
    particlesArray.push(new Particle());
  }
});

class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  isDone: boolean;

  targetX: number;
  targetY: number;
  i: number;

  static hue = Math.floor(Math.random() * 360);

  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = 4;

    this.color = `hsl(${Particle.hue}, 100%, 50%)`;
    this.isDone = false;

    Particle.hue += 1;

    this.targetX = canvas.width / 2;
    this.targetY = canvas.height / 2;
    this.i = 0;
  }

  move(): void {

    this.i += 1;
    const x1 = this.x - this.targetX;
    const y1 = this.y - this.targetY;

    const x2 = x1 * Math.cos(this.i * 0.01) - y1 * Math.sin(this.i * 0.01);
    const y2 = x1 * Math.sin(this.i * 0.01) + y1 * Math.cos(this.i * 0.01);

    this.x = x2 + this.targetX;
    this.y = y2 + this.targetY;

  }

  draw(): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(): void {
    if (this.radius <= 0.3) this.isDone = true;
    this.move();
    this.draw();
  }
}

const render = (now: DOMHighResTimeStamp) => {

  if (fpsIntervalElapsed(now)) {

    // Clear canvas
    if (showTrails) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    drawCenterCrosshair(ctx, canvas);
  
    particlesArray.forEach((particle: Particle, index: number): void => {
      particle.update();
      if (particle.isDone) particlesArray.splice(index, 1);
    });
    
  }

  requestAnimationFrame(render);
}

render(0);