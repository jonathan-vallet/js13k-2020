const STAGE_TYPE_LIST = {
    'm': { // monster
        's': '💀'
    },
    'e': { // elite
        's': '😈'
    },
    't': { // treasure
        's': '💰'
    },
    'r': { // random
        's': '❓'
    },
    's': { // seller / merchant
        's': '💰'
    },
    'h': { // healer
        's': '💖'
    }
}

const LEVEL_STAGE_NUMBER = 15;
var stageList = [];
function generateMap() {
    console.log('generate map');
    stageList.push(['m', 'm', 'm']); // First stage is a choice of 3 monsters
    for(var index = 1; index < LEVEL_STAGE_NUMBER; ++index) {
        stageList.push(generateStage());
    }
    console.log(stageList);
    drawMap();
}

function generateStage() {
    var roomNumber = getRandomNumber(3, 4); // 3 or 4 rooms per stage max
    var stage = [];
    for(var roomIndex = 0; roomIndex < roomNumber; ++roomIndex) {
        stage.push(Array.from('mmmmmeetrrrsh').getRandom());
    }
    return stage;
}

function drawMap() {
    let ctx = $map.getContext('2d');
    var xSpace = 100;
    var ySpace = 100;
    $map.width = xSpace * 6; // 4 room + 1 space each side
    $map.height = ySpace * LEVEL_STAGE_NUMBER;

    for (const [y, stage] of Object.entries(stageList)) {
        for (const [x, room] of Object.entries(stage)) {
            console.log(x, y, room);
            ctx.font = '20px serif';
            ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);
            var xPosition = xSpace + x * xSpace - (stage.length - 3) * xSpace * 0.5 + Math.random() * xSpace * 0.5 - xSpace * 0.25;
            var yPosition = $map.height - y * ySpace - 0.4 * ySpace + Math.random() * ySpace * 0.4 - ySpace * 0.2;
            ctx.fillText(STAGE_TYPE_LIST[room].s, xPosition, yPosition);
            // TODO: faire un objet avec les room. Stocker le X et Y dedans pour avoir les coordonnées pour tracer les traits entre les rooms.
            // Pour chaque room, on peut avoir 1 trait ou 2. Si le stage suivant a 4 rooms et qu'on en avait 3 et que seuls 3 traits seraient à dessiner, on en ajoute 1 random sur une des rooms de l'étage
            // stocker le nombre de traits pour chaque room aussi, et seulement après on affiche les traits. on peut stocker les index des rooms de l'étape d'après avec lesquels on est relié.
            // Une room sera toujours reliée à celle du même index au minimum, et celle d'avant ou après aléatoirement. ça devrait suffire, même si les chemins seront moins variés, on n'aura pas de cas particulier comme ça
        }
    }
}

generateMap();