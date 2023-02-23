// spinning white/color spirals

import { stats, getDelta, createCenterCrosshair, createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";
console.log('main2');

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d')!;
const particlesArray: Particle[] = [];
const fpsIntervalElapsed = createFPSLimiter(60);
const drawCenterCrosshair = createCenterCrosshair();

let dt = 0;
let hue = 0;

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

// canvas.addEventListener('mousemove', (event: MouseEvent): void => {
//   if (mouse.clicked) {
//     mouse.update(event.offsetX, event.offsetY);
//     for (let i = 0; i < 5; i++) {
//       particlesArray.push(new Particle());
//     }
//   }

// });

canvas.addEventListener('mousemove', (event: MouseEvent): void => {
  mouse.update(event.offsetX, event.offsetY);
  if (mouse.clicked && particlesArray.length < 200) {
    particlesArray.push(new Particle());
  }
});

// canvas.addEventListener('mousemove', (event: MouseEvent): void => {
//   mouse.update(event.offsetX, event.offsetY);
// });

canvas.addEventListener('click', (event: MouseEvent): void => {
  if (particlesArray.length < 200) {
    mouse.update(event.offsetX, event.offsetY);
    particlesArray.push(new Particle());
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

  targetX: number;
  targetY: number;
  i: number;

  constructor() {
    const speed = 60;

    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = 6;
    // this.speedX = Math.random() < 0.5 ? -speed : speed;
    // this.speedY = Math.random() < 0.5 ? -speed : speed;
    this.speedX = 0;
    this.speedY = 0;
    // this.color = `hsl(${getRandom(0, 360)}, 100%, 50%)`;
    // this.color = 'white';
    this.color = `hsl(${hue}, 100%, 50%)`;
    this.isDone = false;

    this.targetX = canvas.width / 2;
    this.targetY = canvas.height / 2;
    this.i = 0;

    // this.x = this.targetX;
    // this.y = this.targetY;
  }

  move(): void {

    this.i++;

    const x1 = this.x - this.targetX;
    const y1 = this.y - this.targetY;

    const x2 = x1 * Math.cos(this.i * 0.001) - y1 * Math.sin(this.i * 0.001);
    const y2 = x1 * Math.sin(this.i * 0.001) + y1 * Math.cos(this.i * 0.001);

    this.x = x2 + this.targetX;
    this.y = y2 + this.targetY;
    // const dx = this.targetX - this.x;
    // const dy = this.targetY - this.y;
    // const distance = Math.sqrt(dx * dx + dy * dy);
    // if (distance > 100) {
    //   // console.log(distance);
    //   this.speedX = dx;
    //   this.speedY = dy;
    // } else {
    // this.i++;
    // this.speedX = 300 * Math.cos(this.i * 0.01);
    // this.speedY = 300 * Math.sin(this.i * 0.01);
    // }

    // // this.i++;
    // this.i++;
    // this.speedX = 300 * Math.cos(this.i * 0.01);
    // this.speedY = 300 * Math.sin(this.i * 0.01);

    // this.speedX = this.x * Math.cos(this.i * 0.01) - this.y * Math.sin(this.i * 0.01);
    // this.speedY = this.y * Math.cos(this.i * 0.01) + this.x * Math.sin(this.i * 0.01);

    // this.x += this.speedX * dt;
    // this.y += this.speedY * dt;
  }

  draw(): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  shrink(): void {
    if (this.radius > 0.2) this.radius -= 2 * dt;
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
    stats.begin();
    
    dt = getDelta();
    hue += 200 * dt;
  
    // Clear canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    drawCenterCrosshair(ctx, canvas);
  
    particlesArray.forEach((particle: Particle, index: number): void => {
      particle.update();
      if (particle.isDone) particlesArray.splice(index, 1);
    });
  
    stats.end();
  }

  requestAnimationFrame(render);
}

render(0);