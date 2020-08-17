const STAGE_TYPE_LIST = {
    'm': { // monster
        's': '💀' // s for symbol
    },
    'e': { // elite
        's': '👿'
    },
    'b': { // boss
        's': '😈'
    },
    't': { // treasure
        's': '💰'
    },
    'r': { // random
        's': '❓'
    },
    's': { // seller / merchant
        's': '🤑'
    },
    'h': { // healer
        's': '💖'
    }
}

const LEVEL_STAGE_NUMBER = 15;
var stageList = [];
function generateMap() {
    stageList.push([{e: 'm'}, {e: 'm'}, {e: 'm'}]); // First stage is a choice of 3 monsters
    for(var index = 1; index < LEVEL_STAGE_NUMBER; ++index) {
        stageList.push(generateStage());
    }
    stageList.push([{ e: 'b'}]); // Last stage is a boss
    // linkStages()
    drawMap();
}

function generateStage() {
    var roomNumber = getRandomNumber(3, 4); // 3 or 4 rooms per stage max
    var stage = [];
    for(var roomIndex = 0; roomIndex < roomNumber; ++roomIndex) {
        stage.push({ 'e': getRandomItem(Array.from('mmmmmeetrrrsh')) });
    }
    return stage;
}

// Create links between rooms of each stage to get multiple paths
function linkStages() {
    console.log('create link between stages');
    for(var y in stageList) {
        var stage = stageList[y];
        var nextStage = stageList[y + 1] || [];
        for(var x in stage) {
            console.log(nextStage);
            var room = stage[x];
            if(x == 0) {
                room.l = [0];
            }
            if(x == stage.length) {

            }
        }
    }
}

function drawMap() {
    let ctx = $map.getContext('2d');
    var xSpace = 100;
    var ySpace = 100;
    $map.width = xSpace * 6; // 4 room + 1 space each side
    $map.height = ySpace * (LEVEL_STAGE_NUMBER + 1);

    // Draw every room of every stage on a grid with a random move
    for (var [y, stage] of Object.entries(stageList)) {
        for (var [x, room] of Object.entries(stage)) {
            x = +x;
            y = +y;
            ctx.font = `${y == (stageList.length - 1) ? '60' : '20'}px serif`;
            ctx.filter = "grayscale(50%)";
            // Initial
            //var xPosition = ~~(xSpace * 1 + xSpace * x + xSpace * (3 - stage.length) * 0.5 + xSpace * random() * 0.5 - xSpace * 0.25);
            //var yPosition = ~~($map.height - y * ySpace - 0.4 * ySpace + random() * ySpace * 0.4 - ySpace * 0.2);
            // Optimized
            var xPosition = ~~(xSpace * (x + 2.25 + (random() - stage.length) / 2));
            var yPosition = ~~($map.height - (ySpace * (y + 0.6 - random() * 0.4)));
            room.x = xPosition;
            room.y = yPosition;
            ctx.fillText(STAGE_TYPE_LIST[room.e].s, xPosition, yPosition);
            // TODO: faire un objet avec les room. Stocker le X et Y dedans pour avoir les coordonnées pour tracer les traits entre les rooms.
            // Pour chaque room, on peut avoir 1 trait ou 2. Si le stage suivant a 4 rooms et qu'on en avait 3 et que seuls 3 traits seraient à dessiner, on en ajoute 1 random sur une des rooms de l'étage
            // stocker le nombre de traits pour chaque room aussi, et seulement après on affiche les traits. on peut stocker les index des rooms de l'étape d'après avec lesquels on est relié.
            // Une room sera toujours reliée à celle du même index au minimum, et celle d'avant ou après aléatoirement. ça devrait suffire, même si les chemins seront moins variés, on n'aura pas de cas particulier comme ça
        }
    }
    console.log(stageList);
}

generateMap();