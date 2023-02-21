import { stats, getRandomBetween, getDelta, createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";

const uncapCheckbox = document.getElementById('uncap-checkbox') as HTMLInputElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
const particlesArray: Particle[] = [];
const fpsIntervalElapsed = createFPSLimiter(60);

let dt = 0.05;
let hue = 0;
let uncapped = false;

const mouse: Mouse = {
  x: 0,
  y: 0,
  clicked: false,
  update(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}

uncapCheckbox.addEventListener('change', function(): void { uncapped = this.checked });

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

  constructor() {
    const speed = 60;

    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = getRandomBetween(6, 10);
    this.speedX = getRandomBetween(-speed, speed);
    this.speedY = getRandomBetween(-speed, speed);
    // this.color = `hsl(${getRandom(0, 360)}, 100%, 50%)`;
    this.color = `hsl(${hue}, 100%, 50%)`;
    this.isDone = false;
  }

  shrink(): void {
    if (this.radius > 0.2) this.radius -= 3 * dt;
  }

  move(): void {
    this.x += this.speedX * dt;
    this.y += this.speedY * dt;
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

  requestAnimationFrame(render);

  if (uncapped || fpsIntervalElapsed(now)) {
    stats.begin();
    
    // dt = getDelta();
    hue += 200 * dt;
  
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    particlesArray.forEach((particle: Particle, index: number): void => {
      particle.update();
      if (particle.isDone) particlesArray.splice(index, 1);
    });
  
    stats.end();
  }


}

render(0);