var LEVEL_STAGE_NUMBER = 15;
var stageList = [];

function generateMap() {
    stageList.push([{ e: 'm' }, { e: 'm' }, { e: 'm' }]); // First stage is a choice of 3 monsters
    for (let index = 1; index < LEVEL_STAGE_NUMBER; ++index) {
        stageList.push(generateStage());
    }
    stageList.push([{ e: 'b' }]); // Last stage is a boss
    linkStages();
    drawMap();
}

function generateStage() {
    var roomNumber = getRandomNumber(3, 4); // 3 or 4 rooms per stage max
    var stage = [];
    for (let roomIndex = 0; roomIndex < roomNumber; ++roomIndex) {
        stage.push({ 'e': getRandomItem(Array.from('mmmmmeetrrrsh')) });
    }
    return stage;
}

// Create links between rooms of each stage to get multiple paths
function linkStages() {
    for (let y in stageList) {
        y = +y;
        var stage = stageList[y];
        var nextStage = stageList[y + 1];
        if (nextStage) {
            var currentMinRoom = 0;
            for (let x in stage) {
                x = +x;
                var room = stage[x];
                room.l = [];

                if (x === stage.length - 1) {
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
    let ySpace = 130;
    let firstLineCoordinateList = [];
    let lastLineCoordinateList = [];
    ctx.filter = "grayscale(50%)";
    $map.width = xSpace * 6; // 4 room + 1 space each side
    $map.height = ySpace * (LEVEL_STAGE_NUMBER + 1);

    ctx.fillStyle = '#7e7';
    ctx.fillRect(0, 0, $map.width, $map.height);

    // Draw every room of every stage on a grid with a random move
    for (let [y, stage] of Object.entries(stageList)) {
        let fontSize = y == (stageList.length - 1) ? 60 : 20;
        ctx.font = `${fontSize}px serif`;
        y = +y;
        for (let [x, room] of Object.entries(stage)) {
            x = +x;
            var xPosition = ~~(xSpace * (x + 3.2 + random() * 0.6 - stage.length / 2));
            var yPosition = ~~($map.height - (ySpace * (y + 0.6 - random() * 0.4)));
            room.x = xPosition;
            room.y = yPosition;
            $mapWrapper.insertAdjacentHTML('beforeend', `<p style="left:${xPosition - fontSize - 3}px;top:${yPosition - fontSize}px" data-level="${y}" class="js-screen-link" data-screen="screen-game">${STAGE_TYPE_LIST[room.e].s}</p>`);
            if(x === 0) {
                firstLineCoordinateList.push({x: xPosition, y: yPosition});
            }
            if(x === stage.length - 1) {
                lastLineCoordinateList.push({x: xPosition, y: yPosition});
            }
        }
    }

    // Draw surroundings
    // TODO: essayer de factoriser les lignes de avant/après
    ['#ffa', '#cff', '#7cc', '#0bb'].forEach((color, layoutIndex) => {
        ctx.beginPath();
        ctx.moveTo(firstLineCoordinateList[0].x + getRandomNumber(-5, 5) - layoutIndex * 8, 2500);
        for(let index in firstLineCoordinateList) {
            let offset = (4 - layoutIndex) * 5 + (layoutIndex == 0 ? 50 + (index == stageList.length - 1 ? 200 : 0) : 0);
            let x = firstLineCoordinateList[index].x - offset - getRandomNumber(0, 5);
            let y = firstLineCoordinateList[index].y + getRandomNumber(-5, 5);
            ctx.lineTo(x, y);
            firstLineCoordinateList[index].x = x;
            firstLineCoordinateList[index].y = y;
        }
        ctx.lineTo(firstLineCoordinateList[firstLineCoordinateList.length - 1 ].x + getRandomNumber(-5, 5) - layoutIndex * 5, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, 2500);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(lastLineCoordinateList[0].x + getRandomNumber(-5, 5) + layoutIndex * 5, 2500);
        for(let index in lastLineCoordinateList) {
            let offset = (4 - layoutIndex) * 6 + (layoutIndex == 0 ? 30 + (index == stageList.length - 1 ? 200 : 0) : 0);
            let x = lastLineCoordinateList[index].x + offset - getRandomNumber(0, 5);
            let y = lastLineCoordinateList[index].y + getRandomNumber(-5, 5);
            ctx.lineTo(x, y);
            lastLineCoordinateList[index].x = x;
            lastLineCoordinateList[index].y = y;
        }
        ctx.lineTo(lastLineCoordinateList[lastLineCoordinateList.length - 1].x - getRandomNumber(0, 5) + layoutIndex * 5, 0);
        ctx.lineTo($map.width, 0);
        ctx.lineTo($map.width, 2500);
        ctx.fillStyle = color;
        ctx.fill();
    });

    // Draw lines between rooms
    for (let [y, stage] of Object.entries(stageList)) {
        y = +y;
        var nextStage = stageList[y + 1];
        if (nextStage) {
            for (let [x, room] of Object.entries(stage)) {
                x = +x;
                for (let linkIndex in room.l) {
                    let targetRoom = nextStage[room.l[linkIndex]];
                    ctx.beginPath();
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#ffa';
                    ctx.moveTo(room.x + linkIndex * 10 - 10, room.y - 25);
                    ctx.lineTo(targetRoom.x - 12, targetRoom.y + 10);
                    ctx.stroke();
                }
            }
        }
    }
}