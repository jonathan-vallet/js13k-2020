// Base class list with colors
var BASE_CLASS_LIST = {
    'w': '#942',
    'm': '#18b',
    't': '#449',
    'a': '#777',
    'p': '#a80',
    'h': '#162'
};

// TODO: voir si avec les noms doubles uniquement je gagne en place
const CLASS_NAME_LIST = {
    'w': 'warrior',
    'm': 'mage',
    't': 'thief',
    'a': 'assassin',
    'p': 'protector',
    'h': 'heal',
    'mw': 'battlemage',
    'tw': 'rogue',
    'aw': 'slayer',
    'pw': 'paladin',
    'hw': 'templar',
    'mt': 'warlock',
    'am': 'dreamkiller',
    'mp': 'guardian',
    'hm': 'runemaster',
    'at': 'ninja',
    'pt': 'brigand',
    'ht': 'trickster',
    'ap': 'ranger',
    'ah': 'avenger',
    'hp': 'sage',
}

// TODO: si je e stock pas d'autre info, virer le "symbol"
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
var $myCardList = $('myCardList');
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
// Links
let $diceList = $('c-diceList');

// Game var. Cards are in deck by default. You draw them in your hand, and discard when played. When deck is empty, shuffle discard to create a new deck list
var myDiscardList = [];
var myHandList = [];
var myDeckList = getFromLS('deck') || [];

// Map
var LEVEL_STAGE_NUMBER = 12;
var stageList = [];

// 0: player, 1: opponent
var playerList = [
    {
        id: 1,
        m: 100, // max life points
        l: 0, // currentlifepoints
    },
    {
        id: 2,
        m: 15, // max life points
        l: 0, // currentlifepoints
    }
];