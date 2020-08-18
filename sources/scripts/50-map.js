const LEVEL_STAGE_NUMBER = 15;
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
    ctx.filter = "grayscale(50%)";
    var xSpace = 150;
    var ySpace = 150;
    $map.width = xSpace * 6; // 4 room + 1 space each side
    $map.height = ySpace * (LEVEL_STAGE_NUMBER + 1);

    // Draw every room of every stage on a grid with a random move
    for (let [y, stage] of Object.entries(stageList)) {
        let fontSize = y == (stageList.length - 1) ? 60 : 20;
        ctx.font = `${fontSize}px serif`;
        y = +y;
        for (let [x, room] of Object.entries(stage)) {
            x = +x;
            // Initial
            //var xPosition = ~~(xSpace * 1 + xSpace * x + xSpace * (3 - stage.length) * 0.5 + xSpace * random() * 0.5 - xSpace * 0.25);
            //var yPosition = ~~($map.height - y * ySpace - 0.4 * ySpace + random() * ySpace * 0.4 - ySpace * 0.2);
            // Optimized
            var xPosition = ~~(xSpace * (x + 2.25 + random() * 0.6 - stage.length / 2));
            var yPosition = ~~($map.height - (ySpace * (y + 0.6 - random() * 0.4)));
            room.x = xPosition;
            room.y = yPosition;
            ctx.fillText(STAGE_TYPE_LIST[room.e].s, xPosition - fontSize, yPosition);
        }
    }

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
                    ctx.moveTo(room.x + linkIndex * 10 - 10, room.y - 25);
                    ctx.lineTo(targetRoom.x - 12, targetRoom.y + 10);
                    ctx.stroke();
                }
            }
        }
    }
}

generateMap();