// Smoothed Pen Drawing App

import { createFPSLimiter } from "./helpers.js";
import Mouse from "./interfaces/mouse.js";

const radiusInput = document.getElementById('dot-radius') as HTMLInputElement;
const colorInput = document.getElementById('color-select') as HTMLInputElement;
const smoothnessInput = document.getElementById('smoothness') as HTMLInputElement;
const clearButton = document.getElementById('clear-button') as HTMLButtonElement;

const dotCanvas = document.getElementById('dot-canvas') as HTMLCanvasElement;
dotCanvas.width = window.innerWidth;
dotCanvas.height = window.innerHeight;
const dotCTX = dotCanvas.getContext('2d')!;

const drawingCanvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
drawingCanvas.width = window.innerWidth;
drawingCanvas.height = window.innerHeight;
const drawingCTX = drawingCanvas.getContext('2d', { alpha: false })!;

const fpsIntervalElapsed = createFPSLimiter(60);

let dotRadius = parseFloat(radiusInput.value);
let color = colorInput.value;
let smoothness = parseInt(smoothnessInput.value);

const mouse: Mouse = {
  x: 0,
  y: 0,
  clicked: false,
  update(newX, newY) {
    this.x = newX;
    this.y = newY;
  }
}

const dot = {
  x: 50,
  y: 50,
  speedX: 0,
  speedY: 0,
  move() {
    const dx = (mouse.x - this.x) / smoothness;
    const dy = (mouse.y - this.y) / smoothness;
    this.x += dx;
    this.y += dy;
  },
  draw() {
    dotCTX.fillStyle = 'white';
    dotCTX.beginPath();
    dotCTX.arc(this.x, this.y, dotRadius, 0, Math.PI * 2);
    dotCTX.fill();
  },
  drawOnCanvas() {
    drawingCTX.strokeStyle = color;
    drawingCTX.lineWidth = dotRadius * 2;
    drawingCTX.lineCap = 'round';
    drawingCTX.lineTo(this.x, this.y);
    drawingCTX.stroke();
  },
  update() {
    this.move();
    this.draw();
    if (mouse.clicked) {
      this.drawOnCanvas();
    }
  }
};

radiusInput.addEventListener('input', function() { dotRadius = parseFloat(this.value) });
colorInput.addEventListener('change', function() { color = this.value });
smoothnessInput.addEventListener('input', function() { smoothness = parseInt(this.value) });
clearButton.addEventListener('click', () => { drawingCTX.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height) });

window.addEventListener('resize', (): void => {
  dotCanvas.width = window.innerWidth;
  dotCanvas.height = window.innerHeight;

  drawingCanvas.width = window.innerWidth;
  drawingCanvas.height = window.innerHeight;
});

dotCanvas.addEventListener('mousedown', (): void => {
  mouse.clicked = true;
  dot.x = mouse.x;
  dot.y = mouse.y;
});
dotCanvas.addEventListener('mouseup', (): void =>  {
  mouse.clicked = false;
  drawingCTX.beginPath();
});
dotCanvas.addEventListener('mouseleave', (): void => {
  mouse.clicked = false;
  drawingCTX.beginPath();
});

dotCanvas.addEventListener('mousemove', (event: MouseEvent): void => {
  mouse.update(event.offsetX, event.offsetY);
});

dotCanvas.addEventListener('click', (event: MouseEvent): void => {
  mouse.update(event.offsetX, event.offsetY);
});

const render = (now: DOMHighResTimeStamp) => {
  
  if (fpsIntervalElapsed(now)) {
    
    // Clear canvas
    dotCTX.clearRect(0, 0, dotCanvas.width, dotCanvas.height);

    dot.update();

  }

  requestAnimationFrame(render);

}

render(0);