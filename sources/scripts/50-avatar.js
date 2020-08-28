var currentAvatarSelected = 1   ;

function drawAvatars() {
    for (const [type, value] of Object.entries(BASE_CLASS_LIST)) {
        let canvas = createAvatar(type, type);
        canvas.setAttribute('data-type', type);
        canvas.onclick = () => {
            var newType = canvas.getAttribute(`data-type`);
            $avatarChoiceList.setAttribute(`data-t${++currentAvatarSelected % 2}`, newType);
            setMyAvatar($avatarChoiceList.dataset.t0, $avatarChoiceList.dataset.t1);
            canvas.classList.add(`-choice${currentAvatarSelected % 2}`);
        };

        $avatarChoiceList.append(canvas);
    }
}

// Creates avatar from player selection on class selection screen
function setMyAvatar(type1, type2) {
    let canvas = createAvatar(type1, type2);
    $myAvatar.innerHTML = '';
    $myAvatar.append(canvas);

    // TODO: do this when saving
    setFromLS('avatar', type1 + type2);
}

function createAvatar(type1, type2) {
    let canvasWrapper = createElement('div');
    let canvas = createElement('canvas');
    let ctx = canvas.getContext('2d');
    const canvasSize = 200;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    drawBaseAvatar(canvas, ctx, BASE_CLASS_LIST[type1], BASE_CLASS_LIST[type2]);
    drawAvatarArmor(canvas, ctx, type1);
    drawAvatarWeapon(canvas, ctx, type2);

    addHoverEffect(canvasWrapper);

    canvasWrapper.append(canvas);
    canvasWrapper.insertAdjacentHTML('beforeend', `<p>${CLASS_NAME_LIST[getCardTypes(type1 + type2)]}</p>`);
    return canvasWrapper;
}

function drawBaseAvatar(canvas, ctx, backgroundColor1, backgroundColor2) {
    const canvasSize = canvas.width;
    // Background
        
    var gradient = ctx.createLinearGradient(canvasSize * 0.2, canvasSize * 0.2, canvasSize * 0.6, canvasSize);
    gradient.addColorStop(0, backgroundColor1);
    gradient.addColorStop(1, backgroundColor2);
    drawCircle(ctx, gradient, canvasSize * 0.5, canvasSize * 0.6, canvasSize * 0.4, 0, CIRCLE_ANGLE);

    //Head
    drawCircle(ctx, '#b87', canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.25, 0, CIRCLE_ANGLE);

    // Eyes
    drawCircle(ctx, '#124', canvasSize / 1.7, canvasSize / 2.2, canvasSize / 35, 0, CIRCLE_ANGLE);
    drawCircle(ctx, '#124', canvasSize / 2.2, canvasSize / 2.2, canvasSize / 35, 0, CIRCLE_ANGLE);
}   


function drawAvatarArmor(canvas, ctx, type) {
    const canvasSize = canvas.width;
    switch(type) {
        case 'w':
            drawCircle(ctx, '#999', canvasSize *0.45, canvasSize * 0.5, canvasSize * 0.26, PI * 1.05, PI * 1.9);
            drawTriangle(ctx, '#999', canvasSize * 0.33, canvasSize * 0.3, canvasSize * 0.2, canvasSize * 0.2, canvasSize * 0.28, canvasSize * 0.4);
            drawTriangle(ctx, '#999', canvasSize * 0.56, canvasSize * 0.3, canvasSize * 0.7, canvasSize * 0.2, canvasSize * 0.62, canvasSize * 0.4);
        break;
        case 'm':
            drawTriangle(ctx, '#138', canvasSize * 0.2, canvasSize * 0.3, canvasSize * 0.75, canvasSize * 0.38, canvasSize * 0.5, canvasSize * 0.1);
            drawTriangle(ctx, '#138', canvasSize * 0.28, canvasSize * 0.3, canvasSize * 0.7, canvasSize * 0.38, canvasSize * 0.52, canvasSize * 0);
        break;
        case 't':
            drawCircle(ctx, '#124', canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.25, - PI * 1.9, - PI * 1.1);
            drawTriangle(ctx, '#124', canvasSize * 0.55, canvasSize * 0.5, canvasSize * 0.7, canvasSize * 0.58, canvasSize * 0.2, canvasSize * 0.58);
        break;
        case 'a':
            drawCircle(ctx, '#333', canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.25, PI * 2, PI);
        break;
        case 'p':
            drawCircle(ctx, '#999', canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.3, PI * 1.05, PI * 1.95);
            drawCircle(ctx, '#999', canvasSize * 0.45, canvasSize * 0.5, canvasSize * 0.27, PI * 2, PI);
        break;
        case 'h':
            drawTriangle(ctx, '#242', canvasSize * 0.2, canvasSize * 0.3, canvasSize * 0.75, canvasSize * 0.38, canvasSize * 0.5, canvasSize * 0.1);
            drawTriangle(ctx, '#242', canvasSize * 0.28, canvasSize * 0.3, canvasSize * 0.7, canvasSize * 0.38, canvasSize * 0.52, canvasSize * 0);
        break;
    }
}

function drawAvatarWeapon(canvas, ctx, type) {
    const canvasSize = canvas.width;
    switch(type) {
        case 'w':
            drawTriangle(ctx, '#999', canvasSize * 0.75, canvasSize * 0.47, canvasSize * 0.9, canvasSize * 0.4, canvasSize * 0.86, canvasSize * 0.6);
            drawTriangle(ctx, '#421', canvasSize * 0.6, canvasSize, canvasSize * 0.8, canvasSize * 0.4, canvasSize * 0.68, canvasSize);
        break;
        case 'm':
            drawTriangle(ctx, '#421', canvasSize * 0.6, canvasSize, canvasSize * 0.8, canvasSize * 0.4, canvasSize * 0.68, canvasSize);
            drawCircle(ctx, '#822', canvasSize * 0.8, canvasSize * 0.42, canvasSize * 0.1, 0, CIRCLE_ANGLE);
        break;
        case 't':
            drawTriangle(ctx, '#999', canvasSize * 0.6, canvasSize, canvasSize * 0.72, canvasSize * 0.6, canvasSize * 0.68, canvasSize);
        break;
        case 'a':
            drawCircle(ctx, '#111', canvasSize * 0.7, canvasSize * 0.8, canvasSize * 0.1, 0, CIRCLE_ANGLE);
            drawTriangle(ctx, '#111', canvasSize * 0.7, canvasSize * 0.6, canvasSize * 0.65, canvasSize * 0.8, canvasSize * 0.75, canvasSize * 0.8);
        break;
        case 'p':
            drawCircle(ctx, '#444', canvasSize * 0.67, canvasSize * 0.75, canvasSize * 0.14, 0, CIRCLE_ANGLE);
            drawTriangle(ctx, '#444', canvasSize * 0.7, canvasSize * 0.95, canvasSize * 0.42, canvasSize * 0.65, canvasSize * 0.88, canvasSize * 0.6);
        break;
        case 'h':
            drawTriangle(ctx, '#421', canvasSize * 0.6, canvasSize, canvasSize * 0.8, canvasSize * 0.4, canvasSize * 0.68, canvasSize);
            drawCircle(ctx, '#481', canvasSize * 0.8, canvasSize * 0.42, canvasSize * 0.1, 0, CIRCLE_ANGLE);
        break;
    }
}

function drawCircle(ctx, fillStyle, x, y, radius, angle, startAngle, endAngle) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, angle, startAngle, endAngle);
    ctx.fill();
}

function drawTriangle(ctx, fillStyle, x1, y1, x2, y2, x3, y3) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
}
