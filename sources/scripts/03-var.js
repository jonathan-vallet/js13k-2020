// Base class list with colors
var BASE_CLASS_LIST = {
    'w': '#e43',
    'm': '#249',
    't': '#0aa',
    'a': '#a28',
    'p': '#f82',
    'h': '#162'
};

const CLASS_NAME_LIST = {
    'w': 'Warrior',
    'm': 'Mage',
    't': 'Thief',
    'a': 'Assassin',
    'p': 'Protector',
    'h': 'Heal',
    'mw': 'Battlemage',
    'tw': 'Rogue',
    'aw': 'Slayer',
    'pw': 'Paladin',
    'hw': 'Templar',
    'mt': 'Warlock',
    'am': 'Dreamkiller',
    'mp': 'Guardian',
    'hm': 'Runemaster',
    'at': 'Ninja',
    'pt': 'Brigand',
    'ht': 'Trickster',
    'ap': 'Ranger',
    'ah': 'Avenger',
    'hp': 'Sage',
}

const STAGE_TYPE_LIST = {
    'm': '💀', // monster
    'e': '👿', // elite
    'b': '😈', // boss
    't': '💰', // treasure
    'r': '❓', // random
    's': '🤑', // seller / merchant
    'h': '💖' // healer
}

// Elements
var $allcardList = $('allCardList');
var $myDeckList = $('myDeckList');
var $avatarChoiceList = $('avatarChoiceList');
var $myAvatar = $('myAvatar');
var $map = $('map');
var $continueButton = $('continueButton');
// TODO: comme pour les life bar, faire 1 par joueur
// TODO: pour le HTML, peut-être dupliquer tout ce qui est data-player=1 en 2 au chargement du jeu?
var $playerAvatar = $('playerAvatar');
var $opponentAvatar = $('opponentAvatar');
var $myDeck = $('myDeck');
var $myHand = $('myHand');
var $endTurnButton = $('endTurnButton');
var $mapWrapper = $('mapWrapper');
var $rewardCardList = $('rewardCardList');
var $screenGame = $('screen-game');
// Links
let $dieList = $('c-dieList');

// Map
var LEVEL_STAGE_NUMBER = 12;
const MAP_Y_SPACE = 130;
var stageList = [];

let playersProxy = {
    set: function(obj, prop, newValue) {
        // console.log('set', obj, prop, newValue);
        obj[prop] = newValue;
        let lifeText = `💖 ${obj.l}/${obj.m}`;
        if(obj.sh) {
            lifeText += ` 🛡 ${obj.sh}`;
        }
        if(obj.p) {
            lifeText += ` 🤢 ${obj.p}`;
        }
        $$(`.c-life[data-p="${obj.id}"] b`).innerText = lifeText;
        if(obj.id == 1) {
            $('playerClass').innerText = getClassName(player.c);
            $('playerLife').innerText = `💖 ${player.l}/${player.m}`;
            $('playerGold').innerText = `💰 ${player.g}`;
            $('playerFloor').innerText = `👣 ${player.f}`;
            setFromLS('player', obj);
        } else {
            setFromLS('opponent', obj);
        }
    }
};

let player = new Proxy({
    id: 1,
    m: 100, // max life points
    l: 0, // currentlifepoints
    sh: 0, // shield
    p: 0, // poison
    s: '' // screen (if step is game, class selection, floor selection...)
    /*
    c: class
    d: deck
    g: gold
    f: current floor
    t: current turn in fight
    */
}, playersProxy);
let opponent = new Proxy({
    id: 2,
    m: 15, // max life points
    l: 0, // currentlifepoints,
    sh: 3, // shield
    p: 0, // poison
}, playersProxy);

let draggedDieId = null; //Save die id when dragged instead of dataTransfer, to be able to check on dragenter