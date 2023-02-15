import { stats, getRandom, getDelta } from "./helpers.js";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d')!;
const particlesArray: Particle[] = [];
let dt = 0;
let hue = 0;

const mouse: {
  x: number;
  y: number;
  clicked: boolean;
  update(x: number, y: number): void;
} = {
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

  constructor() {
    const speed = 60;

    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = getRandom(6, 10);
    this.speedX = getRandom(-speed, speed);
    this.speedY = getRandom(-speed, speed);
    // this.color = `hsl(${getRandom(0, 360)}, 100%, 50%)`;
    this.color = `hsl(${hue}, 100%, 50%)`;
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
    this.shrink();
    this.move();
    this.draw();
  }
}

const render = () => {
  stats.begin();
  
  dt = getDelta();
  hue += 200 * dt;

  // Clear canvas
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particlesArray.forEach((particle: Particle, index: number): void => {
    particle.update();
    if (particle.radius <= 0.3) particlesArray.splice(index, 1);
  });

  stats.end();
  requestAnimationFrame(render);
}

render();