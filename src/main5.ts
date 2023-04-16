// TBD - Spritesheets?

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
  speed: number;
  isDone: boolean;

  constructor(url: string, numOfFrames: number, speed: number) {
    this.spritesheet = new Image();
    this.spritesheet.src = url;

    this.numOfFrames = numOfFrames;
    this.fpsCounter = 0;
    this.speed = speed;
    this.currentFrame = 0;
    this.isDone = false;
  }

  get frame() {
    this.fpsCounter++;
    if (this.fpsCounter % this.speed === 0) this.currentFrame++; // limit animation framerate
    if (this.currentFrame === 0) this.isDone = false;
    if (this.currentFrame === this.numOfFrames) {
      this.isDone = true;
      this.currentFrame = 0; // reached end of frames so reset
    }
    return this.currentFrame;
  }
}

const player: {[index: string]: any} = {

  posX: canvas.width / 2,
  posY: 310,
  speedX: 0,
  speedY: 0,
  isJumping: false,
  isAttacking: false,
  direction: 'right',
  currentAction: 'idle',
  
  actions: {
    idle: {
      left: new ActionAnimation('../assets/warrior/idle-left.png', 6, 9),
      right: new ActionAnimation('../assets/warrior/idle-right.png', 6, 9)
    },
    crouch: {
      left: new ActionAnimation('../assets/warrior/crouch-left.png', 4, 10),
      right: new ActionAnimation('../assets/warrior/crouch-right.png', 4, 10)
    },
    run: {
      left: new ActionAnimation('../assets/warrior/run-left.png', 8, 5),
      right: new ActionAnimation('../assets/warrior/run-right.png', 8, 5)
    },
    jump: {
      left: new ActionAnimation('../assets/warrior/jump-left.png', 3, 10),
      right: new ActionAnimation('../assets/warrior/jump-right.png', 3, 10)
    },
    fall: {
      left: new ActionAnimation('../assets/warrior/fall-left.png', 3, 10),
      right: new ActionAnimation('../assets/warrior/fall-right.png', 3, 10)
    },
    slide: {
      left: new ActionAnimation('../assets/warrior/slide-left.png', 5, 10),
      right: new ActionAnimation('../assets/warrior/slide-right.png', 5, 10)
    },
    dash: {
      left: new ActionAnimation('../assets/warrior/dash-left.png', 7, 10),
      right: new ActionAnimation('../assets/warrior/dash-right.png', 7, 10)
    },
    attack: {
      left: new ActionAnimation('../assets/warrior/attack-left.png', 12, 5),
      right: new ActionAnimation('../assets/warrior/attack-right.png', 12, 5)
    }
  },

  set action(incomingAction: string) {
    // If incoming action is new, reset current action's frames so it plays from beginning next time it's needed
    if (this.currentAction !== incomingAction) this.actions[this.currentAction][this.direction].currentFrame = 0;
    this.currentAction = incomingAction;
  },

  move() {
    if (this.currentAction === 'attack' && this.actions[this.currentAction][this.direction].isDone) {
      this.isAttacking = false;
    }

    if (this.isJumping && this.speedY > -10) {
      this.speedY -= 0.35;
    }

    if (this.posY > 310) {
      this.isJumping = false;
      this.posY = 310;
      this.speedY = 0;
    }

    if (this.speedX !== 0) this.action = 'run';

    if (this.speedY > 0) {
      this.action = 'jump';
    } else if (this.speedY < 0) {
      this.action = 'fall';
    }

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

  if (keyboard['KeyZ'] && !player.isAttacking) {
    player.isAttacking = true;
    player.action = 'attack';
  }

  if (!player.isAttacking) {

    if (keyboard['ArrowUp'] && !player.isJumping) {
      player.isJumping = true;
      player.speedY = 10;
    }

    if (keyboard['ArrowRight'] && player.posX < 1000) {
      player.direction = 'right';
      player.speedX = 6;
  
    } else if (keyboard['ArrowLeft'] && player.posX > 30) {
      player.direction = 'left';
      player.speedX = -6;
  
    } else {
      player.currentAction = 'idle';
      player.speedX = 0;
    }

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