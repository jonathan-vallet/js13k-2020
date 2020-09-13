let firstLineCoordinateList = [];
let lastLineCoordinateList = [];
let surroundingsCoordinateList = [];

function generateMap() {
    let xSpace = 150;
    let ySpace = MAP_Y_SPACE;
    $map.width = xSpace * 6; // 4 room + 1 space each side
    $map.height = ySpace * (LEVEL_STAGE_NUMBER + 3);
    stageList.push([{ e: 'm' }, { e: 'm' }, { e: 'm' }]); // First stage encounter is a choice of 3 monsters
    let index = 0;
    while(++index < LEVEL_STAGE_NUMBER) {
        stageList.push(generateStage(index % 4 ? 'mmmmmmmeeet' : 'mhhssss'));
    }
    stageList.push([{ e: 'h' }, { e: 'h' }, { e: 'h' }]); // Adds a heal room before boss
    stageList.push([{ e: 'b' }]); // Last stage is a boss
    linkStages();
    drawRooms();
    requestAnimationFrame(updateMapBackground);
}

function generateStage(roomPossibilities) {
    var roomNumber = getRandomNumber(3, 4); // 3 or 4 rooms per stage max
    var stage = [];
    let roomIndex = 0;
    while(roomIndex++ < roomNumber) {
        stage.push({ 'e': getRandomItem(Array.from(roomPossibilities)) });
    }
    return stage;
}

// Create links between rooms of each stage to get multiple paths
function linkStages() {
    for (let y in stageList) {
        y = +y;
        let stage = stageList[y];
        let nextStage = stageList[y + 1];
        if (nextStage) {
            let currentMinRoom = 0;
            for (let x in stage) {
                x = +x;
                var room = stage[x];
                room.l = [];

                if (x >= stage.length - 1) {
                    // always link to last room
                    while(currentMinRoom < nextStage.length) {
                        room.l.push(currentMinRoom++);
                    }
                } else {
                    // At least one link
                    room.l.push(currentMinRoom);
                    if (nextStage.length > currentMinRoom + 1) {
                        ++currentMinRoom;
                        if (random() > 0.65) {
                            room.l.push(currentMinRoom);
                        }
                    }
                }
            }
        }
    }
}

