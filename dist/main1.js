import { getRandomBetween, createFPSLimiter } from "./helpers.js";
const trailsCheckbox = document.getElementById('trails-checkbox');
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const particlesArray = [];
const fpsIntervalElapsed = createFPSLimiter(60);
let showTrails = false;
const mouse = {
    x: 0,
    y: 0,
    clicked: false,
    update(newX, newY) {
        this.x = newX;
        this.y = newY;
    }
};
trailsCheckbox.addEventListener('change', function () { showTrails = this.checked; });
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
    shrink() {
        if (this.radius > 0.2)
            this.radius -= 0.15;
    }
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
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
Particle.hue = Math.floor(Math.random() * 360);
const render = (now) => {
    if (fpsIntervalElapsed(now)) {
        if (showTrails) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        particlesArray.forEach((particle, index) => {
            particle.update();
            if (particle.isDone)
                particlesArray.splice(index, 1);
        });
    }
    requestAnimationFrame(render);
};
render(0);
