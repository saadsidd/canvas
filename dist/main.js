import { stats, getRandom, getDelta } from "./helpers.js";
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const particlesArray = [];
let dt = 0;
let hue = 0;
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
        this.radius = getRandom(6, 10);
        this.speedX = getRandom(-speed, speed);
        this.speedY = getRandom(-speed, speed);
        this.color = `hsl(${hue}, 100%, 50%)`;
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
        this.shrink();
        this.move();
        this.draw();
    }
}
const render = () => {
    stats.begin();
    dt = getDelta();
    hue += 200 * dt;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle, index) => {
        particle.update();
        if (particle.radius <= 0.3)
            particlesArray.splice(index, 1);
    });
    stats.end();
    requestAnimationFrame(render);
};
render();
