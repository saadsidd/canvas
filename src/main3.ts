
import { stats, createCenterCrosshair, createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";
console.log('main3');

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
const particlesArray: Particle[] = [];
const fpsIntervalElapsed = createFPSLimiter(60);
const drawCenterCrosshair = createCenterCrosshair();

const mouse: Mouse = {
  x: 0,
  y: 0, 
  clicked: false,
  update(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}

window.addEventListener('resize', (): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.addEventListener('mousedown', (): void => { mouse.clicked = true });
canvas.addEventListener('mouseup', (): void =>  { mouse.clicked = false });
canvas.addEventListener('mouseleave', (): void => { mouse.clicked = false });

canvas.addEventListener('mousemove', (event: MouseEvent): void => {
  mouse.update(event.offsetX, event.offsetY);
  if (mouse.clicked && particlesArray.length < 1000) {
    particlesArray.push(new Particle(mouse, canvas));
  }
});

canvas.addEventListener('click', (event: MouseEvent): void => {
  if (particlesArray.length < 1000) {
    mouse.update(event.offsetX, event.offsetY);
    particlesArray.push(new Particle(mouse, canvas));
  }
});

export class Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  isDone: boolean;

  static hue = Math.floor(Math.random() * 360);

  constructor(mouse: Mouse, canvas: HTMLCanvasElement) {
    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = 6;
    this.color = `hsl(${Particle.hue}, 100%, 50%)`;
    this.isDone = false;

    Particle.hue += 1;
  }

  draw(): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const render = (now: DOMHighResTimeStamp) => {
  
  if (fpsIntervalElapsed(now)) {
    stats.begin();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawCenterCrosshair(ctx, canvas);
    
    particlesArray.forEach((particle: Particle, index: number): void => {
      particle.draw();
      if (particle.isDone) particlesArray.splice(index, 1);
    });
    
    stats.end();
  }

  requestAnimationFrame(render);

}

render(0);