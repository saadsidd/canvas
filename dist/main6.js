import { createStats, createFPSLimiter } from "./helpers.js";
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const fpsIntervalElapsed = createFPSLimiter(60);
const stats = createStats();
let maxBounce = 10;
const mouse = {
    x: 0,
    y: 0,
    clicked: false,
    update(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
};
const origin = {
    posX: 100,
    posY: 100,
    radius: 25,
    create() {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
};
canvas.addEventListener('click', (event) => {
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
const render = (now) => {
    requestAnimationFrame(render);
    if (fpsIntervalElapsed(now)) {
        stats.begin();
        stats.end();
    }
};
render(0);
