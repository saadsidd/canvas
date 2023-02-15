import Stats from '../lib/stats.js';
export const stats = new Stats();
stats.dom.style.right = '0px';
stats.dom.style.left = '';
document.body.appendChild(stats.dom);
export const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};
let now = 0;
let then = 0;
let delta = 0;
export const getDelta = () => {
    now = performance.now();
    delta = (now - then) / 1000;
    then = now;
    if (delta > 0.1)
        return 0.1;
    return delta;
};
