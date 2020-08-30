function generateMap() {
    stageList.push([{ e: 'm' }, { e: 'm' }, { e: 'm' }]); // First stage encounter is a choice of 3 monsters
    let index = 0;
    while(++index < LEVEL_STAGE_NUMBER) {
        // TODO: improve stage repartitions. add a treasure in middle of the way?
        stageList.push(generateStage());
    }
    stageList.push([{ e: 'h' }, { e: 'h' }, { e: 'h' }]); // Adds a heal room before boss
    stageList.push([{ e: 'b' }]); // Last stage is a boss
    linkStages();
    drawMap();
}

function generateStage() {
    var roomNumber = getRandomNumber(3, 4); // 3 or 4 rooms per stage max
    var stage = [];
    let roomIndex = 0;
    while(roomIndex++ < roomNumber) {
        stage.push({ 'e': getRandomItem(Array.from('mmmmmeetrrrsh')) });
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
    let xSpace = 150;
    let ySpace = MAP_Y_SPACE;
    let firstLineCoordinateList = [];
    let lastLineCoordinateList = [];
    $map.width = xSpace * 6; // 4 room + 1 space each side
    $map.height = ySpace * (LEVEL_STAGE_NUMBER + 3);

    // Fill grass background
    ctx.fillStyle = '#7e7';
    ctx.fillRect(0, 0, $map.width, $map.height);

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
            $mapWrapper.insertAdjacentHTML('beforeend', `<p style="left:${xPosition - fontSize}px;top:${yPosition - fontSize}px" data-floor="${y}" data-x="${x}" class="js-screen-link" data-screen="${screenLink}">${STAGE_TYPE_LIST[room.e]}</p>`);
            if(x === 0) {
                firstLineCoordinateList.push({x: xPosition, y: yPosition});
            }
            if(x === stage.length - 1) {
                lastLineCoordinateList.push({x: xPosition, y: yPosition});
            }
        }
    }

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
            let sideCoordinateList = firstLineCoordinateList;
            let startX = 0;
            if(side > 0) {
                sideCoordinateList = lastLineCoordinateList;
                startX = $map.width;
            }

            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(sideCoordinateList[0].x + getRandomNumber(-5, 5) - layoutIndex * 8, 2500);
            for(let index in sideCoordinateList) {
                let offset = (4 - layoutIndex) * 8 + (layoutIndex == 0 ? 50 + (index == stageList.length - 1 ? 200 : 0) : 0);
                let x = sideCoordinateList[index].x + side * (offset - getRandomNumber(0, 5));
                let y = sideCoordinateList[index].y + getRandomNumber(-5, 5);
                ctx.lineTo(x, y);
                sideCoordinateList[index].x = x;
                sideCoordinateList[index].y = y;
            }
            ctx.lineTo(sideCoordinateList[sideCoordinateList.length - 1 ].x + getRandomNumber(-5, 5) + side * layoutIndex * 5, 0);
            ctx.lineTo(startX, 0);
            ctx.lineTo(startX, $map.height);
            ctx.fill();
        }
    });
}