function drawMap() {
    let ctx = $map.getContext('2d');

    // Fill grass background
    ctx.fillStyle = '#7e7';
    ctx.fillRect(0, 0, $map.width, $map.height);

    // Draw lines between rooms
    for (let [y, stage] of Object.entries(stageList)) {
        y = +y;
        let nextStage = stageList[y + 1];
        if (nextStage) {
            for (let [x, room] of Object.entries(stage)) {
                x = +x;
                for (let linkIndex in room.l) {
                    let targetRoom = nextStage[room.l[linkIndex]];
                    ctx.beginPath();
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#ffa';
                    ctx.setLineDash([10, 5]);
                    ctx.moveTo(room.x + linkIndex * 10 - 10, room.y - 25);
                    ctx.lineTo(targetRoom.x - 12, targetRoom.y + 10);
                    ctx.stroke();
                }
            }
        }
    }

    // Draw surroundings
    ['#ffa', '#cff', '#7cc', '#0bb'].forEach((color, layoutIndex) => {
        for(let side = -1; side <= 1; side +=2) {
            let sideCoordinateList = [...firstLineCoordinateList];
            let startX = 0;
            if(side > 0) {
                sideCoordinateList = [...lastLineCoordinateList];
                startX = $map.width;
            }

            ctx.beginPath();
            ctx.fillStyle = color;
            if(!surroundingsCoordinateList[layoutIndex]) {
                surroundingsCoordinateList[layoutIndex] = [];
            }

            if(!surroundingsCoordinateList[layoutIndex][0]) {
                let minMax = (layoutIndex == 0 ? 0 : layoutIndex == 1 ? 5 : layoutIndex == 2 ? 3 : 1);
                surroundingsCoordinateList[layoutIndex][0] = {
                    direction: random() > 0.5 ? -1 : 1,
                    offset: (layoutIndex == 0 ? 80 : layoutIndex == 1 ? 120 : layoutIndex == 2 ? 140 : 180),
                    speed: (layoutIndex == 0 ? 0 : layoutIndex == 1 ? 0.1 : layoutIndex == 2 ? 0.08 : 0.05),
                }
                surroundingsCoordinateList[layoutIndex][0].min = surroundingsCoordinateList[layoutIndex][0].offset - minMax;
                surroundingsCoordinateList[layoutIndex][0].max = surroundingsCoordinateList[layoutIndex][0].offset + minMax;
                surroundingsCoordinateList[layoutIndex][0].offset += getRandomNumber(-minMax, minMax);
            }

            surroundingsCoordinateList[layoutIndex][0].offset += surroundingsCoordinateList[layoutIndex][0].direction * surroundingsCoordinateList[layoutIndex][0].speed;
            if(surroundingsCoordinateList[layoutIndex][0].offset <= surroundingsCoordinateList[layoutIndex][0].min || surroundingsCoordinateList[layoutIndex][0].offset >= surroundingsCoordinateList[layoutIndex][0].max) {
                surroundingsCoordinateList[layoutIndex][0].offset = Math.max(surroundingsCoordinateList[layoutIndex][0].min, Math.min(surroundingsCoordinateList[layoutIndex][0].offset, surroundingsCoordinateList[layoutIndex][0].max));
                surroundingsCoordinateList[layoutIndex][0].direction *= -1;
            }

            ctx.moveTo(sideCoordinateList[0].x + side * (surroundingsCoordinateList[layoutIndex][0].offset - 25), 2500);
            let lastX = 0;
            for(let index in sideCoordinateList) {
                index = +index;
                if(!surroundingsCoordinateList[layoutIndex][index + 1]) {
                    let minMax = (layoutIndex == 0 ? 0 : layoutIndex == 1 ? 5 : layoutIndex == 2 ? 3 : 1);
                    surroundingsCoordinateList[layoutIndex][index + 1] = {
                        direction: random() > 0.5 ? -1 : 1,
                        offset: (layoutIndex == 0 ? 80 : layoutIndex == 1 ? 120 : layoutIndex == 2 ? 130 : 160) + getRandomNumber(-minMax, minMax),
                        speed: 0.05
                    }
                    surroundingsCoordinateList[layoutIndex][index + 1].min = surroundingsCoordinateList[layoutIndex][index + 1].offset - minMax;
                    surroundingsCoordinateList[layoutIndex][index + 1].max = surroundingsCoordinateList[layoutIndex][index + 1].offset + minMax;
                    surroundingsCoordinateList[layoutIndex][index + 1].offset += getRandomNumber(-minMax, minMax);
                }
    
                surroundingsCoordinateList[layoutIndex][index + 1].offset += surroundingsCoordinateList[layoutIndex][index + 1].direction * surroundingsCoordinateList[layoutIndex][index + 1].speed;
                if(surroundingsCoordinateList[layoutIndex][index + 1].offset <= surroundingsCoordinateList[layoutIndex][index + 1].min || surroundingsCoordinateList[layoutIndex][index + 1].offset >= surroundingsCoordinateList[layoutIndex][index + 1].max) {
                    surroundingsCoordinateList[layoutIndex][index + 1].offset = Math.max(surroundingsCoordinateList[layoutIndex][index + 1].min, Math.min(surroundingsCoordinateList[layoutIndex][index + 1].offset, surroundingsCoordinateList[layoutIndex][index + 1].max));
                    surroundingsCoordinateList[layoutIndex][index + 1].direction *= -1;
                }

                let offset = surroundingsCoordinateList[layoutIndex][index + 1].offset;
                if(index == stageList.length - 1) {
                    offset += 200;
                }
                let x = sideCoordinateList[index].x + side * offset;
                let y = sideCoordinateList[index].y;
                ctx.lineTo(x, y);
                lastX = x;
            }
            ctx.lineTo(lastX - side * 15, 0);
            ctx.lineTo(startX, 0);
            ctx.lineTo(startX, $map.height);
            ctx.fill();
        }
    });
}

function drawRooms() {
    let xSpace = 150;
    let ySpace = MAP_Y_SPACE;
    // Draw every room of every stage on a grid with a random move
    for (let [y, stage] of Object.entries(stageList)) {
        y = +y;
        for (let [x, room] of Object.entries(stage)) {
            x = +x;
            let xPosition = ~~(xSpace * (x + 3.2 + random() * 0.6 - stage.length / 2));
            // Adds space for smaller stages to avoid big gap between level width
            if(stage.length == 3) {
                if(x == 0) { xPosition -= 70; }
                if(x == 2) { xPosition += 70; }
            }
            let yPosition = ~~($map.height - (ySpace * (y + 1.1 - random() * 0.4)));
            let fontSize = y == (stageList.length - 1) ? 60 : 25;
            room.x = xPosition;
            room.y = yPosition;
            let screenLink = 'screen-game';
            if(room.e == 'h') { // heal room
                screenLink = 'screen-heal';
            }
            if(room.e == 's') { // seller room
                screenLink = 'screen-seller';
            }
            if(room.e == 't') { // treasure room
                screenLink = 'screen-reward';
            }
            // Adds some random symbol
            let roomSymbol = (y > 0 && y < stageList.length - 2 && random() < 0.18) ? STAGE_TYPE_LIST['r'] : STAGE_TYPE_LIST[room.e];
            $mapWrapper.insertAdjacentHTML('beforeend', `<p style="left:${xPosition - fontSize}px;top:${yPosition - fontSize}px" data-floor="${y}" data-x="${x}" class="js-screen-link" data-screen="${screenLink}">${roomSymbol}</p>`);
            if(x === 0) {
                firstLineCoordinateList.push({x: xPosition, y: yPosition});
            }
            if(x === stage.length - 1) {
                lastLineCoordinateList.push({x: xPosition, y: yPosition});
            }
        }
    }
}

function updateMapBackground(timestamp) {
    requestAnimationFrame(updateMapBackground);
    if(player.s != 'map') {
        return;
    }
    let now = Date.now();
    let elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        drawMap();
    }
}