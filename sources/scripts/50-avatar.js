function drawAvatars() {
    for (const [type1, value1] of Object.entries(CLASS_LIST)) {
        //for (const [type2, value2] of Object.entries(CLASS_LIST)) {
            let canvas = createAvatar();
            let ctx = canvas.getContext('2d');
            // drawBaseAvatar(canvas, ctx, value1.c, value2.c);
            // drawAvatarArmor(canvas, ctx, type1);
            // drawAvatarWeapon(canvas, ctx, type2);
            drawBaseAvatar(canvas, ctx, value1.c, value1.c);
            drawAvatarArmor(canvas, ctx, type1);
            drawAvatarWeapon(canvas, ctx, type1);
        //}
    }
}

function createAvatar() {
    let canvas = createElement('canvas');
    const canvasSize = 200;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    $('avatarList').appendChild(canvas);
    return canvas;
}

function drawBaseAvatar(canvas, ctx, backgroundColor1, backgroundColor2) {
    const canvasSize = canvas.width;
    // Background
        
    var gradient = ctx.createLinearGradient(canvasSize * 0.2, canvasSize * 0.2, canvasSize * 0.6, canvasSize);
    gradient.addColorStop(0, backgroundColor1);
    gradient.addColorStop(1, backgroundColor2);
    ctx.fillStyle = gradient;
    drawCircle(ctx, canvasSize * 0.5, canvasSize * 0.6, canvasSize * 0.4, 0, CIRCLE_ANGLE);

    //Head
    ctx.fillStyle = '#b87';
    drawCircle(ctx, canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.25, 0, CIRCLE_ANGLE);

    // Eyes
    ctx.fillStyle = '#124';
    drawCircle(ctx, canvasSize / 1.7, canvasSize / 2.2, canvasSize / 35, 0, CIRCLE_ANGLE);
    drawCircle(ctx, canvasSize / 2.2, canvasSize / 2.2, canvasSize / 35, 0, CIRCLE_ANGLE);
}   


function drawAvatarArmor(canvas, ctx, type) {
    const canvasSize = canvas.width;
    switch(type) {
        case TYPE_WARRIOR:
            ctx.fillStyle = '#999';
            drawCircle(ctx, canvasSize *0.45, canvasSize * 0.5, canvasSize * 0.26, PI * 1.05, PI * 1.9);
            drawTriangle(ctx, canvasSize * 0.33, canvasSize * 0.3, canvasSize * 0.2, canvasSize * 0.2, canvasSize * 0.28, canvasSize * 0.4);
            drawTriangle(ctx, canvasSize * 0.56, canvasSize * 0.3, canvasSize * 0.7, canvasSize * 0.2, canvasSize * 0.62, canvasSize * 0.4);
        break;
        case TYPE_MAGE:
            ctx.fillStyle = '#138'; 
            drawTriangle(ctx, canvasSize * 0.2, canvasSize * 0.3, canvasSize * 0.75, canvasSize * 0.38, canvasSize * 0.5, canvasSize * 0.1);
            drawTriangle(ctx, canvasSize * 0.28, canvasSize * 0.3, canvasSize * 0.7, canvasSize * 0.38, canvasSize * 0.52, canvasSize * 0);
        break;
        case TYPE_THIEF:
            ctx.fillStyle = '#124';
            drawCircle(ctx, canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.25, - PI * 1.9, - PI * 1.1);
            drawTriangle(ctx, canvasSize * 0.55, canvasSize * 0.5, canvasSize * 0.7, canvasSize * 0.58, canvasSize * 0.2, canvasSize * 0.58);
        break;
        case TYPE_ASSASSIN:
            ctx.fillStyle = '#333';
            drawCircle(ctx, canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.25, PI * 2, PI);
        break;
        case TYPE_PROTECTOR:
            ctx.fillStyle = '#999';
            drawCircle(ctx, canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.3, PI * 1.05, PI * 1.95);
            drawCircle(ctx, canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.27, PI * 2, PI);
        break;
        case TYPE_HEAL:
            ctx.fillStyle = '#242'; 
            drawTriangle(ctx, canvasSize * 0.2, canvasSize * 0.3, canvasSize * 0.75, canvasSize * 0.38, canvasSize * 0.5, canvasSize * 0.1);
            drawTriangle(ctx, canvasSize * 0.28, canvasSize * 0.3, canvasSize * 0.7, canvasSize * 0.38, canvasSize * 0.52, canvasSize * 0);
        break;
    }
}

function drawAvatarWeapon(canvas, ctx, type) {
    const canvasSize = canvas.width;
    switch(type) {
        case TYPE_WARRIOR:
            ctx.fillStyle = '#999';
            drawTriangle(ctx, canvasSize * 0.75, canvasSize * 0.47, canvasSize * 0.9, canvasSize * 0.4, canvasSize * 0.86, canvasSize * 0.6);
            ctx.fillStyle = '#421'; 
            drawTriangle(ctx, canvasSize * 0.6, canvasSize, canvasSize * 0.8, canvasSize * 0.4, canvasSize * 0.68, canvasSize);
        break;
        case TYPE_MAGE:
            ctx.fillStyle = '#421'; 
            drawTriangle(ctx, canvasSize * 0.6, canvasSize, canvasSize * 0.8, canvasSize * 0.4, canvasSize * 0.68, canvasSize);
            ctx.fillStyle = '#822';
            drawCircle(ctx, canvasSize * 0.8, canvasSize * 0.42, canvasSize * 0.1, 0, CIRCLE_ANGLE);
        break;
        case TYPE_THIEF:
            ctx.fillStyle = '#999';
            drawTriangle(ctx, canvasSize * 0.6, canvasSize, canvasSize * 0.72, canvasSize * 0.6, canvasSize * 0.68, canvasSize);
        break;
        case TYPE_ASSASSIN:
            ctx.fillStyle = '#111';
            drawCircle(ctx, canvasSize * 0.7, canvasSize * 0.8, canvasSize * 0.1, 0, CIRCLE_ANGLE);
            drawTriangle(ctx, canvasSize * 0.7, canvasSize * 0.6, canvasSize * 0.65, canvasSize * 0.8, canvasSize * 0.75, canvasSize * 0.8);
        break;
        case TYPE_PROTECTOR:
            ctx.fillStyle = '#444';
            drawCircle(ctx, canvasSize * 0.67, canvasSize * 0.75, canvasSize * 0.14, 0, CIRCLE_ANGLE);
            drawTriangle(ctx, canvasSize * 0.7, canvasSize * 0.95, canvasSize * 0.42, canvasSize * 0.65, canvasSize * 0.88, canvasSize * 0.6);
        break;
        case TYPE_HEAL:
            ctx.fillStyle = '#421'; 
            drawTriangle(ctx, canvasSize * 0.6, canvasSize, canvasSize * 0.8, canvasSize * 0.4, canvasSize * 0.68, canvasSize);
            ctx.fillStyle = '#481';
            drawCircle(ctx, canvasSize * 0.8, canvasSize * 0.42, canvasSize * 0.1, 0, CIRCLE_ANGLE);
        break;
    }
}

function drawCircle(ctx, x, y, radius, angle, startAngle, endAngle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, angle, startAngle, endAngle);
    ctx.fill();
}

function drawTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
}
