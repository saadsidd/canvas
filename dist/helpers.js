import Stats from '../lib/stats.js';
export const createStats = () => {
    const stats = new Stats();
    stats.dom.style.right = '0px';
    stats.dom.style.left = '';
    document.body.appendChild(stats.dom);
    return stats;
};
export const getRandomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
export const createCenterCrosshair = () => {
    const crosshair = new Image();
    crosshair.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFAAAA////pdmf3QAAAAJ0Uk5TAP9bkSK1AAAAE0lEQVR4nGNgbGDARP//gxA2KQAFtgsLandQLgAAAABJRU5ErkJggg==';
    return (ctx, canvas) => {
        ctx.drawImage(crosshair, (canvas.width / 2) - (crosshair.width / 2), (canvas.height / 2) - (crosshair.height / 2));
    };
};
let now = 0;
let then = 0;
let delta = 0;
export const getDelta = () => {
    now = performance.now();
    delta = (now - then) / 1000;
    then = now;
    if (delta > 0.1)
        return 0.01;
    return delta;
};
export const createFPSLimiter = (fps) => {
    let fpsInterval = 1000 / fps;
    let before = performance.now();
    let elapsed = 0;
    return (now) => {
        elapsed = now - before;
        if (elapsed > fpsInterval) {
            before = now - (elapsed % fpsInterval);
            return true;
        }
        return false;
    };
};
