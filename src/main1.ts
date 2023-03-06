// Shrinking Color Particles Project

import { getRandomBetween, createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";

const trailsCheckbox = document.getElementById('trails-checkbox') as HTMLInputElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
const particlesArray: Particle[] = [];
const fpsIntervalElapsed = createFPSLimiter(60);
let showTrails = false;

const mouse: Mouse = {
  x: 0,
  y: 0,
  clicked: false,
  update(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
};

trailsCheckbox.addEventListener('change', function(): void { showTrails = this.checked });

window.addEventListener('resize', (): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
canvas.addEventListener('mousedown', (): void => { mouse.clicked = true });
canvas.addEventListener('mouseup', (): void =>  { mouse.clicked = false });
canvas.addEventListener('mouseleave', (): void => { mouse.clicked = false });

canvas.addEventListener('mousemove', (event: MouseEvent): void => {
  if (mouse.clicked) {
    mouse.update(event.offsetX, event.offsetY);
    for (let i = 0; i < 5; i++) {
      particlesArray.push(new Particle());
    }
  }

});

class Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  color: string;
  isDone: boolean;

  static hue = Math.floor(Math.random() * 360);

  constructor() {
    const speed = 2;

    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = getRandomBetween(6, 10);
    this.speedX = getRandomBetween(-speed, speed);
    this.speedY = getRandomBetween(-speed, speed);
    this.color = `hsl(${Particle.hue}, 100%, 50%)`;
    this.isDone = false;

    Particle.hue += 0.5;
  }

  shrink(): void {
    if (this.radius > 0.2) this.radius -= 0.15;
  }

  move(): void {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update(): void {
    if (this.radius <= 0.3) this.isDone = true;
    this.shrink();
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
    
    particlesArray.forEach((particle: Particle, index: number): void => {
      particle.update();
      if (particle.isDone) particlesArray.splice(index, 1);
    });
    
  }
  
  requestAnimationFrame(render);

}

render(0);