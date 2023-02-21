import { stats, getRandomBetween, createFPSLimiter } from "./helpers.js";
const uncapCheckbox = document.getElementById('uncap-checkbox');
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const particlesArray = [];
const fpsIntervalElapsed = createFPSLimiter(60);
let dt = 0.05;
let hue = 0;
let uncapped = false;
const mouse = {
    x: 0,
    y: 0,
    clicked: false,
    update(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
};
uncapCheckbox.addEventListener('change', function () { uncapped = this.checked; });
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
canvas.addEventListener('mousedown', () => { mouse.clicked = true; });
canvas.addEventListener('mouseup', () => { mouse.clicked = false; });
canvas.addEventListener('mouseleave', () => { mouse.clicked = false; });
canvas.addEventListener('mousemove', (event) => {
    if (mouse.clicked) {
        mouse.update(event.offsetX, event.offsetY);
        for (let i = 0; i < 5; i++) {
            particlesArray.push(new Particle());
        }
    }
});
class Particle {
    constructor() {
        const speed = 60;
        this.x = mouse.x;
        this.y = mouse.y;
        this.radius = getRandomBetween(6, 10);
        this.speedX = getRandomBetween(-speed, speed);
        this.speedY = getRandomBetween(-speed, speed);
        this.color = `hsl(${hue}, 100%, 50%)`;
        this.isDone = false;
    }
    shrink() {
        if (this.radius > 0.2)
            this.radius -= 3 * dt;
    }
    move() {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        if (this.radius <= 0.3)
            this.isDone = true;
        this.shrink();
        this.move();
        this.draw();
    }
}
const render = (now) => {
    requestAnimationFrame(render);
    if (uncapped || fpsIntervalElapsed(now)) {
        stats.begin();
        hue += 200 * dt;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach((particle, index) => {
            particle.update();
            if (particle.isDone)
                particlesArray.splice(index, 1);
        });
        stats.end();
    }
};
render(0);
