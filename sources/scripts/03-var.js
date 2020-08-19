// Set your global var here
const TYPE_WARRIOR = 'w';
const TYPE_MAGE = 'm';
const TYPE_THIEF = 't';
const TYPE_ASSASSIN = 'a';
const TYPE_PROTECTOR = 'p';
const TYPE_HEAL = 'h';
const TYPE_ROGUE = 'r';

var CLASS_LIST = {};
CLASS_LIST[TYPE_WARRIOR] = {
    n: 'warrior',
    c: '#942'
};
CLASS_LIST[TYPE_MAGE] = {
    n: 'mage',
    c: '#18b'
};
CLASS_LIST[TYPE_THIEF] = {
    n: 'thief',
    c: '#449'
};
CLASS_LIST[TYPE_ASSASSIN] = {
    n: 'assassin',
    c: '#777'
};
CLASS_LIST[TYPE_PROTECTOR] = {
    n: 'protector',
    c: '#a80'
};
CLASS_LIST[TYPE_HEAL] = {
    n: 'heal',
    c: '#162'
}

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

// Elements
var $allcardList = $('allCardList');
var $myCardList = $('myCardList');
var $myDeckList = $('myDeckList');
var $avatarChoiceList = $('avatarChoiceList');
var $myAvatar = $('myAvatar');
var $myAvatarName = $('myAvatarName');
var $map = $('map');
var $continueButton = $('continueButton');

// Links
var $$screenLinkList = $$('.js-screen-link'); // TODO: remplacer par "button" pour éviter d'utiliser une classe?
var $$lifeBarList = $$('.c-lifeBar');
