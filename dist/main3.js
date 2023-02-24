import { stats, createCenterCrosshair, createFPSLimiter } from "./helpers.js";
console.log('main3');
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const particlesArray = [];
const fpsIntervalElapsed = createFPSLimiter(60);
const drawCenterCrosshair = createCenterCrosshair();
const mouse = {
    x: 0,
    y: 0,
    clicked: false,
    update(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
};
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
canvas.addEventListener('mousedown', () => { mouse.clicked = true; });
canvas.addEventListener('mouseup', () => { mouse.clicked = false; });
canvas.addEventListener('mouseleave', () => { mouse.clicked = false; });
canvas.addEventListener('mousemove', (event) => {
    mouse.update(event.offsetX, event.offsetY);
    if (mouse.clicked && particlesArray.length < 1000) {
        particlesArray.push(new Particle(mouse, canvas));
    }
});
canvas.addEventListener('click', (event) => {
    if (particlesArray.length < 1000) {
        mouse.update(event.offsetX, event.offsetY);
        particlesArray.push(new Particle(mouse, canvas));
    }
});
export class Particle {
    constructor(mouse, canvas) {
        this.x = mouse.x;
        this.y = mouse.y;
        this.radius = 6;
        this.color = `hsl(${Particle.hue}, 100%, 50%)`;
        this.isDone = false;
        Particle.hue += 1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
Particle.hue = Math.floor(Math.random() * 360);
const render = (now) => {
    if (fpsIntervalElapsed(now)) {
        stats.begin();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCenterCrosshair(ctx, canvas);
        particlesArray.forEach((particle, index) => {
            particle.draw();
            if (particle.isDone)
                particlesArray.splice(index, 1);
        });
        stats.end();
    }
    requestAnimationFrame(render);
};
render(0);
