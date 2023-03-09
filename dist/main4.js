import { getRandomBetween, createFPSLimiter } from "./helpers.js";
const hueCheckbox = document.getElementById('hue-checkbox');
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const fpsIntervalElapsed = createFPSLimiter(15);
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890π∏∂∆‡µ¶Ψþÿ§ꟻ∂אהﬠפ♫ᴌΦϞϛ϶ЂЖѱᴓ々アイウエオカキクケコサシスセソタチツテトナニヌネハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ';
const columnsArray = [];
let columnHeight = Math.ceil(canvas.height / 20) + 1;
let rowLength = Math.ceil(canvas.width / 20) + 1;
let hue = 0;
let useHue = false;
hueCheckbox.addEventListener('change', function () { useHue = this.checked; });
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columnHeight = Math.ceil(canvas.height / 20) + 1;
    rowLength = Math.ceil(canvas.width / 20) + 1;
    columnsArray.length = 0;
    for (let i = 0; i < rowLength; i++) {
        columnsArray.push(new Column(i * 20));
    }
});
class Column {
    constructor(posX) {
        this.x = posX;
        this.y = 0;
        this.chars = [];
        this.setChars();
    }
    setChars() {
        this.chars.length = 0;
        for (let i = 0; i < columnHeight; i++) {
            this.chars.push(characters[getRandomBetween(0, characters.length - 1)]);
        }
    }
    draw() {
        if (this.y > columnHeight && Math.random() > 0.93) {
            this.y = 0;
            this.setChars();
        }
        else {
            this.y++;
        }
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        if (useHue) {
            ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        }
        else {
            ctx.shadowColor = '#00FF00';
            ctx.fillStyle = '#00FF00';
        }
        ctx.font = '900 20px monospace';
        ctx.fillText(this.chars[this.y], this.x, this.y * 20);
    }
}
for (let i = 0; i < rowLength; i++) {
    columnsArray.push(new Column(i * 20));
}
const render = (now) => {
    requestAnimationFrame(render);
    if (fpsIntervalElapsed(now)) {
        ctx.shadowBlur = 0;
        ctx.shadowColor = '#000000';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        columnsArray.forEach(column => column.draw());
        hue += 2;
    }
};
render(0);
