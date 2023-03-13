// TBD

import { createStats, createFPSLimiter } from "./helpers.js";

const canvas = document.getElementById('foreground') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
ctx.imageSmoothingEnabled = false;

const fpsIntervalElapsed = createFPSLimiter(60);
const stats = createStats();

const keyboard: {[index: string]: any} = {};

window.addEventListener('keydown', (event) => { keyboard[event.code] = true });
window.addEventListener('keyup', (event) => { keyboard[event.code] = false });

class ActionAnimation {
  spritesheet: HTMLImageElement;
  numOfFrames: number;
  currentFrame: number;
  fpsCounter: number;

  constructor(url: string, numOfFrames: number) {
    this.spritesheet = new Image();
    this.spritesheet.src = url;

    this.numOfFrames = numOfFrames;
    this.fpsCounter = 0;
    this.currentFrame = 0;
  }

  get frame() {
    this.fpsCounter++;
    if (this.fpsCounter % 10 === 0) this.currentFrame++; // limit animation framerate
    if (this.currentFrame === this.numOfFrames) this.currentFrame = 0; // reached end of frames so reset
    return this.currentFrame;
  }
}

const player: {[index: string]: any} = {

  posX: canvas.width / 2,
  posY: 310,
  speedX: 0,
  speedY: 0,
  isJumping: false,
  direction: 'right',
  currentAction: 'idle',
  
  actions: {
    idle: {
      left: new ActionAnimation('../assets/warrior/idle-left.png', 6),
      right: new ActionAnimation('../assets/warrior/idle-right.png', 6)
    },
    run: {
      left: new ActionAnimation('../assets/warrior/run-left.png', 8),
      right: new ActionAnimation('../assets/warrior/run-right.png', 8)
    },
    jump: {
      left: new ActionAnimation('../assets/warrior/jump-left.png', 3),
      right: new ActionAnimation('../assets/warrior/jump-right.png', 3)
    },
    fall: {
      left: new ActionAnimation('../assets/warrior/fall-left.png', 3),
      right: new ActionAnimation('../assets/warrior/fall-right.png', 3)
    }
  },

  set action(incomingAction: string) {
    // If incoming action is new, reset current action's frames so it plays from beginning next time it's needed
    if (this.currentAction !== incomingAction) this.actions[this.currentAction][this.direction].currentFrame = 0;
    this.currentAction = incomingAction;
  },

  move() {
    if (this.isJumping && this.speedY > -10) {
      this.speedY -= 0.15;
    }

    if (this.posY > 310) {
      this.isJumping = false;
      this.posY = 310;
      this.speedY = 0;
    }

    if (this.speedY > 0) {
      this.action = 'jump';
    } else if (this.speedY < 0) {
      this.action = 'fall';
    }

    console.log(this.speedY, this.currentAction);

    this.posX += this.speedX;
    this.posY += -this.speedY;
  },

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      this.actions[this.currentAction][this.direction].spritesheet,       // image
      this.actions[this.currentAction][this.direction].frame * 64, 0,     // source x, y
      64, 44,                                                             // source width, height
      this.posX - 85, this.posY,                                          // canvas x, y
      171, 117                                                            // canvas width, height
    );
  },

  update() {
    this.move();
    this.draw();
  }

};

const inputsUpdate = (): void => {

  if (keyboard['ArrowUp'] && !player.isJumping) {
    player.isJumping = true;
    player.speedY = 6;
  }

  if (keyboard['ArrowRight'] && player.posX < 1000) {
    player.direction = 'right';
    player.action = 'run';
    player.speedX = 6;

  } else if (keyboard['ArrowLeft'] && player.posX > 30) {
    player.direction = 'left';
    player.action = 'run';
    player.speedX = -6;

  } else {
    player.currentAction = 'idle';
    player.speedX = 0;
  }

} 

const render = (now: DOMHighResTimeStamp) => {
  
  requestAnimationFrame(render);
  
  if (fpsIntervalElapsed(now)) {
    stats.begin();

    inputsUpdate();
    player.update();

    stats.end();
  }

}

render(0);