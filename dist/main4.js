import { stats, getRandomBetween, createFPSLimiter } from "./helpers.js";
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.textAlign = 'center';
const fpsIntervalElapsed = createFPSLimiter(15);
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890π∏∂∆‡µ¶Ψþÿ§ꟿꞶꞵꞗꜺꜾꝊꞜꟻꭄꬶꬼꭊ♭♪∇∂々アイウエオカキクケコサシスセソタチツテトナニヌネハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ';
const columnsArray = [];
let columnHeight = Math.ceil(canvas.height / 20) + 1;
let rowLength = Math.ceil(canvas.width / 20) + 1;
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
        ctx.shadowColor = '#00FF00';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#00FF00';
        ctx.font = '900 20px monospace';
        ctx.fillText(this.chars[this.y], this.x, this.y * 20);
    }
}
console.log('Canvas Size: ', canvas.width, canvas.height);
for (let i = 0; i < rowLength; i++) {
    columnsArray.push(new Column(i * 20));
}
const render = (now) => {
    requestAnimationFrame(render);
    if (fpsIntervalElapsed(now)) {
        stats.begin();
        ctx.shadowBlur = 0;
        ctx.shadowColor = '#000000';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        columnsArray.forEach(column => column.draw());
        stats.end();
    }
};
render(0);
