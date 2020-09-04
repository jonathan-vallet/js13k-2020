var gameCanvas = $('game-canvas');
let seaCoordinatesList = [];
let sandCoordinatesList = [];
let waveCoordinatesList = [];
let then = Date.now();
let fpsInterval = 50;

function initGameBackground() {
    gameCanvas.width = $screenGame.offsetWidth;
    gameCanvas.height = $screenGame.offsetHeight - 70;
    for(let x = 0; x <= gameCanvas.width; x += getRandomNumber(gameCanvas.width / 7, gameCanvas.width / 9)) {
        let sandY = getRandomNumber(195, 205);
        sandCoordinatesList.push({x, y: sandY, direction: random() > 0.5 ? -1 : 1 });
        waveCoordinatesList.push({x, y: sandY + getRandomNumber(40, 60), direction: random() > 0.5 ? -1 : 1 });
    }
    for(let x = 0; x <= gameCanvas.width; x += getRandomNumber(gameCanvas.width / 7, gameCanvas.width / 9)) {
        seaCoordinatesList.push({x, y: gameCanvas.height - getRandomNumber(195, 205), direction: random() > 0.5 ? 1 : -1 });
    }
    requestAnimationFrame(updateGameBackground);
}

function updateGameBackground(timestamp) {
    requestAnimationFrame(updateGameBackground);
    let now = Date.now();
    let elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        drawBackground();
    }
}

function drawBackground() {
    let ctx = gameCanvas.getContext('2d');
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // sun
    ctx.fillStyle = '#ffa';
    ctx.beginPath();
    ctx.arc(gameCanvas.width - 400, 200, 180, 0, 2 * PI);
    ctx.fill();

    drawBackgroundShape(ctx, '#0bb', seaCoordinatesList, gameCanvas.height - 200, gameCanvas.height - 205, gameCanvas.height - 195, 0.1);
    drawBackgroundShape(ctx, '#cff', waveCoordinatesList, 260, 240, 280);
    drawBackgroundShape(ctx, '#ffa', sandCoordinatesList, 200, 190, 210);

    // island 1
    ctx.fillStyle = '#cff';
    ctx.fill(new Path2D('M661.71 320.09h367.18v-5.44l-7.62-32.24-29.53-26.23-272.72 3.07-57.31 55.4z'));
    ctx.fillStyle = '#ffa';
    ctx.fill(new Path2D('M661.71 314.65l101.49-3.32 76.33 3.32 68.8-2.63 70.83-1.39 49.73 4.02-7.62-37.67-29.53-26.23-272.72 3.06-41.75 27.15z'));
    ctx.fillStyle = '#7e7';
    ctx.fill(new Path2D('M679.77 264.17l20.67 5.64 70.05 5.87 97.65-6.79 92.7 3.4 36.81-6.24 12.15-15.3 9.37-35.97-31.59-28.91-37.61-18.06-110.84-15.06-84.92 6.8-49.53 22.66-33.26 33.99z'));
}

function drawBackgroundShape(ctx, fillStyle, coordinateList, offset = 0, min, max, speed = 0.2) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.moveTo(0, gameCanvas.height);
    ctx.lineTo(0, gameCanvas.height - offset);
    coordinateList.forEach(coordinate => {
        coordinate.y += coordinate.direction * speed;
        if(coordinate.y <= min || coordinate.y >= max) {
            coordinate.y = Math.max(min, Math.min(coordinate.y, max));
            coordinate.direction *= -1;
        }
        ctx.lineTo(coordinate.x, gameCanvas.height - coordinate.y);
    });
    ctx.lineTo(gameCanvas.width, gameCanvas.height - offset);
    ctx.lineTo(gameCanvas.width, gameCanvas.height);
    ctx.fill();
}