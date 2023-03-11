import { createStats, createFPSLimiter } from "./helpers.js";
const canvas = document.getElementById('foreground');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const fpsIntervalElapsed = createFPSLimiter(60);
const stats = createStats();
const keyboard = {};
window.addEventListener('keydown', (event) => { keyboard[event.code] = true; });
window.addEventListener('keyup', (event) => { keyboard[event.code] = false; });
class ActionAnimation {
    constructor(url, numOfFrames) {
        this.spritesheet = new Image();
        this.spritesheet.src = url;
        this.numOfFrames = numOfFrames;
        this.currentFrame = -1;
    }
    get frame() {
        this.currentFrame++;
        if (this.currentFrame === this.numOfFrames)
            this.currentFrame = 0;
        return this.currentFrame;
    }
}
const player = {
    posX: canvas.width / 2,
    posY: 250,
    animationFPSCounter: 0,
    direction: 'right',
    currentAction: 'idleRight',
    actions: {
        idleRight: new ActionAnimation('../assets/warrior/idle-right.png', 6),
        idleLeft: new ActionAnimation('../assets/warrior/idle-left.png', 6),
        runRight: new ActionAnimation('../assets/warrior/run-right.png', 8),
        runLeft: new ActionAnimation('../assets/warrior/run-left.png', 8),
    },
    setAction(incomingAction) {
        if (this.currentAction !== incomingAction)
            this.actions[this.currentAction].currentFrame = -1;
        this.currentAction = incomingAction;
    },
    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.actions[this.currentAction].spritesheet, this.actions[this.currentAction].frame * 64, 0, 64, 44, this.posX - 128, this.posY, 256, 176);
    },
    update() {
        this.animationFPSCounter++;
        if (this.animationFPSCounter % 7 === 0)
            this.draw();
    }
};
const inputsUpdate = () => {
    if (keyboard['ArrowRight']) {
        player.setAction('runRight');
    }
    else if (keyboard['ArrowLeft']) {
        player.setAction('runLeft');
    }
    else {
        player.setAction('idleRight');
    }
};
const render = (now) => {
    requestAnimationFrame(render);
    if (fpsIntervalElapsed(now)) {
        stats.begin();
        inputsUpdate();
        player.update();
        stats.end();
    }
};
render(0);
